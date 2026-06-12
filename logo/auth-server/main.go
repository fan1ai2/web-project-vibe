package main

import (
	"bytes"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"log"
	"math/big"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var jwtSecret []byte

type User struct {
	ID        int64  `json:"id"`
	Email     string `json:"email"`
	CreatedAt string `json:"createdAt"`
}

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Code     string `json:"code"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

func main() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "logoforge-jwt-secret-dev-only"
	}
	jwtSecret = []byte(secret)

	var err error
	db, err = sql.Open("sqlite3", "./auth.db?_journal=WAL&_busy_timeout=5000")
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	if err := migrate(); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/send-code", cors(handleSendCode))
	mux.HandleFunc("/api/register", cors(handleRegister))
	mux.HandleFunc("/api/login", cors(handleLogin))
	mux.HandleFunc("/api/me", cors(auth(handleMe)))

	// /api/auth/ routes for ai-anime-avatar frontend compatibility
	mux.HandleFunc("/api/auth/send-code", cors(handleSendCode))
	mux.HandleFunc("/api/auth/register", cors(handleAuthRegister))
	mux.HandleFunc("/api/auth/login", cors(handleAuthLogin))
	mux.HandleFunc("/api/auth/me", cors(auth(handleMe)))
	mux.HandleFunc("/api/auth/captcha", cors(handleCaptcha))

	// Background captcha cleanup every 5 minutes
	go cleanupExpiredCaptchas()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("auth server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func migrate() error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		)
	`)
	if err != nil {
		return err
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS verification_codes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL,
			code TEXT NOT NULL,
			expires_at TEXT NOT NULL,
			used INTEGER NOT NULL DEFAULT 0
		)
	`)
	return err
}

func cors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func auth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "缺少认证令牌"})
			return
		}

		tokenStr := strings.TrimPrefix(header, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "令牌无效或已过期"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "令牌解析失败"})
			return
		}

		userIDf, ok := claims["user_id"].(float64)
		if !ok {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "令牌缺少用户信息"})
			return
		}
		userID := int64(userIDf)
		r.Header.Set("X-User-ID", itoa(userID))

		next(w, r)
	}
}

func itoa(n int64) string {
	return strings.TrimSpace(
		strings.Replace(
			strings.Replace(
				mustMarshal(n),
				"[", "", 1,
			), "]", "", 1,
		),
	)
}

func mustMarshal(v interface{}) string {
	b, _ := json.Marshal(v)
	return string(b)
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "仅支持 POST"})
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请求格式错误"})
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || len(req.Password) < 6 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "邮箱格式不正确或密码少于6位"})
		return
	}

	if len(req.Code) != 6 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请输入 6 位验证码"})
		return
	}

	// Check duplicate email before validating code
	var existingID int64
	err := db.QueryRow("SELECT id FROM users WHERE email = ?", req.Email).Scan(&existingID)
	if err == nil {
		writeJSON(w, http.StatusConflict, map[string]string{"error": "该邮箱已注册"})
		return
	}

	// Validate verification code
	var used int
	var expiresAt string
	err = db.QueryRow(
		"SELECT used, expires_at FROM verification_codes WHERE email = ? AND code = ? ORDER BY id DESC LIMIT 1",
		req.Email, req.Code,
	).Scan(&used, &expiresAt)

	if err == sql.ErrNoRows {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "验证码错误"})
		return
	}
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "服务器错误"})
		return
	}

	if used == 1 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "验证码已使用"})
		return
	}

	expTime, err := time.Parse(time.RFC3339, expiresAt)
	if err != nil || time.Now().UTC().After(expTime) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "验证码已过期"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "服务器错误"})
		return
	}

	result, err := db.Exec("INSERT INTO users (email, password_hash) VALUES (?, ?)", req.Email, string(hash))
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE") {
			writeJSON(w, http.StatusConflict, map[string]string{"error": "该邮箱已注册"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "注册失败"})
		return
	}

	userID, _ := result.LastInsertId()

	// Mark code as used only after successful user creation
	db.Exec("UPDATE verification_codes SET used = 1 WHERE email = ? AND code = ?", req.Email, req.Code)

	user := User{ID: userID, Email: req.Email, CreatedAt: time.Now().UTC().Format(time.RFC3339)}

	token, err := generateToken(userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "令牌生成失败"})
		return
	}

	writeJSON(w, http.StatusCreated, AuthResponse{Token: token, User: user})
}

func handleSendCode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "仅支持 POST"})
		return
	}

	var body struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请求格式错误"})
		return
	}

	body.Email = strings.TrimSpace(strings.ToLower(body.Email))
	if body.Email == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请输入邮箱地址"})
		return
	}

	code := generateCode()
	expiresAt := time.Now().UTC().Add(10 * time.Minute).Format(time.RFC3339)

	_, err := db.Exec(
		"INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)",
		body.Email, code, expiresAt,
	)
	if err != nil {
		log.Printf("send-code db error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "验证码发送失败"})
		return
	}

	// In production, send email. For dev, log it.
	log.Printf("[DEV] Verification code for %s: %s (expires at %s)", body.Email, code, expiresAt)

	writeJSON(w, http.StatusOK, map[string]string{"message": "验证码已发送"})
}

func generateCode() string {
	code := make([]byte, 6)
	for i := range code {
		n, _ := rand.Int(rand.Reader, big.NewInt(10))
		code[i] = byte('0' + n.Int64())
	}
	return string(code)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "仅支持 POST"})
		return
	}

	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请求格式错误"})
		return
	}

	creds.Email = strings.TrimSpace(strings.ToLower(creds.Email))

	var user User
	var hash string
	err := db.QueryRow("SELECT id, email, password_hash, created_at FROM users WHERE email = ?", creds.Email).
		Scan(&user.ID, &user.Email, &hash, &user.CreatedAt)
	if err == sql.ErrNoRows {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "邮箱或密码错误"})
		return
	}
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "服务器错误"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(creds.Password)); err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "邮箱或密码错误"})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "令牌生成失败"})
		return
	}

	writeJSON(w, http.StatusOK, AuthResponse{Token: token, User: user})
}

// handleAuthLogin adapts the frontend's login request format to the internal handler.
func handleAuthLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "仅支持 POST"})
		return
	}

	var body struct {
		Username    string `json:"username"`
		Password    string `json:"password"`
		CaptchaID   string `json:"captcha_id"`
		CaptchaCode string `json:"captcha_code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请求格式错误"})
		return
	}

	email := strings.TrimSpace(strings.ToLower(body.Username))

	var user User
	var hash string
	err := db.QueryRow("SELECT id, email, password_hash, created_at FROM users WHERE email = ?", email).
		Scan(&user.ID, &user.Email, &hash, &user.CreatedAt)
	if err == sql.ErrNoRows {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "邮箱或密码错误"})
		return
	}
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "服务器错误"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(body.Password)); err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "邮箱或密码错误"})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "令牌生成失败"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"data": map[string]interface{}{
			"member": user,
			"token":  token,
		},
	})
}

