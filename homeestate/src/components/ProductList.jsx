import ProductCard from "./ProductCard";

export default function ProductList({ items, favorites, onFav, onAdd }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏚️</div>
        <p>Ничего не найдено</p>
        <span>Попробуйте изменить фильтр или поисковый запрос</span>
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          isFav={favorites.includes(item.id)}
          onFav={() => onFav(item.id)}
          onAdd={() => onAdd(item)}
        />
      ))}
    </div>
  );
}
