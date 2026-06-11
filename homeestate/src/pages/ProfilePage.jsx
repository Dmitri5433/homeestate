import React, { useState } from 'react';
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
    <div className="profile-page-modern">
      {/* Cover Banner */}
      <div className="profile-cover">
        <div className="profile-cover-overlay"></div>
      </div>

      <div className="profile-container">
        {/* Profile Header (Avatar & Info) */}
        <div className="profile-header-card">
          <div className="profile-avatar">
            {user.userName?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-user-info">
            <h2>{user.userName}</h2>
            <div className="profile-badges">
              <span className="badge-role">{user.role || 'Пользователь'}</span>
              <span className="badge-status">Активен ✓</span>
            </div>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="profile-stats-grid">
          <div className="stat-box">
            <div className="stat-icon">📋</div>
            <div className="stat-data">
              <h3>{requests.length}</h3>
              <p>Активных заявок</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">❤️</div>
            <div className="stat-data">
              <h3>{favorites.length}</h3>
              <p>В избранном</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-data">
              <h3>{new Date().toLocaleDateString('ru-RU')}</h3>
              <p>Сегодня</p>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <nav className="profile-tabs">
          <button 
            className={activeTab === 'requests' ? 'active' : ''} 
            onClick={() => setActiveTab('requests')}
          >
            Мои заявки {requests.length > 0 && <span className="tab-badge">{requests.length}</span>}
          </button>
          <button 
            className={activeTab === 'latest' ? 'active' : ''} 
            onClick={() => setActiveTab('latest')}
          >
            Новые объекты
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Настройки
          </button>
        </nav>

        {/* Tab Content */}
        <div className="profile-content-area">
          {activeTab === 'requests' && (
            <div className="profile-tab-pane slide-up">
              <div className="pane-header">
                <h3>Заявки на просмотр</h3>
                <p>Вы записаны на просмотр следующих объектов. С вами свяжется агент.</p>
              </div>
              
              {requests.length === 0 ? (
                 <div className="modern-empty-state">
                  <div className="empty-icon">🏠</div>
                  <h4>У вас пока нет заявок</h4>
                  <p>Перейдите в каталог, чтобы выбрать квартиру вашей мечты</p>
                </div>
              ) : (
                <div className="modern-requests-list">
                  {requests.map((item) => (
                    <div key={item.id} className="modern-request-card" onClick={() => onOpen(item.id)}>
                      <img src={item.image} alt={item.name} />
                      <div className="req-card-body">
                        <div className="req-card-top">
                          <span className="req-city">{item.city}</span>
                          <span className="req-date">Заявка от {item.date || new Date().toLocaleDateString('ru-RU')}</span>
                        </div>
                        <h4 className="req-title">{item.name}</h4>
                        <div className="req-features">
                          <span>🛏 {item.rooms} комн.</span>
                          <span>📐 {item.area} м²</span>
                        </div>
                        <div className="req-card-bottom">
                          <b className="req-price">${item.price?.toLocaleString()}</b>
                          <button className="modern-cancel-btn" onClick={(e) => { e.stopPropagation(); removeRequest(item.id); }}>Отменить</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'latest' && (
            <div className="profile-tab-pane slide-up">
              <div className="pane-header">
                <h3>Свежие предложения</h3>
                <p>Специально для вас, будьте первыми, кто увидит новые поступления.</p>
              </div>
              <div className="grid">
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
            <div className="profile-tab-pane slide-up">
              <div className="pane-header">
                <h3>Настройки профиля</h3>
                <p>Управляйте своими данными и предпочтениями.</p>
              </div>
              <div className="modern-settings-card">
                <div className="settings-group">
                  <div className="settings-label">
                    <h4>Уведомления на email</h4>
                    <p>Получать подборки новых квартир</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="settings-group">
                  <div className="settings-label">
                    <h4>СМС-оповещения</h4>
                    <p>Статус ваших заявок</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="settings-action">
                  <button className="modern-btn-outline">Изменить пароль</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}