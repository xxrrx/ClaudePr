import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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
    // In a real app, this would call the backend API
    clearCart();
    setStep(3);
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2>Giỏ hàng trống</h2>
        <Link to="/products" style={styles.shopBtn}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  // Success
  if (step === 3) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Đặt hàng thành công!</h2>
          <p style={styles.successDesc}>
            Cảm ơn <strong>{form.name}</strong>! Đơn hàng của bạn đã được tiếp nhận.<br />
            Chúng tôi sẽ liên hệ qua số <strong>{form.phone}</strong> để xác nhận.
          </p>
          <div style={styles.successInfo}>
            <div style={styles.successInfoRow}>
              <span>📍 Địa chỉ:</span>
              <span>{form.address}</span>
            </div>
            <div style={styles.successInfoRow}>
              <span>💳 Thanh toán:</span>
              <span>{form.paymentMethod === 'cash' ? 'Tiền mặt khi nhận hàng' : 'Chuyển khoản ngân hàng'}</span>
            </div>
            <div style={styles.successInfoRow}>
              <span>💰 Tổng tiền:</span>
              <span style={{ color: '#e94560', fontWeight: 700 }}>{fmt(finalTotal)}</span>
            </div>
          </div>
          <Link to="/" style={styles.homeBtn}>Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Thanh toán</h1>

        {/* Steps */}
        <div style={styles.steps}>
          {['Thông tin', 'Xác nhận', 'Hoàn tất'].map((s, i) => (
            <div key={i} style={styles.step}>
              <div style={{
                ...styles.stepNum,
                ...(step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : {})
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, ...(step === i + 1 ? { color: '#e94560' } : {}) }}>{s}</span>
              {i < 2 && <div style={{ ...styles.stepLine, ...(step > i + 1 ? { background: '#e94560' } : {}) }} />}
            </div>
          ))}
        </div>

        <div style={styles.layout}>
          {/* Form / Confirm */}
          <div style={styles.formSection}>
            {step === 1 && (
              <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.formTitle}>Thông tin khách hàng</h2>

                <div style={styles.field}>
                  <label style={styles.label}>Họ và tên *</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                  />
                  {errors.name && <span style={styles.error}>{errors.name}</span>}
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Số điện thoại *</label>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                  />
                  {errors.phone && <span style={styles.error}>{errors.phone}</span>}
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Địa chỉ giao hàng *</label>
                  <textarea
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    style={{ ...styles.input, ...(errors.address ? styles.inputError : {}), resize: 'vertical' }}
                  />
                  {errors.address && <span style={styles.error}>{errors.address}</span>}
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Ghi chú</label>
                  <input
                    type="text"
                    placeholder="Ghi chú thêm cho đơn hàng (tuỳ chọn)"
                    value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Phương thức thanh toán *</label>
                  <div style={styles.payOptions}>
                    {[
                      { value: 'cash', label: '💵 Tiền mặt khi nhận hàng' },
                      { value: 'transfer', label: '🏦 Chuyển khoản ngân hàng' },
                    ].map(opt => (
                      <label key={opt.value} style={{
                        ...styles.payOption,
                        ...(form.paymentMethod === opt.value ? styles.payOptionActive : {}),
                      }}>
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

                <button type="submit" style={styles.nextBtn}>
                  Tiếp tục xác nhận →
                </button>
              </form>
            )}

            {step === 2 && (
              <div style={styles.confirmSection}>
                <h2 style={styles.formTitle}>Xác nhận đơn hàng</h2>

                <div style={styles.confirmInfo}>
                  <h3 style={styles.confirmSubtitle}>Thông tin giao hàng</h3>
                  <div style={styles.confirmRow}><span>Họ tên:</span><strong>{form.name}</strong></div>
                  <div style={styles.confirmRow}><span>Điện thoại:</span><strong>{form.phone}</strong></div>
                  <div style={styles.confirmRow}><span>Địa chỉ:</span><strong>{form.address}</strong></div>
                  {form.note && <div style={styles.confirmRow}><span>Ghi chú:</span><strong>{form.note}</strong></div>}
                  <div style={styles.confirmRow}>
                    <span>Thanh toán:</span>
                    <strong>{form.paymentMethod === 'cash' ? 'Tiền mặt khi nhận' : 'Chuyển khoản'}</strong>
                  </div>
                </div>

                <h3 style={styles.confirmSubtitle}>Sản phẩm đặt mua</h3>
                {cartItems.map(item => (
                  <div key={item.id} style={styles.confirmItem}>
                    <img src={item.image} alt={item.name} style={styles.confirmImg} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>×{item.quantity}</div>
                    </div>
                    <div style={{ color: '#e94560', fontWeight: 700 }}>{fmt(item.price * item.quantity)}</div>
                  </div>
                ))}

                <div style={styles.confirmBtns}>
                  <button style={styles.backBtn} onClick={() => setStep(1)}>← Quay lại</button>
                  <button style={styles.confirmBtn} onClick={handleConfirm}>
                    ✅ Xác nhận đặt hàng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Tóm tắt ({cartItems.length} sản phẩm)</h2>
            {cartItems.map(item => (
              <div key={item.id} style={styles.summaryItem}>
                <img src={item.image} alt={item.name} style={styles.summaryImg} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.summaryItemName}>{item.name}</div>
                  <div style={styles.summaryItemQty}>×{item.quantity}</div>
                </div>
                <div style={styles.summaryItemPrice}>{fmt(item.price * item.quantity)}</div>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={styles.summaryRow}><span>Tạm tính</span><span>{fmt(totalPrice)}</span></div>
            <div style={styles.summaryRow}>
              <span>Vận chuyển</span>
              <span style={{ color: shipping === 0 ? '#27ae60' : '#333' }}>
                {shipping === 0 ? 'Miễn phí' : fmt(shipping)}
              </span>
            </div>
            <div style={styles.divider} />
            <div style={styles.totalRow}>
              <span>Tổng cộng</span>
              <span style={styles.totalAmount}>{fmt(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f8f9fa', minHeight: '100vh', paddingBottom: 60 },
  container: { maxWidth: 1280, margin: '0 auto', padding: '32px 20px' },
  title: { fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 32px' },
  empty: { textAlign: 'center', padding: '100px 20px' },
  shopBtn: {
    display: 'inline-block',
    background: '#e94560',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
    marginTop: 16,
  },
  steps: { display: 'flex', alignItems: 'center', marginBottom: 32 },
  step: { display: 'flex', alignItems: 'center', gap: 8 },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#e0e0e0',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13,
  },
  stepActive: { background: '#e94560', color: '#fff' },
  stepDone: { background: '#27ae60', color: '#fff' },
  stepLabel: { fontSize: 13, color: '#888', fontWeight: 500 },
  stepLine: { width: 60, height: 2, background: '#e0e0e0', margin: '0 8px' },
  layout: { display: 'flex', gap: 24, alignItems: 'flex-start' },
  formSection: {
    flex: 1,
    background: '#fff',
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  form: {},
  formTitle: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputError: { borderColor: '#e94560' },
  error: { fontSize: 12, color: '#e94560', marginTop: 4, display: 'block' },
  payOptions: { display: 'flex', gap: 12 },
  payOption: {
    flex: 1,
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
  },
  payOptionActive: {
    border: '1px solid #e94560',
    background: '#fff0f3',
    color: '#e94560',
    fontWeight: 600,
  },
  nextBtn: {
    width: '100%',
    padding: '14px',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
  },
  confirmSection: {},
  confirmInfo: {
    background: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  confirmSubtitle: { fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 12px' },
  confirmRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    gap: 16,
  },
  confirmItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  confirmImg: {
    width: 56,
    height: 56,
    objectFit: 'cover',
    borderRadius: 8,
    background: '#f5f5f5',
  },
  confirmBtns: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
  },
  backBtn: {
    flex: 1,
    padding: '12px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: '#555',
  },
  confirmBtn: {
    flex: 2,
    padding: '12px',
    background: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 700,
  },
  summary: {
    width: 320,
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    flexShrink: 0,
  },
  summaryTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  summaryImg: {
    width: 44,
    height: 44,
    objectFit: 'cover',
    borderRadius: 6,
    background: '#f5f5f5',
    flexShrink: 0,
  },
  summaryItemName: {
    fontSize: 12,
    fontWeight: 500,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  summaryItemQty: { fontSize: 11, color: '#999' },
  summaryItemPrice: { fontSize: 13, fontWeight: 600, color: '#e94560', flexShrink: 0 },
  divider: { borderTop: '1px dashed #e0e0e0', margin: '12px 0' },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    fontSize: 16,
    color: '#1a1a2e',
  },
  totalAmount: { color: '#e94560', fontSize: 20 },
  successPage: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa',
    padding: 20,
  },
  successCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 48,
    textAlign: 'center',
    maxWidth: 480,
    width: '100%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: 800, color: '#1a1a2e', margin: '0 0 12px' },
  successDesc: { color: '#666', lineHeight: 1.7, margin: '0 0 24px' },
  successInfo: {
    background: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    textAlign: 'left',
    marginBottom: 24,
  },
  successInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    gap: 12,
  },
  homeBtn: {
    display: 'inline-block',
    background: '#e94560',
    color: '#fff',
    padding: '12px 32px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
  },
};
