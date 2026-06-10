package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
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
	mux.HandleFunc("/api/register", cors(handleRegister))
	mux.HandleFunc("/api/login", cors(handleLogin))
	mux.HandleFunc("/api/me", cors(auth(handleMe)))

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

	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "请求格式错误"})
		return
	}

	creds.Email = strings.TrimSpace(strings.ToLower(creds.Email))
	if creds.Email == "" || len(creds.Password) < 6 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "邮箱格式不正确或密码少于6位"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "服务器错误"})
		return
	}

	result, err := db.Exec("INSERT INTO users (email, password_hash) VALUES (?, ?)", creds.Email, string(hash))
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE") {
			writeJSON(w, http.StatusConflict, map[string]string{"error": "该邮箱已注册"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "注册失败"})
		return
	}

	userID, _ := result.LastInsertId()
	user := User{ID: userID, Email: creds.Email, CreatedAt: time.Now().UTC().Format(time.RFC3339)}

	token, err := generateToken(userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "令牌生成失败"})
		return
	}

	writeJSON(w, http.StatusCreated, AuthResponse{Token: token, User: user})
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
