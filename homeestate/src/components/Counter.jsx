export default function Counter({ found, cartCount }) {
  return (
    <div className="counter">
      <span>🏠 Найдено: <b>{found}</b> объектов</span>
      <span>🛒 В корзине: <b>{cartCount}</b></span>
    </div>
  );
}
