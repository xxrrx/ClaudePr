import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  const isOutOfStock = product.stock === 0 || product.status === 'inactive';

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={product.image} alt={product.name} style={styles.image} />
        {isOutOfStock && <div style={styles.outOfStock}>Hết hàng</div>}
        {product.stock > 0 && product.stock <= 5 && !isOutOfStock && (
          <div style={styles.lowStock}>Còn {product.stock}</div>
        )}
      </div>
      <div style={styles.body}>
        <div style={styles.category}>
          {product.category_id === 1 ? 'Điện thoại'
            : product.category_id === 2 ? 'Laptop'
            : product.category_id === 3 ? 'Phụ kiện'
            : product.category_id === 4 ? 'Máy tính bảng'
            : 'Âm thanh'}
        </div>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.price}>{fmt(product.price)}</div>
        <div style={styles.actions}>
          <Link to={`/products/${product.id}`} style={styles.detailBtn}>
            Xem chi tiết
          </Link>
          <button
            style={{
              ...styles.addBtn,
              ...(isOutOfStock ? styles.disabledBtn : {}),
            }}
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

const styles = {
  card: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imageWrapper: {
    position: 'relative',
    paddingTop: '75%',
    background: '#f5f5f5',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  outOfStock: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: '#999',
    color: '#fff',
    fontSize: 11,
    padding: '3px 8px',
    borderRadius: 20,
    fontWeight: 600,
  },
  lowStock: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: '#ff6b35',
    color: '#fff',
    fontSize: 11,
    padding: '3px 8px',
    borderRadius: 20,
    fontWeight: 600,
  },
  body: {
    padding: '14px 16px',
  },
  category: {
    fontSize: 11,
    color: '#e94560',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: '0 0 8px',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  price: {
    fontSize: 16,
    fontWeight: 700,
    color: '#e94560',
    marginBottom: 12,
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  detailBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '7px 10px',
    border: '1px solid #1a1a2e',
    borderRadius: 6,
    color: '#1a1a2e',
    textDecoration: 'none',
    fontSize: 12,
    fontWeight: 500,
  },
  addBtn: {
    flex: 1,
    padding: '7px 10px',
    background: '#e94560',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  disabledBtn: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
};
