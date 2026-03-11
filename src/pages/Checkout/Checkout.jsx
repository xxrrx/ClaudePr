import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: info, 2: confirm, 3: success
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'cash',
  });
  const [errors, setErrors] = useState({});

  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';
  const shipping = totalPrice >= 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shipping;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.phone.trim() || !/^0\d{9}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu 0)';
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setStep(2);
  };

  const handleConfirm = () => {
    clearCart();
    setStep(3);
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="checkout-empty">
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2>Giỏ hàng trống</h2>
        <Link to="/products" className="checkout-shop-btn">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  // Success
  if (step === 3) {
    return (
      <div className="checkout-success-page">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">✅</div>
          <h2 className="checkout-success-title">Đặt hàng thành công!</h2>
          <p className="checkout-success-desc">
            Cảm ơn <strong>{form.name}</strong>! Đơn hàng của bạn đã được tiếp nhận.<br />
            Chúng tôi sẽ liên hệ qua số <strong>{form.phone}</strong> để xác nhận.
          </p>
          <div className="checkout-success-info">
            <div className="checkout-success-info-row">
              <span>📍 Địa chỉ:</span>
              <span>{form.address}</span>
            </div>
            <div className="checkout-success-info-row">
              <span>💳 Thanh toán:</span>
              <span>{form.paymentMethod === 'cash' ? 'Tiền mặt khi nhận hàng' : 'Chuyển khoản ngân hàng'}</span>
            </div>
            <div className="checkout-success-info-row">
              <span>💰 Tổng tiền:</span>
              <span className="checkout-success-info-price">{fmt(finalTotal)}</span>
            </div>
          </div>
          <Link to="/" className="checkout-home-btn">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Thanh toán</h1>

        {/* Steps */}
        <div className="checkout-steps">
          {['Thông tin', 'Xác nhận', 'Hoàn tất'].map((s, i) => (
            <div key={i} className="checkout-step">
              <div className={`checkout-step-num${step > i + 1 ? ' done' : step === i + 1 ? ' active' : ''}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`checkout-step-label${step === i + 1 ? ' active' : ''}`}>{s}</span>
              {i < 2 && <div className={`checkout-step-line${step > i + 1 ? ' done' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Form / Confirm */}
          <div className="checkout-form-section">
            {step === 1 && (
              <form onSubmit={handleSubmit}>
                <h2 className="checkout-form-title">Thông tin khách hàng</h2>

                <div className="checkout-field">
                  <label className="checkout-label">Họ và tên *</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={`checkout-input${errors.name ? ' error' : ''}`}
                  />
                  {errors.name && <span className="checkout-error">{errors.name}</span>}
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Số điện thoại *</label>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className={`checkout-input${errors.phone ? ' error' : ''}`}
                  />
                  {errors.phone && <span className="checkout-error">{errors.phone}</span>}
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Địa chỉ giao hàng *</label>
                  <textarea
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    className={`checkout-input checkout-input-textarea${errors.address ? ' error' : ''}`}
                  />
                  {errors.address && <span className="checkout-error">{errors.address}</span>}
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Ghi chú</label>
                  <input
                    type="text"
                    placeholder="Ghi chú thêm cho đơn hàng (tuỳ chọn)"
                    value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    className="checkout-input"
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Phương thức thanh toán *</label>
                  <div className="checkout-pay-options">
                    {[
                      { value: 'cash', label: '💵 Tiền mặt khi nhận hàng' },
                      { value: 'transfer', label: '🏦 Chuyển khoản ngân hàng' },
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`checkout-pay-option${form.paymentMethod === opt.value ? ' active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.value}
                          checked={form.paymentMethod === opt.value}
                          onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                          style={{ marginRight: 8 }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="checkout-next-btn">
                  Tiếp tục xác nhận →
                </button>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className="checkout-form-title">Xác nhận đơn hàng</h2>

                <div className="checkout-confirm-info">
                  <h3 className="checkout-confirm-subtitle">Thông tin giao hàng</h3>
                  <div className="checkout-confirm-row"><span>Họ tên:</span><strong>{form.name}</strong></div>
                  <div className="checkout-confirm-row"><span>Điện thoại:</span><strong>{form.phone}</strong></div>
                  <div className="checkout-confirm-row"><span>Địa chỉ:</span><strong>{form.address}</strong></div>
                  {form.note && <div className="checkout-confirm-row"><span>Ghi chú:</span><strong>{form.note}</strong></div>}
                  <div className="checkout-confirm-row">
                    <span>Thanh toán:</span>
                    <strong>{form.paymentMethod === 'cash' ? 'Tiền mặt khi nhận' : 'Chuyển khoản'}</strong>
                  </div>
                </div>

                <h3 className="checkout-confirm-subtitle">Sản phẩm đặt mua</h3>
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-confirm-item">
                    <img src={item.image} alt={item.name} className="checkout-confirm-img" />
                    <div style={{ flex: 1 }}>
                      <div className="checkout-confirm-item-name">{item.name}</div>
                      <div className="checkout-confirm-item-qty">×{item.quantity}</div>
                    </div>
                    <div className="checkout-confirm-item-price">{fmt(item.price * item.quantity)}</div>
                  </div>
                ))}

                <div className="checkout-confirm-btns">
                  <button className="checkout-back-btn" onClick={() => setStep(1)}>← Quay lại</button>
                  <button className="checkout-confirm-btn" onClick={handleConfirm}>
                    ✅ Xác nhận đặt hàng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2 className="checkout-summary-title">Tóm tắt ({cartItems.length} sản phẩm)</h2>
            {cartItems.map(item => (
              <div key={item.id} className="checkout-summary-item">
                <img src={item.image} alt={item.name} className="checkout-summary-img" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="checkout-summary-item-name">{item.name}</div>
                  <div className="checkout-summary-item-qty">×{item.quantity}</div>
                </div>
                <div className="checkout-summary-item-price">{fmt(item.price * item.quantity)}</div>
              </div>
            ))}
            <div className="checkout-divider" />
            <div className="checkout-summary-row"><span>Tạm tính</span><span>{fmt(totalPrice)}</span></div>
            <div className="checkout-summary-row">
              <span>Vận chuyển</span>
              <span style={{ color: shipping === 0 ? '#27ae60' : '#333' }}>
                {shipping === 0 ? 'Miễn phí' : fmt(shipping)}
              </span>
            </div>
            <div className="checkout-divider" />
            <div className="checkout-total-row">
              <span>Tổng cộng</span>
              <span className="checkout-total-amount">{fmt(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
