import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, banners, categories } from '../data/mockData';

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
      <div style={styles.bannerSection}>
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            style={{
              ...styles.banner,
              background: banner.bg,
              opacity: idx === currentBanner ? 1 : 0,
              zIndex: idx === currentBanner ? 1 : 0,
            }}
          >
            <div style={styles.bannerContent}>
              <div style={styles.bannerText}>
                <h1 style={styles.bannerTitle}>{banner.title}</h1>
                <p style={styles.bannerSubtitle}>{banner.subtitle}</p>
                <Link to="/products" style={styles.bannerBtn}>
                  Mua ngay →
                </Link>
              </div>
              <img src={banner.image} alt={banner.title} style={styles.bannerImg} />
            </div>
          </div>
        ))}
        {/* Dots */}
        <div style={styles.dots}>
          {banners.map((_, idx) => (
            <button
              key={idx}
              style={{ ...styles.dot, ...(idx === currentBanner ? styles.dotActive : {}) }}
              onClick={() => setCurrentBanner(idx)}
            />
          ))}
        </div>
      </div>

      <div style={styles.container}>
        {/* Categories */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Danh mục sản phẩm</h2>
          <div style={styles.catGrid}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} style={styles.catCard}>
                <div style={styles.catIcon}>{catIcons[cat.id] || '📦'}</div>
                <div style={styles.catName}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo Banners */}
        <section style={styles.promoBanners}>
          <div style={{ ...styles.promoBanner, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div style={styles.promoText}>
              <h3 style={styles.promoTitle}>Miễn phí vận chuyển</h3>
              <p style={styles.promoSub}>Đơn hàng từ 500.000₫</p>
            </div>
            <span style={styles.promoIcon}>🚚</span>
          </div>
          <div style={{ ...styles.promoBanner, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div style={styles.promoText}>
              <h3 style={styles.promoTitle}>Bảo hành 12 tháng</h3>
              <p style={styles.promoSub}>Sản phẩm chính hãng</p>
            </div>
            <span style={styles.promoIcon}>🛡️</span>
          </div>
          <div style={{ ...styles.promoBanner, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <div style={styles.promoText}>
              <h3 style={styles.promoTitle}>Đổi trả 30 ngày</h3>
              <p style={styles.promoSub}>Không cần lý do</p>
            </div>
            <span style={styles.promoIcon}>🔄</span>
          </div>
        </section>

        {/* Featured Products */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Sản phẩm nổi bật</h2>
            <Link to="/products" style={styles.viewAll}>Xem tất cả →</Link>
          </div>
          <div style={styles.productGrid}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  bannerSection: {
    position: 'relative',
    height: 400,
    overflow: 'hidden',
  },
  banner: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.8s ease',
    display: 'flex',
    alignItems: 'center',
  },
  bannerContent: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 20px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: { maxWidth: 500 },
  bannerTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 800,
    margin: '0 0 12px',
    lineHeight: 1.2,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    margin: '0 0 24px',
  },
  bannerBtn: {
    display: 'inline-block',
    background: '#e94560',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
  },
  bannerImg: {
    width: 320,
    height: 300,
    objectFit: 'cover',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.4)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  dotActive: { background: '#fff', width: 24, borderRadius: 4 },
  container: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 20px',
  },
  section: { padding: '48px 0 0' },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 24px',
  },
  viewAll: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 24,
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  catCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '24px 16px',
    textAlign: 'center',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s',
    border: '1px solid #f0f0f0',
  },
  catIcon: { fontSize: 40, marginBottom: 10 },
  catName: { color: '#1a1a2e', fontWeight: 600, fontSize: 14 },
  promoBanners: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 48,
  },
  promoBanner: {
    borderRadius: 12,
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#fff',
  },
  promoText: {},
  promoTitle: { margin: '0 0 4px', fontSize: 16, fontWeight: 700 },
  promoSub: { margin: 0, fontSize: 13, opacity: 0.9 },
  promoIcon: { fontSize: 40 },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
  },
};
