import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products, categories } from '../../data/mockData';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="detail-not-found">
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="detail-back-link">← Quay lại danh sách</Link>
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
    <div className="detail-page">
      <div className="detail-container">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/" className="detail-bread-link">Trang chủ</Link>
          <span className="detail-sep">/</span>
          <Link to="/products" className="detail-bread-link">Sản phẩm</Link>
          <span className="detail-sep">/</span>
          <Link to={`/products?category=${product.category_id}`} className="detail-bread-link">{category?.name}</Link>
          <span className="detail-sep">/</span>
          <span className="detail-bread-current">{product.name}</span>
        </div>

        {/* Main */}
        <div className="detail-main">
          {/* Image */}
          <div className="detail-image-section">
            <img src={product.image} alt={product.name} className="detail-main-image" />
            {isOutOfStock && <div className="detail-out-of-stock-badge">Hết hàng</div>}
          </div>

          {/* Info */}
          <div>
            <div className="detail-category-tag">{category?.name}</div>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-sku-row">
              <span className="detail-sku">SKU: {product.sku}</span>
              <span
                className="detail-status"
                style={{ color: isOutOfStock ? '#999' : '#27ae60' }}
              >
                {isOutOfStock ? '● Hết hàng' : '● Còn hàng'}
              </span>
            </div>

            <div className="detail-price">{fmt(product.price)}</div>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Tồn kho</span>
                <span className="detail-info-value">{product.stock} sản phẩm</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Danh mục</span>
                <span className="detail-info-value">{category?.name}</span>
              </div>
            </div>

            <div className="detail-desc-section">
              <h3 className="detail-desc-title">Mô tả sản phẩm</h3>
              <p className="detail-desc">{product.description}</p>
            </div>

            {!isOutOfStock && (
              <div className="detail-qty-section">
                <span className="detail-qty-label">Số lượng:</span>
                <div className="detail-qty-control">
                  <button
                    className="detail-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >−</button>
                  <span className="detail-qty-value">{quantity}</span>
                  <button
                    className="detail-qty-btn"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  >+</button>
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button
                className={`detail-add-to-cart-btn${isOutOfStock ? ' disabled' : added ? ' added' : ''}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {added ? '✓ Đã thêm vào giỏ!' : isOutOfStock ? 'Hết hàng' : '🛒 Thêm vào giỏ hàng'}
              </button>
              <Link to="/checkout" className="detail-buy-now-btn" onClick={() => addToCart(product, quantity)}>
                Mua ngay
              </Link>
            </div>

            {/* Features */}
            <div className="detail-features">
              <div className="detail-feature">🚚 <span>Miễn phí vận chuyển đơn từ 500K</span></div>
              <div className="detail-feature">🛡️ <span>Bảo hành 12 tháng chính hãng</span></div>
              <div className="detail-feature">🔄 <span>Đổi trả trong 30 ngày</span></div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="detail-related">
            <h2 className="detail-related-title">Sản phẩm liên quan</h2>
            <div className="detail-related-grid">
              {related.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="detail-related-card">
                  <img src={p.image} alt={p.name} className="detail-related-img" />
                  <div className="detail-related-name">{p.name}</div>
                  <div className="detail-related-price">{fmt(p.price)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
