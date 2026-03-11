import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products, categories } from '../data/mockData';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div style={styles.notFound}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/products" style={styles.backLink}>← Quay lại danh sách</Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category_id);
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';
  const isOutOfStock = product.stock === 0 || product.status === 'inactive';

  const related = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link to="/" style={styles.breadLink}>Trang chủ</Link>
          <span style={styles.sep}>/</span>
          <Link to="/products" style={styles.breadLink}>Sản phẩm</Link>
          <span style={styles.sep}>/</span>
          <Link to={`/products?category=${product.category_id}`} style={styles.breadLink}>{category?.name}</Link>
          <span style={styles.sep}>/</span>
          <span style={styles.breadCurrent}>{product.name}</span>
        </div>

        {/* Main */}
        <div style={styles.main}>
          {/* Image */}
          <div style={styles.imageSection}>
            <img src={product.image} alt={product.name} style={styles.mainImage} />
            {isOutOfStock && <div style={styles.outOfStockBadge}>Hết hàng</div>}
          </div>

          {/* Info */}
          <div style={styles.infoSection}>
            <div style={styles.categoryTag}>{category?.name}</div>
            <h1 style={styles.name}>{product.name}</h1>
            <div style={styles.skuRow}>
              <span style={styles.sku}>SKU: {product.sku}</span>
              <span style={{ ...styles.status, color: isOutOfStock ? '#999' : '#27ae60' }}>
                {isOutOfStock ? '● Hết hàng' : '● Còn hàng'}
              </span>
            </div>

            <div style={styles.price}>{fmt(product.price)}</div>

            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Tồn kho</span>
                <span style={styles.infoValue}>{product.stock} sản phẩm</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Danh mục</span>
                <span style={styles.infoValue}>{category?.name}</span>
              </div>
            </div>

            <div style={styles.descSection}>
              <h3 style={styles.descTitle}>Mô tả sản phẩm</h3>
              <p style={styles.desc}>{product.description}</p>
            </div>

            {!isOutOfStock && (
              <div style={styles.quantitySection}>
                <span style={styles.qtyLabel}>Số lượng:</span>
                <div style={styles.qtyControl}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >−</button>
                  <span style={styles.qtyValue}>{quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  >+</button>
                </div>
              </div>
            )}

            <div style={styles.actions}>
              <button
                style={{
                  ...styles.addToCartBtn,
                  ...(isOutOfStock ? styles.disabledBtn : {}),
                  ...(added ? styles.addedBtn : {}),
                }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {added ? '✓ Đã thêm vào giỏ!' : isOutOfStock ? 'Hết hàng' : '🛒 Thêm vào giỏ hàng'}
              </button>
              <Link to="/checkout" style={styles.buyNowBtn} onClick={() => addToCart(product, quantity)}>
                Mua ngay
              </Link>
            </div>

            {/* Features */}
            <div style={styles.features}>
              <div style={styles.feature}>🚚 <span>Miễn phí vận chuyển đơn từ 500K</span></div>
              <div style={styles.feature}>🛡️ <span>Bảo hành 12 tháng chính hãng</span></div>
              <div style={styles.feature}>🔄 <span>Đổi trả trong 30 ngày</span></div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={styles.related}>
            <h2 style={styles.relatedTitle}>Sản phẩm liên quan</h2>
            <div style={styles.relatedGrid}>
              {related.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} style={styles.relatedCard}>
                  <img src={p.image} alt={p.name} style={styles.relatedImg} />
                  <div style={styles.relatedName}>{p.name}</div>
                  <div style={styles.relatedPrice}>{fmt(p.price)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f8f9fa', minHeight: '100vh', paddingBottom: 60 },
  container: { maxWidth: 1280, margin: '0 auto', padding: '24px 20px' },
  notFound: { textAlign: 'center', padding: 80 },
  backLink: { color: '#e94560', textDecoration: 'none', fontWeight: 600 },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
  },
  breadLink: { color: '#888', textDecoration: 'none' },
  sep: { color: '#ccc' },
  breadCurrent: { color: '#1a1a2e', fontWeight: 500 },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 40,
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    marginBottom: 40,
  },
  imageSection: { position: 'relative' },
  mainImage: {
    width: '100%',
    height: 440,
    objectFit: 'cover',
    borderRadius: 12,
    background: '#f5f5f5',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    background: '#999',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: 20,
    fontWeight: 600,
    fontSize: 13,
  },
  infoSection: {},
  categoryTag: {
    display: 'inline-block',
    background: '#fff0f3',
    color: '#e94560',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 12,
  },
  name: { fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: '0 0 12px', lineHeight: 1.3 },
  skuRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sku: { fontSize: 12, color: '#999' },
  status: { fontSize: 13, fontWeight: 600 },
  price: { fontSize: 32, fontWeight: 800, color: '#e94560', margin: '0 0 20px' },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: '16px 0',
    borderTop: '1px solid #f0f0f0',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: 20,
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  infoLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
  descSection: { marginBottom: 20 },
  descTitle: { fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' },
  desc: { fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  qtyLabel: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    background: '#f5f5f5',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
  },
  qtyValue: {
    width: 48,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 600,
  },
  actions: { display: 'flex', gap: 12, marginBottom: 24 },
  addToCartBtn: {
    flex: 2,
    padding: '14px',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addedBtn: { background: '#27ae60' },
  disabledBtn: { background: '#ccc', cursor: 'not-allowed' },
  buyNowBtn: {
    flex: 1,
    padding: '14px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '16px',
    background: '#f8f9fa',
    borderRadius: 10,
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#555',
  },
  related: { marginTop: 16 },
  relatedTitle: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  relatedCard: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: 12,
  },
  relatedImg: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a2e',
    marginBottom: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  relatedPrice: { fontSize: 14, fontWeight: 700, color: '#e94560' },
};
