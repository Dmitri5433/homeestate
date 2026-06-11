import { useState } from "react";

export default function ProductCard({ item, isFav, onFav, onAdd, onOpen }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const handleAdd = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  let imageList = item.images && item.images.length > 0 ? item.images : [item.image];
  if (imageList.length === 1) {
    imageList = [
      imageList[0],
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ];
  }

  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <div className="card" onClick={onOpen} style={{ cursor: "pointer" }}>
      <div className="card-image">
        <img src={imageList[imgIndex]} alt={item.name} loading="lazy" />
        
        {imageList.length > 1 && (
          <>
            <button className="card-image-nav prev" onClick={prevImg}>❮</button>
            <button className="card-image-nav next" onClick={nextImg}>❯</button>
            <div className="card-image-dots">
              {imageList.map((_, i) => (
                <div key={i} className={`card-image-dot ${i === imgIndex ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}

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
