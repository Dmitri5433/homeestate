export default function Counter({ found, requestsCount }) {
  return (
    <div className="counter">
      <span>🏠 Найдено: <b>{found}</b> объектов</span>
      <span>📋 Заявок на просмотр: <b>{requestsCount}</b></span>
    </div>
  );
}
