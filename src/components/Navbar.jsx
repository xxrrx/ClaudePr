import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { categories } from '../data/mockData';

export default function Navbar() {
  const { cartItems, totalItems, totalPrice, removeFromCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          TechShop
        </Link>

        {/* Categories */}
        <div style={styles.categories}>
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} style={styles.catLink}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>🔍</button>
        </form>

        {/* Actions */}
        <div style={styles.actions}>
          <Link to="/admin" style={styles.adminLink}>⚙️ Admin</Link>

          {/* Cart */}
          <div style={styles.cartWrapper}>
            <button
              style={styles.cartBtn}
              onClick={() => setShowCart(!showCart)}
            >
              🛒 Giỏ hàng
              {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
            </button>

            {/* Cart Dropdown */}
            {showCart && (
              <div style={styles.cartDropdown}>
                <div style={styles.cartHeader}>
                  <strong>Giỏ hàng ({totalItems} sản phẩm)</strong>
                  <button style={styles.closeBtn} onClick={() => setShowCart(false)}>✕</button>
                </div>

                {cartItems.length === 0 ? (
                  <div style={styles.emptyCart}>Giỏ hàng trống</div>
                ) : (
                  <>
                    <div style={styles.cartList}>
                      {cartItems.map(item => (
                        <div key={item.id} style={styles.cartItem}>
                          <img src={item.image} alt={item.name} style={styles.cartItemImg} />
                          <div style={styles.cartItemInfo}>
                            <div style={styles.cartItemName}>{item.name}</div>
                            <div style={styles.cartItemPrice}>
                              {fmt(item.price)} × {item.quantity}
                            </div>
                          </div>
                          <button
                            style={styles.removeBtn}
                            onClick={() => removeFromCart(item.id)}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={styles.cartFooter}>
                      <div style={styles.cartTotal}>
                        Tổng: <strong>{fmt(totalPrice)}</strong>
                      </div>
                      <div style={styles.cartActions}>
                        <Link
                          to="/cart"
                          style={styles.viewCartBtn}
                          onClick={() => setShowCart(false)}
                        >Xem giỏ hàng</Link>
                        <Link
                          to="/checkout"
                          style={styles.checkoutBtn}
                          onClick={() => setShowCart(false)}
                        >Thanh toán</Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    height: 64,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 20,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  logoIcon: { fontSize: 24 },
  categories: {
    display: 'flex',
    gap: 4,
    flex: 1,
    overflow: 'hidden',
  },
  catLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 13,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    padding: '8px 12px',
    width: 180,
    fontSize: 13,
  },
  searchBtn: {
    background: '#e94560',
    border: 'none',
    color: '#fff',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: 14,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  adminLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: 13,
    whiteSpace: 'nowrap',
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.2)',
  },
  cartWrapper: { position: 'relative' },
  cartBtn: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
    whiteSpace: 'nowrap',
  },
  badge: {
    background: '#ffd700',
    color: '#000',
    borderRadius: '50%',
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
  },
  cartDropdown: {
    position: 'absolute',
    right: 0,
    top: '110%',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
    width: 360,
    zIndex: 2000,
    overflow: 'hidden',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: '#f8f9fa',
    borderBottom: '1px solid #eee',
    fontSize: 14,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    color: '#666',
  },
  emptyCart: {
    padding: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  cartList: {
    maxHeight: 300,
    overflowY: 'auto',
    padding: '8px 0',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    borderBottom: '1px solid #f0f0f0',
  },
  cartItemImg: {
    width: 48,
    height: 48,
    objectFit: 'cover',
    borderRadius: 6,
  },
  cartItemInfo: { flex: 1, minWidth: 0 },
  cartItemName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cartItemPrice: { fontSize: 12, color: '#e94560', marginTop: 2 },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: 14,
    padding: 4,
  },
  cartFooter: {
    padding: '12px 16px',
    background: '#f8f9fa',
    borderTop: '1px solid #eee',
  },
  cartTotal: {
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
  },
  cartActions: {
    display: 'flex',
    gap: 8,
  },
  viewCartBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '8px',
    border: '1px solid #e94560',
    borderRadius: 6,
    color: '#e94560',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
  },
  checkoutBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '8px',
    background: '#e94560',
    borderRadius: 6,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
  },
};
