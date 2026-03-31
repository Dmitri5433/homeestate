import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import FilterButtons from "./components/FilterButtons";
import Counter from "./components/Counter";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";

const API_URL = "http://localhost:5182/api/apartment";

export default function App() {
  const [view, setView] = useState("catalog");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");

  // API state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка квартир с бэкенда
  const fetchApartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/getAll`);
      if (!res.ok) throw new Error("Ошибка сервера");
      const data = await res.json();

      // Маппим поля бэкенда на поля фронтенда
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
      setError("Не удалось подключиться к серверу. Убедитесь что бэкенд запущен на порту 5182.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const filtered = products.filter(
    (item) =>
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase())) &&
      (category === "Все" || item.category === category)
  );

  const total = cart.reduce((s, i) => s + i.price, 0);

  return (
    <div className="app">
      <Header
        view={view}
        setView={setView}
        favCount={favorites.length}
        cartCount={cart.length}
      />

      {/* ── КАТАЛОГ ─────────────────────────────────── */}
      {view === "catalog" && (
        <>
          <Hero onGoToCatalog={() => {
            document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
          }} />

          <section id="catalog-section" className="catalog-section">
            <div className="controls">
              <SearchBar value={search} onChange={setSearch} />
              <FilterButtons active={category} onChange={setCategory} />
            </div>

            <Counter found={filtered.length} cartCount={cart.length} />

            {loading && (
              <div className="state-msg loading">
                <span className="spinner" /> Загрузка данных с сервера...
              </div>
            )}

            {error && !loading && (
              <div className="state-msg error">
                ⚠️ {error}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🏚️</div>
                <p>Нет квартир в базе данных</p>
                <span>Добавьте квартиры через Swagger на порту 5182</span>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <ProductList
                items={filtered}
                favorites={favorites}
                onFav={toggleFav}
                onAdd={addToCart}
              />
            )}
          </section>
        </>
      )}

      {/* ── ИЗБРАННОЕ ───────────────────────────────── */}
      {view === "favorites" && (
        <div className="page">
          <div className="page-header">
            <h2>Избранные квартиры</h2>
            <span>{favorites.length} объектов</span>
          </div>
          <ProductList
            items={products.filter((a) => favorites.includes(a.id))}
            favorites={favorites}
            onFav={toggleFav}
            onAdd={addToCart}
          />
        </div>
      )}

      {/* ── КОРЗИНА ─────────────────────────────────── */}
      {view === "cart" && (
        <div className="page">
          <div className="page-header">
            <h2>Корзина</h2>
            <span>{cart.length} объектов</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <p>Корзина пуста</p>
              <span>Добавьте квартиры из каталога</span>
              <button className="go-catalog-btn" onClick={() => setView("catalog")}>
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="cart-wrap">
              <div className="cart-list">
                {cart.map((item, i) => (
                  <div key={i} className="cart-row">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-row-info">
                      <span className="cart-row-name">{item.name}</span>
                      <span className="cart-row-city">{item.city}</span>
                    </div>
                    <b className="cart-row-price">${item.price.toLocaleString()}</b>
                    <button className="cart-remove" onClick={() => removeFromCart(i)}>✕</button>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="cart-total-row">
                  <span>Итого</span>
                  <b>${total.toLocaleString()}</b>
                </div>
                <button className="checkout-btn">Оформить заявку</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── О НАС ───────────────────────────────────── */}
      {view === "about" && (
        <div className="page">
          <div className="page-header">
            <h2>О компании</h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                HomeEstate — ведущее агентство недвижимости Молдовы. Мы помогаем
                находить и приобретать квартиры в Кишинёве и Бельцах с 2015 года.
              </p>
              <p>
                Наша команда из 20 специалистов сопровождает каждую сделку от первого
                просмотра до подписания договора.
              </p>
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
    </div>
  );
}
