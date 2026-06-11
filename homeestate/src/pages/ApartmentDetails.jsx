import { useState, useEffect } from "react";
import "./ApartmentDetails.css";

const API = "http://localhost:5182";

export default function ApartmentDetails({ id, user, onBack, onAdd, isFav, onFav }) {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Отзывы
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

  const fetchApartment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/apartment/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      const fallbackImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";
      let images = data.images && data.images.length > 0 ? data.images : [data.imageUrl || fallbackImage];
      
      // Добавляем тестовые фотографии, если с бэкенда приходит только одна
      if (images.length === 1) {
        images = [
          images[0],
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
        ];
      }
      
      setApartment({ ...data, images });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApartment(); }, [id]);

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {
      setReviewMsg({ type: "error", text: "Напишите текст отзыва." });
      return;
    }
    setReviewSubmitting(true);
    setReviewMsg(null);
    try {
      const res = await fetch(`${API}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: reviewText, rating: reviewRating, apartmentId: id }),
      });
      const data = await res.json();
      if (data.isSuccess) {
        setReviewMsg({ type: "success", text: "Отзыв добавлен!" });
        setReviewText("");
        setReviewRating(5);
        fetchApartment(); // обновляем данные
      } else {
        setReviewMsg({ type: "error", text: data.message });
      }
    } catch {
      setReviewMsg({ type: "error", text: "Ошибка сервера." });
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <div className="state-msg loading"><span className="spinner" /> Загрузка данных...</div>;
  if (error) return <div className="state-msg error">⚠️ {error}</div>;
  if (!apartment) return null;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + apartment.images.length) % apartment.images.length);

  const avgRating = apartment.reviews?.length > 0
    ? (apartment.reviews.reduce((s, r) => s + r.rating, 0) / apartment.reviews.length).toFixed(1)
    : null;

  return (
    <div className="apartment-details-page">
      <button className="back-btn" onClick={onBack}>← Назад</button>

      <div className="details-container">
        {/* Галерея */}
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
                <img key={idx} src={img} alt={`thumbnail ${idx}`}
                  className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)} />
              ))}
            </div>
          )}
        </div>

        {/* Основная информация */}
        <div className="info-section">
          <div className="badge-row">
            <span className="city-badge">{apartment.city}</span>
            <span className="category-badge">{apartment.category}</span>
            {avgRating && <span className="rating-badge">⭐ {avgRating}</span>}
          </div>

          <h1>{apartment.name}</h1>
          <div className="price-large">${apartment.price?.toLocaleString()}</div>

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
            {apartment.floor > 0 && (
              <div className="feature-item">
                <span className="icon">🏢</span>
                <div className="feature-text">
                  <span className="label">Этаж</span>
                  <span className="value">{apartment.floor} из {apartment.totalFloors}</span>
                </div>
              </div>
            )}
            {apartment.entrance > 0 && (
              <div className="feature-item">
                <span className="icon">🚪</span>
                <div className="feature-text">
                  <span className="label">Подъезд</span>
                  <span className="value">{apartment.entrance}</span>
                </div>
              </div>
            )}
            {apartment.hasParking && (
              <div className="feature-item">
                <span className="icon">🚗</span>
                <div className="feature-text">
                  <span className="label">Парковка</span>
                  <span className="value">Есть</span>
                </div>
              </div>
            )}
            {apartment.hasElevator && (
              <div className="feature-item">
                <span className="icon">🛗</span>
                <div className="feature-text">
                  <span className="label">Лифт</span>
                  <span className="value">Есть</span>
                </div>
              </div>
            )}
          </div>

          {/* Расширенное описание */}
          {(apartment.district || apartment.description) && (
            <div className="description-box">
              {apartment.district && (
                <div className="district-row">
                  <span className="district-icon">📍</span>
                  <span>Район: <b>{apartment.district}</b></span>
                </div>
              )}
              {apartment.description && (
                <>
                  <h3>Описание</h3>
                  <p>{apartment.description}</p>
                </>
              )}
            </div>
          )}

          <div className="action-buttons">
            <button className="hero-btn full-width" onClick={() => onAdd(apartment)}>
              Оставить заявку на просмотр
            </button>
          </div>
        </div>
      </div>

      {/* Секция отзывов */}
      <div className="reviews-section">
        <h2 className="reviews-title">
          Отзывы {apartment.reviews?.length > 0 && <span className="reviews-count">({apartment.reviews.length})</span>}
        </h2>

        {/* Форма добавления */}
        {user ? (
          <div className="review-form">
            <div className="review-form-header">
              <span className="review-form-user">✍️ {user.userName}</span>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`star ${s <= reviewRating ? 'active' : ''}`}
                    onClick={() => setReviewRating(s)}>★</span>
                ))}
              </div>
            </div>
            <textarea
              className="review-textarea"
              placeholder="Напишите ваш отзыв об этой квартире..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={3}
            />
            {reviewMsg && (
              <div className={`review-msg review-msg--${reviewMsg.type}`}>{reviewMsg.text}</div>
            )}
            <button className="review-submit-btn" onClick={handleReviewSubmit} disabled={reviewSubmitting}>
              {reviewSubmitting ? "Сохранение..." : "Сохранить отзыв"}
            </button>
          </div>
        ) : (
          <div className="review-login-hint">
            💬 <span>Войдите в аккаунт, чтобы оставить отзыв</span>
          </div>
        )}

        {/* Список отзывов */}
        {apartment.reviews?.length > 0 ? (
          <div className="reviews-list">
            {apartment.reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-card-header">
                  <div className="review-author">
                    <div className="review-avatar">{r.userName?.[0]?.toUpperCase()}</div>
                    <div>
                      <b>{r.userName}</b>
                      <span className="review-date">
                        {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>
                  <div className="review-stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="reviews-empty">Отзывов пока нет. Будьте первым!</div>
        )}
      </div>
    </div>
  );
}
