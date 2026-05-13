export default function Header({ view, setView, favCount, requestsCount, user, onLoginClick, onLogout }) {
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
        
        {user ? (
          <>
            <button className="cart-btn" onClick={() => setView("profile")}>
              📋 Заявки {requestsCount > 0 && <span>{requestsCount}</span>}
            </button>
            <div className="user-menu">
              <span className="user-name clickable" onClick={() => setView("profile")}>👤 {user.userName}</span>
              <button className="logout-btn" onClick={onLogout}>Выйти</button>
            </div>
          </>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>Войти</button>
        )}
      </nav>
    </header>
  );
}
