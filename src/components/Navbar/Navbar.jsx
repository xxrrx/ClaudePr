import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/mockData';
import './Navbar.css';

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
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">⚡</span>
          TechShop
        </Link>

        {/* Categories */}
        <div className="navbar-categories">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="navbar-cat-link">
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="navbar-search-form">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn">🔍</button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/admin" className="navbar-admin-link">⚙️ Admin</Link>

          {/* Cart */}
          <div className="navbar-cart-wrapper">
            <button
              className="navbar-cart-btn"
              onClick={() => setShowCart(!showCart)}
            >
              🛒 Giỏ hàng
              {totalItems > 0 && <span className="navbar-badge">{totalItems}</span>}
            </button>

            {/* Cart Dropdown */}
            {showCart && (
              <div className="navbar-cart-dropdown">
                <div className="navbar-cart-header">
                  <strong>Giỏ hàng ({totalItems} sản phẩm)</strong>
                  <button className="navbar-close-btn" onClick={() => setShowCart(false)}>✕</button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="navbar-empty-cart">Giỏ hàng trống</div>
                ) : (
                  <>
                    <div className="navbar-cart-list">
                      {cartItems.map(item => (
                        <div key={item.id} className="navbar-cart-item">
                          <img src={item.image} alt={item.name} className="navbar-cart-item-img" />
                          <div className="navbar-cart-item-info">
                            <div className="navbar-cart-item-name">{item.name}</div>
                            <div className="navbar-cart-item-price">
                              {fmt(item.price)} × {item.quantity}
                            </div>
                          </div>
                          <button
                            className="navbar-remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="navbar-cart-footer">
                      <div className="navbar-cart-total">
                        Tổng: <strong>{fmt(totalPrice)}</strong>
                      </div>
                      <div className="navbar-cart-actions">
                        <Link
                          to="/cart"
                          className="navbar-view-cart-btn"
                          onClick={() => setShowCart(false)}
                        >Xem giỏ hàng</Link>
                        <Link
                          to="/checkout"
                          className="navbar-checkout-btn"
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