// handleAuthRegister adapts the frontend's register request format.
func handleAuthRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "仅支持 POST"})
		return
	}

	var body struct {
		Username    string `json:"username"`
		Password    string `json:"password"`
		CaptchaID   string `json:"captcha_id"`
		CaptchaCode string `json:"captcha_code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请求格式错误"})
		return
	}

	email := strings.TrimSpace(strings.ToLower(body.Username))
	if email == "" || len(body.Password) < 6 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "邮箱格式不正确或密码少于6位"})
		return
	}

	// Validate image captcha
	if !validateCaptcha(body.CaptchaID, body.CaptchaCode) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "验证码错误或已过期"})
		return
	}

	// Check duplicate email
	var existingID int64
	err := db.QueryRow("SELECT id FROM users WHERE email = ?", email).Scan(&existingID)
	if err == nil {
		writeJSON(w, http.StatusConflict, map[string]string{"error": "该邮箱已注册"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "服务器错误"})
		return
	}

	result, err := db.Exec("INSERT INTO users (email, password_hash) VALUES (?, ?)", email, string(hash))
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE") {
			writeJSON(w, http.StatusConflict, map[string]string{"error": "该邮箱已注册"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "注册失败"})
		return
	}

	userID, _ := result.LastInsertId()

	user := User{ID: userID, Email: email, CreatedAt: time.Now().UTC().Format(time.RFC3339)}
	token, err := generateToken(userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "令牌生成失败"})
		return
	}

	writeJSON(w, http.StatusCreated, map[string]interface{}{
		"data": map[string]interface{}{
			"member": user,
			"token":  token,
		},
	})
}

// --- Captcha ---

type captchaEntry struct {
	Code      string
	ExpiresAt time.Time
}

var captchaStore sync.Map

func cleanupExpiredCaptchas() {
	for {
		time.Sleep(5 * time.Minute)
		now := time.Now()
		captchaStore.Range(func(key, value interface{}) bool {
			if entry, ok := value.(captchaEntry); ok && now.After(entry.ExpiresAt) {
				captchaStore.Delete(key)
			}
			return true
		})
	}
}

func generateCaptchaCode(n int) string {
	const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	code := make([]byte, n)
	for i := range code {
		idx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		code[i] = charset[idx.Int64()]
	}
	return string(code)
}

// pixelFont maps ASCII chars to 5x7 bitmaps (row-major, 1=on 0=off).
var pixelFont = map[byte][]byte{
	'2': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1},
	'3': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0},
	'4': {0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0},
	'5': {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0},
	'6': {0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0},
	'7': {1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0},
	'8': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0},
	'9': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0},
	'A': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1},
	'B': {1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0},
	'C': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0},
	'D': {1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0},
	'E': {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1},
	'F': {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0},
	'G': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0},
	'H': {1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1},
	'J': {0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0},
	'K': {1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1},
	'L': {1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1},
	'M': {1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1},
	'N': {1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1},
	'P': {1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0},
	'Q': {0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1},
	'R': {1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1},
	'S': {0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0},
	'T': {1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0},
	'U': {1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0},
	'V': {1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0},
	'W': {1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0},
	'X': {1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1},
	'Y': {1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0},
	'Z': {1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1},
}

func drawCaptchaImage(code string) ([]byte, error) {
	cellW := 12
	gap := 4
	width := len(code)*(cellW+gap) + 8
	height := 50
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	// Off-white background
	bg := color.RGBA{250, 248, 245, 255}
	draw.Draw(img, img.Bounds(), &image.Uniform{bg}, image.Point{}, draw.Src)

	// Noise dots
	for i := 0; i < 50; i++ {
		x, _ := rand.Int(rand.Reader, big.NewInt(int64(width)))
		y, _ := rand.Int(rand.Reader, big.NewInt(int64(height)))
		cv, _ := rand.Int(rand.Reader, big.NewInt(180))
		v := uint8(cv.Int64())
		img.Set(int(x.Int64()), int(y.Int64()), color.RGBA{v, v, v, 180})
	}

	// Random curved lines for noise
	for i := 0; i < 2; i++ {
		x, _ := rand.Int(rand.Reader, big.NewInt(int64(width-20)))
		y, _ := rand.Int(rand.Reader, big.NewInt(int64(height-10)))
		for j := 0; j < 25; j++ {
			px := int(x.Int64()) + j
			offY, _ := rand.Int(rand.Reader, big.NewInt(5))
			py := int(y.Int64()) + int(offY.Int64())
			if px < width && py < height {
				img.Set(px, py, color.RGBA{200, 190, 180, 100})
			}
		}
	}

	// Draw each character using pixel font
	for ci := 0; ci < len(code); ci++ {
		bitmap, ok := pixelFont[code[ci]]
		if !ok {
			continue
		}
		offsetX := 4 + ci*(cellW+gap)
		offsetY := 8

		// Random slight rotation effect via y offsets
		baseY, _ := rand.Int(rand.Reader, big.NewInt(8))

		for row := 0; row < 7; row++ {
			for col := 0; col < 5; col++ {
				if bitmap[row*5+col] != 0 {
					px := offsetX + col*2
					py := offsetY + row*2 + int(baseY.Int64())
					// Draw 2x2 pixel block
					c := color.RGBA{45, 40, 35, 255}
					img.Set(px, py, c)
					img.Set(px+1, py, c)
					img.Set(px, py+1, c)
					img.Set(px+1, py+1, c)
				}
			}
		}
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func handleCaptcha(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "仅支持 GET"})
		return
	}

	code := generateCaptchaCode(4)
	captchaID := generateCaptchaCode(16)
	log.Printf("[DEV] Captcha %s = %s", captchaID, code)
	captchaStore.Store(captchaID, captchaEntry{Code: code, ExpiresAt: time.Now().Add(5 * time.Minute)})

	imgBytes, err := drawCaptchaImage(code)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "验证码生成失败"})
		return
	}

	dataURL := "data:image/png;base64," + base64.StdEncoding.EncodeToString(imgBytes)

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"data": map[string]interface{}{
			"captcha_id":    captchaID,
			"captcha_image": dataURL,
		},
	})
}

func validateCaptcha(captchaID, captchaCode string) bool {
	if captchaID == "" || captchaCode == "" {
		return false
	}
	val, ok := captchaStore.Load(captchaID)
	if !ok {
		return false
	}
	entry := val.(captchaEntry)
	if time.Now().After(entry.ExpiresAt) {
		captchaStore.Delete(captchaID)
		return false
	}
	if !strings.EqualFold(entry.Code, captchaCode) {
		return false
	}
	captchaStore.Delete(captchaID) // one-time use
	return true
}

func handleMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "仅支持 GET"})
		return
	}

	userID := r.Header.Get("X-User-ID")
	var user User
	err := db.QueryRow("SELECT id, email, created_at FROM users WHERE id = ?", userID).
		Scan(&user.ID, &user.Email, &user.CreatedAt)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "用户不存在"})
		return
	}

	writeJSON(w, http.StatusOK, user)
}

func generateToken(userID int64) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(72 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
