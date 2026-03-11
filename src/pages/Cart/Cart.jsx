import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2 className="cart-empty-title">Giỏ hàng trống</h2>
        <p className="cart-empty-desc">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <Link to="/products" className="cart-shop-btn">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  const shipping = totalPrice >= 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shipping;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Giỏ hàng của bạn</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-section">
            <div className="cart-table-header">
              <span className="col-product">Sản phẩm</span>
              <span className="col-price">Đơn giá</span>
              <span className="col-qty">Số lượng</span>
              <span className="col-total">Thành tiền</span>
              <span className="col-action"></span>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className="cart-row">
                <div className="cart-row-product">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div>
                    <Link to={`/products/${item.id}`} className="cart-item-name">{item.name}</Link>
                    <div className="cart-item-sku">SKU: {item.sku}</div>
                  </div>
                </div>

                <div className="cart-row-price">
                  {fmt(item.price)}
                </div>

                <div className="cart-row-qty">
                  <div className="cart-qty-control">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >−</button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    >+</button>
                  </div>
                </div>

                <div className="cart-row-total">
                  {fmt(item.price * item.quantity)}
                </div>

                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >🗑️</button>
              </div>
            ))}

            <div className="cart-footer-row">
              <Link to="/products" className="cart-continue-btn">← Tiếp tục mua sắm</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="cart-summary-title">Tóm tắt đơn hàng</h2>

            <div className="cart-summary-row">
              <span>Tạm tính ({cartItems.length} sản phẩm)</span>
              <span>{fmt(totalPrice)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Phí vận chuyển</span>
              <span style={{ color: shipping === 0 ? '#27ae60' : '#333' }}>
                {shipping === 0 ? 'Miễn phí' : fmt(shipping)}
              </span>
            </div>
            {shipping === 0 && (
              <div className="cart-free-ship-note">🎉 Bạn được miễn phí vận chuyển!</div>
            )}
            {shipping > 0 && (
              <div className="cart-free-ship-note">
                Mua thêm {fmt(500000 - totalPrice)} để được miễn phí vận chuyển
              </div>
            )}

            <div className="cart-divider" />

            <div className="cart-total-row">
              <span>Tổng cộng</span>
              <span className="cart-total-amount">{fmt(finalTotal)}</span>
            </div>

            <Link to="/checkout" className="cart-checkout-btn">
              Tiến hành thanh toán →
            </Link>

            <div className="cart-pay-methods">
              <div className="cart-pay-title">Phương thức thanh toán</div>
              <div className="cart-pay-icons">
                💳 Thẻ ngân hàng &nbsp; 💵 Tiền mặt &nbsp; 📱 Ví điện tử
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
