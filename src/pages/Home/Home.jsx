import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { products, banners, categories } from '../../data/mockData';
import './Home.css';

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const featured = products.filter(p => p.status === 'active').slice(0, 8);
  const catIcons = { 1: '📱', 2: '💻', 3: '🎧', 4: '📟', 5: '🔊' };

  return (
    <div>
      {/* Banner */}
      <div className="home-banner-section">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className="home-banner"
            style={{
              background: banner.bg,
              opacity: idx === currentBanner ? 1 : 0,
              zIndex: idx === currentBanner ? 1 : 0,
            }}
          >
            <div className="home-banner-content">
              <div className="home-banner-text">
                <h1 className="home-banner-title">{banner.title}</h1>
                <p className="home-banner-subtitle">{banner.subtitle}</p>
                <Link to="/products" className="home-banner-btn">
                  Mua ngay →
                </Link>
              </div>
              <img src={banner.image} alt={banner.title} className="home-banner-img" />
            </div>
          </div>
        ))}
        {/* Dots */}
        <div className="home-dots">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`home-dot${idx === currentBanner ? ' active' : ''}`}
              onClick={() => setCurrentBanner(idx)}
            />
          ))}
        </div>
      </div>

      <div className="home-container">
        {/* Categories */}
        <section className="home-section">
          <h2 className="home-section-title">Danh mục sản phẩm</h2>
          <div className="home-cat-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="home-cat-card">
                <div className="home-cat-icon">{catIcons[cat.id] || '📦'}</div>
                <div className="home-cat-name">{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo Banners */}
        <section className="home-promo-banners">
          <div className="home-promo-banner" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div>
              <h3 className="home-promo-title">Miễn phí vận chuyển</h3>
              <p className="home-promo-sub">Đơn hàng từ 500.000₫</p>
            </div>
            <span className="home-promo-icon">🚚</span>
          </div>
          <div className="home-promo-banner" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div>
              <h3 className="home-promo-title">Bảo hành 12 tháng</h3>
              <p className="home-promo-sub">Sản phẩm chính hãng</p>
            </div>
            <span className="home-promo-icon">🛡️</span>
          </div>
          <div className="home-promo-banner" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <div>
              <h3 className="home-promo-title">Đổi trả 30 ngày</h3>
              <p className="home-promo-sub">Không cần lý do</p>
            </div>
            <span className="home-promo-icon">🔄</span>
          </div>
        </section>

        {/* Featured Products */}
        <section className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Sản phẩm nổi bật</h2>
            <Link to="/products" className="home-view-all">Xem tất cả →</Link>
          </div>
          <div className="home-product-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
