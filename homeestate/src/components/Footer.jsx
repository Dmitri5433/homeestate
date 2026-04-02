export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          Home<span>Estate</span>
        </div>
        <p className="footer-tagline">Лучшая недвижимость Молдовы</p>
        <div className="footer-links">
          <span>Кишинёв</span>
          <span>·</span>
          <span>Бельцы</span>
          <span>·</span>
          <span>Молдова</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} HomeEstate. Все права защищены.</p>
      </div>
    </footer>
  );
}
