export default function Header({ view, setView, favCount, cartCount, user, onLoginClick, onLogout }) {
  return (
    <header className="header">
      <div className="logo" onClick={() => setView("home")}>
        Home<span>Estate</span>
      </div>
      <nav className="nav">
        <span className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Главная</span>
        <span className={view === "catalog" ? "active" : ""} onClick={() => setView("catalog")}>Каталог</span>
        <span className={view === "favorites" ? "active" : ""} onClick={() => setView("favorites")}>
          Избранное {favCount > 0 && <em>({favCount})</em>}
        </span>
        <span className={view === "about" ? "active" : ""} onClick={() => setView("about")}>О нас</span>
        <button className="cart-btn" onClick={() => setView("cart")}>
          🛒 <span>{cartCount}</span>
        </button>

        {user ? (
          <div className="user-menu">
            <span className="user-name">👤 {user.userName}</span>
            <button className="logout-btn" onClick={onLogout}>Выйти</button>
          </div>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>Войти</button>
        )}
      </nav>
    </header>
  );
}
