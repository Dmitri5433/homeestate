import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5182/api/apartment";

const EMPTY_FORM = {
  id: 0,
  name: "",
  city: "Кишинёв",
  category: "Студия",
  rooms: 1,
  area: "",
  price: "",
  imageUrl: "",
};


function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5182/api/auth/users")
      .then(r => r.json())
      .then(d => { setUsers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-content">
      <div className="table-toolbar">
        <h2 style={{ margin: 0 }}>Пользователи</h2>
      </div>
      {loading && <div className="admin-loading">Загрузка...</div>}
      {!loading && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Email</th>
                <th>Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><span className="id-badge">#{u.id}</span></td>
                  <td><b>{u.userName}</b></td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString("ru-RU")}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="4" className="table-empty">Нет пользователей</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="table-footer">Всего: {users.length}</div>
    </div>
  );
}
export default function App() {
  const [page, setPage] = useState("apartments");
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Modal
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchApartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/getAll`);
      const data = await res.json();
      setApartments(data);
    } catch {
      setError("Не удалось загрузить данные.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApartments(); }, []);

  const filtered = apartments.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setModal("add"); setMsg(null); };
  const openEdit = (a) => { setForm({ ...a, imageUrl: a.imageUrl || "" }); setModal("edit"); setMsg(null); };
  const openDelete = (a) => { setForm(a); setModal("delete"); setMsg(null); };
  const closeModal = () => { setModal(null); setMsg(null); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.area) {
      setMsg({ type: "error", text: "Заполните все обязательные поля." });
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        rooms: parseInt(form.rooms),
        area: parseFloat(form.area),
        price: parseFloat(form.price),
      };
      const res = await fetch(API, {
        method: modal === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.isSuccess) {
        setMsg({ type: "success", text: data.message });
        fetchApartments();
        setTimeout(closeModal, 1000);
      } else {
        setMsg({ type: "error", text: data.message });
      }
    } catch {
      setMsg({ type: "error", text: "Ошибка сервера." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/id?id=${form.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.isSuccess) {
        setMsg({ type: "success", text: data.message });
        fetchApartments();
        setTimeout(closeModal, 800);
      } else {
        setMsg({ type: "error", text: data.message });
      }
    } catch {
      setMsg({ type: "error", text: "Ошибка сервера." });
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: apartments.length,
    studio: apartments.filter((a) => a.category === "Студия").length,
    one: apartments.filter((a) => a.category === "1-комнатная").length,
    two: apartments.filter((a) => a.category === "2-комнатная").length,
    three: apartments.filter((a) => a.category === "3-комнатная").length,
    avgPrice: apartments.length
      ? Math.round(apartments.reduce((s, a) => s + a.price, 0) / apartments.length)
      : 0,
  };

  return (
    <div className="admin-layout">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          Home<span>Estate</span>
          <small>Admin Panel</small>
        </div>
        <nav className="sidebar-nav">
          <div
            className={`sidebar-item ${page === "dashboard" ? "active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            <span className="sidebar-icon">📊</span>
            Dashboard
          </div>
          <div
            className={`sidebar-item ${page === "apartments" ? "active" : ""}`}
            onClick={() => setPage("apartments")}
          >
            <span className="sidebar-icon">🏠</span>
            Квартиры
          </div>
          <div
            className={`sidebar-item ${page === "users" ? "active" : ""}`}
            onClick={() => setPage("users")}
          >
            <span className="sidebar-icon">👥</span>
            Пользователи
          </div>
        </nav>
        <div className="sidebar-footer">
          <a href="http://localhost:5173" target="_blank" rel="noreferrer">
            ← На сайт
          </a>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────── */}
      <main className="admin-main">
        {/* TOPBAR */}
        <div className="admin-topbar">
          <h1>{page === "dashboard" ? "Dashboard" : page === "apartments" ? "Управление квартирами" : "Пользователи"}</h1>
          <div className="topbar-right">
            <span className="topbar-badge">Admin</span>
          </div>
        </div>

        {/* ── DASHBOARD ───────────────────────── */}
        {page === "dashboard" && (
          <div className="admin-content">
            <div className="stats-grid">
              <div className="stat-card stat-card--blue">
                <div className="stat-card-icon">🏠</div>
                <div>
                  <div className="stat-card-value">{stats.total}</div>
                  <div className="stat-card-label">Всего квартир</div>
                </div>
              </div>
              <div className="stat-card stat-card--gold">
                <div className="stat-card-icon">💰</div>
                <div>
                  <div className="stat-card-value">${stats.avgPrice.toLocaleString()}</div>
                  <div className="stat-card-label">Средняя цена</div>
                </div>
              </div>
              <div className="stat-card stat-card--green">
                <div className="stat-card-icon">🏡</div>
                <div>
                  <div className="stat-card-value">{stats.studio}</div>
                  <div className="stat-card-label">Студий</div>
                </div>
              </div>
              <div className="stat-card stat-card--purple">
                <div className="stat-card-icon">🏰</div>
                <div>
                  <div className="stat-card-value">{stats.three}</div>
                  <div className="stat-card-label">3-комнатных</div>
                </div>
              </div>
            </div>

            <div className="dashboard-bottom">
              <div className="dashboard-card">
                <h3>По категориям</h3>
                <div className="category-bars">
                  {[
                    { label: "Студия", count: stats.studio, color: "#c8a96e" },
                    { label: "1-комнатная", count: stats.one, color: "#3498db" },
                    { label: "2-комнатная", count: stats.two, color: "#2ecc71" },
                    { label: "3-комнатная", count: stats.three, color: "#9b59b6" },
                  ].map((item) => (
                    <div key={item.label} className="category-bar-row">
                      <span className="category-bar-label">{item.label}</span>
                      <div className="category-bar-track">
                        <div
                          className="category-bar-fill"
                          style={{
                            width: stats.total ? `${(item.count / stats.total) * 100}%` : "0%",
                            background: item.color,
                          }}
                        />
                      </div>
                      <span className="category-bar-count">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Последние добавленные</h3>
                <div className="recent-list">
                  {[...apartments].reverse().slice(0, 5).map((a) => (
                    <div key={a.id} className="recent-item">
                      <img src={a.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80"} alt="" />
                      <div>
                        <b>{a.name}</b>
                        <span>{a.city} · {a.category}</span>
                      </div>
                      <b className="recent-price">${a.price?.toLocaleString()}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── APARTMENTS ──────────────────────── */}
        {page === "apartments" && (
          <div className="admin-content">
            <div className="table-toolbar">
              <input
                className="table-search"
                placeholder="🔍 Поиск по названию, городу, категории..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn-add" onClick={openAdd}>+ Добавить квартиру</button>
            </div>

            {loading && <div className="admin-loading">Загрузка...</div>}
            {error && <div className="admin-error">{error}</div>}

            {!loading && (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Фото</th>
                      <th>Название</th>
                      <th>Город</th>
                      <th>Категория</th>
                      <th>Комнат</th>
                      <th>Площадь</th>
                      <th>Цена</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id}>
                        <td><span className="id-badge">#{a.id}</span></td>
                        <td>
                          <img
                            src={a.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80"}
                            alt=""
                            className="table-img"
                          />
                        </td>
                        <td><b>{a.name}</b></td>
                        <td>{a.city}</td>
                        <td><span className="category-tag">{a.category}</span></td>
                        <td>{a.rooms}</td>
                        <td>{a.area} м²</td>
                        <td><b className="price-cell">${a.price?.toLocaleString()}</b></td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-edit" onClick={() => openEdit(a)}>✏️</button>
                            <button className="btn-delete" onClick={() => openDelete(a)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="9" className="table-empty">Ничего не найдено</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="table-footer">Показано: {filtered.length} из {apartments.length}</div>
          </div>
        )}

        {/* ── USERS ───────────────────────────── */}
        {page === "users" && <UsersPage />}








      </main>

      {/* ── MODALS ──────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "add" ? "Добавить квартиру" : "Редактировать квартиру"}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>Название *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Название квартиры" />
                </div>
                <div className="form-field">
                  <label>Город *</label>
                  <select name="city" value={form.city} onChange={handleChange}>
                    <option>Кишинёв</option>
                    <option>Бельцы</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Категория *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option>Студия</option>
                    <option>1-комнатная</option>
                    <option>2-комнатная</option>
                    <option>3-комнатная</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Комнат</label>
                  <input name="rooms" type="number" value={form.rooms} onChange={handleChange} min="1" max="10" />
                </div>
                <div className="form-field">
                  <label>Площадь (м²) *</label>
                  <input name="area" type="number" value={form.area} onChange={handleChange} placeholder="70" />
                </div>
                <div className="form-field">
                  <label>Цена ($) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="85000" />
                </div>
                <div className="form-field form-field--full">
                  <label>URL изображения</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
              {msg && <div className={`form-msg form-msg--${msg.type}`}>{msg.text}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Отмена</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Сохранение..." : modal === "add" ? "Добавить" : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box modal-box--small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Удалить квартиру</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p className="delete-confirm">
                Вы уверены что хотите удалить <b>«{form.name}»</b>?
                Это действие нельзя отменить.
              </p>
              {msg && <div className={`form-msg form-msg--${msg.type}`}>{msg.text}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Отмена</button>
              <button className="btn-delete-confirm" onClick={handleDelete} disabled={saving}>
                {saving ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



