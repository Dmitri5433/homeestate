import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductCard from '../components/ProductCard';

export default function ProfilePage({ 
  user, 
  requests, 
  removeRequest, 
  latestProducts, 
  favorites, 
  toggleFav, 
  addRequest,
  onOpen
}) {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h2>Личный кабинет</h2>
        <span>👤 {user.userName}</span>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <nav className="profile-nav">
            <button 
              onClick={() => setActiveTab('requests')}
              className={activeTab === 'requests' ? 'active' : ''}
            >
              📋 Мои заявки {requests.length > 0 && <span className="badge">{requests.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('latest')}
              className={activeTab === 'latest' ? 'active' : ''}
            >
              ✨ Новые объекты
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={activeTab === 'settings' ? 'active' : ''}
            >
              ⚙️ Настройки
            </button>
          </nav>
        </aside>

        <main className="profile-content">
          {activeTab === 'requests' && (
            <div className="profile-section">
              <h3>Мои заявки на просмотр</h3>
              {requests.length === 0 ? (
                 <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>У вас пока нет активных заявок</p>
                  <span>Выберите квартиру в каталоге и оставьте заявку</span>
                </div>
              ) : (
                <div className="requests-list">
                  {requests.map((item) => (
                    <div key={item.id} className="request-card" onClick={() => onOpen(item.id)} style={{ cursor: 'pointer' }}>
                      <img src={item.image} alt={item.name} />
                      <div className="request-info">
                        <span className="request-city">{item.city}</span>
                        <h4 className="request-name">{item.name}</h4>
                        <div className="request-meta">
                          <span>🛏 {item.rooms} комн.</span>
                          <span>📐 {item.area} м²</span>
                        </div>
                        <div className="request-date">Заявка оформлена: <b>{item.date}</b></div>
                      </div>
                      <div className="request-actions">
                        <b className="request-price">${item.price.toLocaleString()}</b>
                        <button className="request-cancel-btn" onClick={(e) => { e.stopPropagation(); removeRequest(item.id); }}>Отменить заявку</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'latest' && (
            <div className="profile-section">
              <h3>Последние добавленные объекты</h3>
              <p className="section-desc" style={{ color: "var(--muted)", marginBottom: "8px" }}>
                Специально для вас, будьте первыми, кто увидит новые предложения.
              </p>
              <div className="grid" style={{ paddingTop: "16px" }}>
                {latestProducts.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    isFav={favorites.includes(item.id)} 
                    onFav={() => toggleFav(item.id)} 
                    onAdd={() => addRequest(item)} 
                    onOpen={() => onOpen(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-section">
              <h3>Настройки профиля</h3>
              <div className="settings-card">
                <div className="settings-row">
                  <span className="settings-label">Имя пользователя</span>
                  <span className="settings-val">{user.userName}</span>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Статус аккаунта</span>
                  <span className="settings-val" style={{ color: "var(--green)", fontWeight: 600 }}>Активен ✓</span>
                </div>
                <div className="settings-row">
                  <span className="settings-label">Уведомления о новых объектах</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}