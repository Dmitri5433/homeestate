import { useState } from "react";

const API_URL = "http://localhost:5182/api/auth";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = mode === "login" ? `${API_URL}/login` : `${API_URL}/register`;
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { userName: form.userName, email: form.email, password: form.password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Ошибка. Попробуйте снова.");
        return;
      }

      if (mode === "register") {
        if (data.isSuccess) {
          setMode("login");
          setError(null);
          setForm({ userName: "", email: "", password: "" });
          alert("Регистрация успешна! Войдите в аккаунт.");
        } else {
          setError(data.message);
        }
      } else {
        onLogin(data);
      }
    } catch {
      setError("Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Home<span>Estate</span></div>
        <h2>{mode === "login" ? "Вход в аккаунт" : "Регистрация"}</h2>
        <p className="auth-sub">
          {mode === "login"
            ? "Введите email и пароль для входа"
            : "Создайте аккаунт чтобы сохранять избранное"}
        </p>

        <div className="auth-form">
          {mode === "register" && (
            <div className="auth-field">
              <label>Имя пользователя</label>
              <input
                name="userName"
                placeholder="Ваше имя"
                value={form.userName}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Пароль</label>
            <input
              name="password"
              type="password"
              placeholder="Минимум 8 символов"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>

        <div className="auth-switch">
          {mode === "login" ? (
            <>Нет аккаунта? <span onClick={() => setMode("register")}>Зарегистрироваться</span></>
          ) : (
            <>Уже есть аккаунт? <span onClick={() => setMode("login")}>Войти</span></>
          )}
        </div>

        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <a href="http://localhost:5173" style={{ color: "#c8a96e", fontSize: "14px", textDecoration: "none" }}>
            ← На главную
          </a>
        </div>
      </div>
    </div>
  );
}
