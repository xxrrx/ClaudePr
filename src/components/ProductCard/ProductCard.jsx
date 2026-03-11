import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  const isOutOfStock = product.stock === 0 || product.status === 'inactive';

  return (
    <div className="pc-card">
      <div className="pc-image-wrapper">
        <img src={product.image} alt={product.name} className="pc-image" />
        {isOutOfStock && <div className="pc-out-of-stock">Hết hàng</div>}
        {product.stock > 0 && product.stock <= 5 && !isOutOfStock && (
          <div className="pc-low-stock">Còn {product.stock}</div>
        )}
      </div>
      <div className="pc-body">
        <div className="pc-category">
          {product.category_id === 1 ? 'Điện thoại'
            : product.category_id === 2 ? 'Laptop'
            : product.category_id === 3 ? 'Phụ kiện'
            : product.category_id === 4 ? 'Máy tính bảng'
            : 'Âm thanh'}
        </div>
        <h3 className="pc-name">{product.name}</h3>
        <div className="pc-price">{fmt(product.price)}</div>
        <div className="pc-actions">
          <Link to={`/products/${product.id}`} className="pc-detail-btn">
            Xem chi tiết
          </Link>
          <button
            className={`pc-add-btn${isOutOfStock ? ' disabled' : ''}`}
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Hết hàng' : '+ Thêm'}
          </button>
        </div>
      </div>
    </div>
  );
}
