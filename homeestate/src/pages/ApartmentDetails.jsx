import { useState, useEffect } from "react";
import "./ApartmentDetails.css";

export default function ApartmentDetails({ id, onBack, onAdd, isFav, onFav }) {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchApartment = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5182/api/apartment/${id}`);
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        
        // Маппинг данных, чтобы обеспечить fallback для картинок
        const fallbackImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";
        const images = data.images && data.images.length > 0 ? data.images : [data.imageUrl || fallbackImage];
        
        setApartment({ ...data, images });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [id]);

  if (loading) return <div className="state-msg loading"><span className="spinner" /> Загрузка данных...</div>;
  if (error) return <div className="state-msg error">⚠️ {error}</div>;
  if (!apartment) return null;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + apartment.images.length) % apartment.images.length);

  return (
    <div className="apartment-details-page">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      
      <div className="details-container">
        <div className="gallery-section">
          <div className="main-image-container">
            <img src={apartment.images[currentImageIndex]} alt={apartment.name} className="main-image" />
            {apartment.images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}>❮</button>
                <button className="gallery-nav next" onClick={nextImage}>❯</button>
              </>
            )}
            <button className="fav-btn-large" onClick={onFav} title="В избранное">
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
          
          {apartment.images.length > 1 && (
            <div className="thumbnails">
              {apartment.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`thumbnail ${idx}`} 
                  className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="badge-row">
            <span className="city-badge">{apartment.city}</span>
            <span className="category-badge">{apartment.category}</span>
          </div>
          
          <h1>{apartment.name}</h1>
          <div className="price-large">${apartment.price.toLocaleString()}</div>
          
          <div className="features-grid">
            <div className="feature-item">
              <span className="icon">🛏</span>
              <div className="feature-text">
                <span className="label">Комнаты</span>
                <span className="value">{apartment.rooms}</span>
              </div>
            </div>
            <div className="feature-item">
              <span className="icon">📐</span>
              <div className="feature-text">
                <span className="label">Площадь</span>
                <span className="value">{apartment.area} м²</span>
              </div>
            </div>
          </div>
          
          <div className="description-box">
            <h3>Описание</h3>
            <p>Отличная квартира в районе с развитой инфраструктурой. Идеально подойдет для комфортного проживания.</p>
          </div>

          <div className="action-buttons">
            <button className="hero-btn full-width" onClick={() => onAdd(apartment)}>
              Оставить заявку на просмотр
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
