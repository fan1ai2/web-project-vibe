---
title: "登录 / 注册"
layout: "auth"
seo:
  description: "登录或注册AI Prompt账号，使用二维码安全验证。"
---

<div id="auth-container" class="auth-page">
  <div class="auth-card">
    <div class="auth-tabs">
      <div class="auth-tab active" data-tab="login">登录</div>
      <div class="auth-tab" data-tab="register">注册</div>
    </div>
    <div class="auth-body">
      <!-- QR Code Section -->
      <div id="qr-section" class="qr-section">
        <p class="qr-title">微信扫码{{ '{{ modeLabel }}' }}</p>
        <div class="qr-code-wrapper" id="qr-container"></div>
        <p class="qr-hint">请使用微信扫描二维码</p>
      </div>

      <div class="qr-divider">或使用邮箱</div>

      <!-- Login Form -->
      <form id="auth-form-login" class="auth-form">
        <div class="auth-field">
          <label>邮箱地址</label>
          <input type="email" name="email" placeholder="请输入邮箱" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label>密码</label>
          <input type="password" name="password" placeholder="请输入密码" required autocomplete="current-password" minlength="6">
        </div>
        <button type="submit" class="auth-submit">登录</button>
        <p class="auth-switch">还没有账号？<a data-switch="register">立即注册</a></p>
      </form>

      <!-- Register Form -->
      <form id="auth-form-register" class="auth-form hidden">
        <div class="auth-field">
          <label>邮箱地址</label>
          <input type="email" name="email" placeholder="请输入邮箱" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label>密码</label>
          <input type="password" name="password" placeholder="请设置密码（至少6位）" required autocomplete="new-password" minlength="6">
        </div>
        <div class="auth-field">
          <label>确认密码</label>
          <input type="password" name="confirm" placeholder="请再次输入密码" required minlength="6">
        </div>
        <button type="submit" class="auth-submit">注册</button>
        <p class="auth-switch">已有账号？<a data-switch="login">返回登录</a></p>
      </form>

      <div id="auth-error" class="auth-error"></div>
      <div id="auth-success" class="auth-success"></div>
    </div>
  </div>
</div>
