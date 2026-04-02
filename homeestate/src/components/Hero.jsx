export default function Hero({ onGoToCatalog }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">Недвижимость Молдовы</p>
        <h1>Найдите квартиру<br />своей мечты</h1>
        <p className="hero-sub">
          Лучшие предложения в Кишинёве и Бельцах. Студии, апартаменты и пентхаусы.
        </p>
        <button className="hero-btn" onClick={onGoToCatalog}>
          Смотреть каталог →
        </button>
      </div>
      <div className="hero-stats">
        <div className="stat"><b>8+</b><span>Объектов</span></div>
        <div className="stat"><b>2</b><span>Города</span></div>
        <div className="stat"><b>5★</b><span>Рейтинг</span></div>
      </div>
    </section>
  );
}
