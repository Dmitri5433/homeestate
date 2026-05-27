import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import AuthPage from "./components/AuthPage";
import SearchBar from "./components/SearchBar";
import FilterButtons from "./components/FilterButtons";
import Counter from "./components/Counter";
import ProductCard from "./components/ProductCard";
import ProductList from "./components/ProductList";
import ProfilePage from "./pages/ProfilePage";
import ApartmentDetails from "./pages/ApartmentDetails";
import Footer from "./components/Footer";

const API_URL = "http://localhost:5182/api/apartment";
const AUTH_URL = "http://localhost:5182/api/auth";
const CATEGORIES = ["Студия", "1-комнатная", "2-комнатная", "3-комнатная"];

export default function App() {
  const [view, setView] = useState("home");
  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auth state
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Проверяем сессию при загрузке
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/session`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {}
    };
    checkSession();
  }, []);

  const fetchApartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/getAll`);
      if (!res.ok) throw new Error("Ошибка сервера");
      const data = await res.json();
      const mapped = data.map((a) => ({
        id: a.id,
        name: a.name,
        city: a.city,
        category: a.category,
        rooms: a.rooms,
        area: a.area,
        price: a.price,
        image: a.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
      }));
      setProducts(mapped);
    } catch (err) {
      setError("Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApartments(); }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
    
    // Если почта админская, показываем окошко со ссылкой
    if (userData.email?.toLowerCase().includes("admin") || userData.userName?.toLowerCase().includes("admin")) {
      setShowAdminModal(true);
    }
  };

  const handleLogout = async () => {
    await fetch(`${AUTH_URL}/logout`, { method: "POST", credentials: "include" });
    setUser(null);
    setFavorites([]);
    setRequests([]);
    setView("home");
  };

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const addRequest = (item) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (!requests.some(req => req.id === item.id)) {
      setRequests((prev) => [...prev, { ...item, date: new Date().toLocaleDateString() }]);
    }
  };
  const removeRequest = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));

  const handleOpenApartment = (id) => {
    setSelectedApartmentId(id);
    setView("apartment");
  };

  const latestProducts = [...products].reverse().slice(0, 5);
  const recommended = [...products].sort((a, b) => b.price - a.price).slice(0, 5);

  const filtered = products.filter(
    (item) =>
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase())) &&
      (category === "Все" || item.category === category)
  );

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    items: products.filter((p) => p.category === cat),
  }));



  // Показываем страницу авторизации
  if (showAuth) {
    return <AuthPage onLogin={handleLogin} onBack={() => setShowAuth(false)} />;
  }

  if (view === "profile" && !user) {
    setShowAuth(true);
    setView("home");
    return null;
  }

  return (
    <div className="app">
      <Header
        view={view}
        setView={setView}
        favCount={favorites.length}
        requestsCount={requests.length}
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      {/* ══════════════════════════════════════════════
          ГЛАВНАЯ
      ══════════════════════════════════════════════ */}
      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-content">
              <p className="hero-label">Недвижимость Молдовы</p>
              <h1>Найдите квартиру<br />своей мечты</h1>
              <p className="hero-sub">
                Лучшие предложения в Кишинёве и Бельцах.
              </p>
              <div className="hero-actions">
                <button className="hero-btn" onClick={() => setView("catalog")}>
                  Смотреть каталог →
                </button>
                <button className="hero-btn-outline" onClick={() => setView("about")}>
                  О компании
                </button>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat"><b>40+</b><span>Объектов</span></div>
              <div className="stat"><b>2</b><span>Города</span></div>
              <div className="stat"><b>9 лет</b><span>Опыт</span></div>
              <div className="stat"><b>98%</b><span>Довольны</span></div>
            </div>
          </section>

          <section className="home-categories">
            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              const icons = { "Студия": "🏠", "1-комнатная": "🛏", "2-комнатная": "🏡", "3-комнатная": "🏰" };
              return (
                <div key={cat} className="cat-card" onClick={() => { setCategory(cat); setView("catalog"); }}>
                  <span className="cat-icon">{icons[cat]}</span>
                  <b>{cat}</b>
                  <span className="cat-count">{count} объектов</span>
                </div>
              );
            })}
          </section>

          <section className="home-section">
            <div className="section-header">
              <div>
                <h2>Новые предложения</h2>
                <p>Последние добавленные объекты</p>
              </div>
              <button className="see-all-btn" onClick={() => setView("catalog")}>Все объекты →</button>
            </div>
            {loading && <div className="state-msg loading"><span className="spinner" /> Загрузка...</div>}
            {error && <div className="state-msg error">⚠️ {error}</div>}
            {!loading && !error && (
              <div className="grid">
                {latestProducts.map((item) => (
                  <ProductCard key={item.id} item={item} isFav={favorites.includes(item.id)} onFav={() => toggleFav(item.id)} onAdd={() => addRequest(item)} onOpen={() => handleOpenApartment(item.id)} />
                ))}
              </div>
            )}
          </section>

          <section className="home-section home-section--dark">
            <div className="section-header">
              <div>
                <h2>Рекомендации</h2>
                <p>Премиальные объекты</p>
              </div>
              <button className="see-all-btn see-all-btn--light" onClick={() => setView("catalog")}>Все объекты →</button>
            </div>
            {!loading && !error && (
              <div className="grid">
                {recommended.map((item) => (
                  <ProductCard key={item.id} item={item} isFav={favorites.includes(item.id)} onFav={() => toggleFav(item.id)} onAdd={() => addRequest(item)} onOpen={() => handleOpenApartment(item.id)} />
                ))}
              </div>
            )}
          </section>

          <section className="cta-banner">
            <div className="cta-content">
              <h2>Не нашли подходящий вариант?</h2>
              <p>Наши специалисты помогут подобрать квартиру под ваши требования</p>
              <button className="hero-btn" onClick={() => setView("about")}>Связаться с нами</button>
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════
          ДЕТАЛИ КВАРТИРЫ
      ══════════════════════════════════════════════ */}
      {view === "apartment" && selectedApartmentId && (
        <ApartmentDetails 
          id={selectedApartmentId} 
          onBack={() => setView("catalog")}
          onAdd={addRequest}
          isFav={favorites.includes(selectedApartmentId)}
          onFav={() => toggleFav(selectedApartmentId)}
        />
      )}

      {/* ══════════════════════════════════════════════
          КАТАЛОГ
      ══════════════════════════════════════════════ */}
      {view === "catalog" && (
        <section className="catalog-section">
          <div className="catalog-hero">
            <h1>Каталог квартир</h1>
            <p>Все объекты недвижимости Молдовы — {products.length} предложений</p>
          </div>
          <div className="controls">
            <SearchBar value={search} onChange={setSearch} />
            <FilterButtons active={category} onChange={setCategory} />
          </div>
          <Counter found={filtered.length} requestsCount={requests.length} />
          {loading && <div className="state-msg loading"><span className="spinner" /> Загрузка...</div>}
          {error && <div className="state-msg error">⚠️ {error}</div>}
          {!loading && !error && (category !== "Все" || search !== "") && (
            <ProductList items={filtered} favorites={favorites} onFav={toggleFav} onAdd={addRequest} onOpen={handleOpenApartment} />
          )}
          {!loading && !error && category === "Все" && search === "" && (
            <div className="catalog-by-category">
              {byCategory.map(({ cat, items }) =>
                items.length > 0 ? (
                  <div key={cat} className="category-section">
                    <div className="category-section-header">
                      <h3>{cat}</h3>
                      <span>{items.length} объектов</span>
                    </div>
                    <div className="grid" style={{ padding: "16px 6% 24px" }}>
                      {items.map((item) => (
                        <ProductCard key={item.id} item={item} isFav={favorites.includes(item.id)} onFav={() => toggleFav(item.id)} onAdd={() => addRequest(item)} onOpen={() => handleOpenApartment(item.id)} />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════
          ИЗБРАННОЕ
      ══════════════════════════════════════════════ */}
      {view === "favorites" && (
        <div className="page">
          <div className="page-header">
            <h2>Избранные квартиры</h2>
            <span>{favorites.length} объектов</span>
          </div>
          <ProductList items={products.filter((a) => favorites.includes(a.id))} favorites={favorites} onFav={toggleFav} onAdd={addRequest} onOpen={handleOpenApartment} />
        </div>
      )}

      {/* ══════════════════════════════════════════════
          ПРОФИЛЬ
      ══════════════════════════════════════════════ */}
      {view === "profile" && user && (
        <ProfilePage 
          user={user}
          requests={requests}
          removeRequest={removeRequest}
          latestProducts={latestProducts}
          favorites={favorites}
          toggleFav={toggleFav}
          addRequest={addRequest}
          onOpen={handleOpenApartment}
        />
      )}

      {/* ══════════════════════════════════════════════
          О НАС
      ══════════════════════════════════════════════ */}
      {view === "about" && (
        <div className="page">
          <div className="page-header"><h2>О компании</h2></div>
          <div className="about-grid">
            <div className="about-text">
              <p>HomeEstate — ведущее агентство недвижимости Молдовы. Мы помогаем находить и приобретать квартиры в Кишинёве и Бельцах с 2015 года.</p>
              <p>Наша команда из 20 специалистов сопровождает каждую сделку от первого просмотра до подписания договора.</p>
            </div>
            <div className="about-cards">
              <div className="about-card"><b>500+</b><span>Сделок</span></div>
              <div className="about-card"><b>9 лет</b><span>Опыт</span></div>
              <div className="about-card"><b>2</b><span>Города</span></div>
              <div className="about-card"><b>98%</b><span>Довольны</span></div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Панель управления</h3>
            <p>Вы вошли как администратор. Перейдите в панель управления для редактирования объектов и пользователей.</p>
            <div className="modal-actions">
              <a href="http://localhost:5174/" target="_blank" rel="noopener noreferrer" className="admin-link-btn" onClick={() => setShowAdminModal(false)}>
                Открыть админку
              </a>
              <button className="modal-close-btn" onClick={() => setShowAdminModal(false)}>Продолжить на сайте</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
