import { useState } from "react";

export default function ProductCard({ item, isFav, onFav, onAdd, onOpen }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card" onClick={onOpen} style={{ cursor: "pointer" }}>
      <div className="card-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        <button className="fav-btn" onClick={(e) => { e.stopPropagation(); onFav(); }} title="В избранное">
          {isFav ? "❤️" : "🤍"}
        </button>
        <div className="price-badge">${item.price.toLocaleString()}</div>
      </div>

      <div className="card-info">
        <div className="card-city">{item.city}</div>
        <h3 className="card-title">{item.name}</h3>

        <div className="card-features">
          <span>🛏 {item.rooms} комн.</span>
          <span>📐 {item.area} м²</span>
        </div>

        <div className="card-actions">
          <button
            className={liked ? "like-btn liked" : "like-btn"}
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          >
            {liked ? "♥ Liked" : "♡ Like"}
          </button>
          <button
            className={added ? "add-btn added" : "add-btn"}
            onClick={(e) => { e.stopPropagation(); handleAdd(); }}
          >
            {added ? "✓ Заявка отправлена" : "Заявка на просмотр"}
          </button>
        </div>
      </div>
    </div>
  );
}
