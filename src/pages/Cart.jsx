import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Giỏ hàng trống</h2>
        <p style={styles.emptyDesc}>Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <Link to="/products" style={styles.shopBtn}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  const shipping = totalPrice >= 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shipping;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Giỏ hàng của bạn</h1>

        <div style={styles.layout}>
          {/* Cart Items */}
          <div style={styles.cartSection}>
            <div style={styles.tableHeader}>
              <span style={{ flex: 3 }}>Sản phẩm</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Đơn giá</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Số lượng</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Thành tiền</span>
              <span style={{ width: 40 }}></span>
            </div>

            {cartItems.map(item => (
              <div key={item.id} style={styles.cartRow}>
                <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <div>
                    <Link to={`/products/${item.id}`} style={styles.itemName}>{item.name}</Link>
                    <div style={styles.itemSku}>SKU: {item.sku}</div>
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: 'center', color: '#e94560', fontWeight: 600 }}>
                  {fmt(item.price)}
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={styles.qtyControl}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >−</button>
                    <span style={styles.qtyValue}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    >+</button>
                  </div>
                </div>

                <div style={{ flex: 1, textAlign: 'right', fontWeight: 700, color: '#1a1a2e' }}>
                  {fmt(item.price * item.quantity)}
                </div>

                <button
                  style={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                >🗑️</button>
              </div>
            ))}

            <div style={styles.cartFooterRow}>
              <Link to="/products" style={styles.continueBtn}>← Tiếp tục mua sắm</Link>
            </div>
          </div>

          {/* Summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Tóm tắt đơn hàng</h2>

            <div style={styles.summaryRow}>
              <span>Tạm tính ({cartItems.length} sản phẩm)</span>
              <span>{fmt(totalPrice)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Phí vận chuyển</span>
              <span style={{ color: shipping === 0 ? '#27ae60' : '#333' }}>
                {shipping === 0 ? 'Miễn phí' : fmt(shipping)}
              </span>
            </div>
            {shipping === 0 && (
              <div style={styles.freeShipNote}>🎉 Bạn được miễn phí vận chuyển!</div>
            )}
            {shipping > 0 && (
              <div style={styles.freeShipNote}>
                Mua thêm {fmt(500000 - totalPrice)} để được miễn phí vận chuyển
              </div>
            )}

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Tổng cộng</span>
              <span style={styles.totalAmount}>{fmt(finalTotal)}</span>
            </div>

            <Link to="/checkout" style={styles.checkoutBtn}>
              Tiến hành thanh toán →
            </Link>

            <div style={styles.payMethods}>
              <div style={styles.payTitle}>Phương thức thanh toán</div>
              <div style={styles.payIcons}>
                💳 Thẻ ngân hàng &nbsp; 💵 Tiền mặt &nbsp; 📱 Ví điện tử
              </div>
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
  empty: {
    textAlign: 'center',
    padding: '100px 20px',
  },
  emptyIcon: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 24, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' },
  emptyDesc: { color: '#888', margin: '0 0 24px' },
  shopBtn: {
    display: 'inline-block',
    background: '#e94560',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
  },
  layout: { display: 'flex', gap: 24, alignItems: 'flex-start' },
  cartSection: {
    flex: 1,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    background: '#f8f9fa',
    borderBottom: '1px solid #eee',
    fontSize: 12,
    color: '#888',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    gap: 16,
  },
  cartRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #f5f5f5',
    gap: 16,
  },
  itemImg: {
    width: 72,
    height: 72,
    objectFit: 'cover',
    borderRadius: 8,
    background: '#f5f5f5',
    flexShrink: 0,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a2e',
    textDecoration: 'none',
    display: 'block',
    marginBottom: 4,
  },
  itemSku: { fontSize: 12, color: '#999' },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    background: '#f5f5f5',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    width: 40,
    flexShrink: 0,
  },
  cartFooterRow: {
    padding: '16px 20px',
    background: '#fafafa',
  },
  continueBtn: {
    color: '#e94560',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
  },
  summary: {
    width: 320,
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    flexShrink: 0,
  },
  summaryTitle: { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  freeShipNote: {
    fontSize: 12,
    color: '#27ae60',
    background: '#f0fff4',
    padding: '8px 10px',
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  divider: { borderTop: '1px dashed #e0e0e0', margin: '16px 0' },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 20,
  },
  totalAmount: { color: '#e94560', fontSize: 20 },
  checkoutBtn: {
    display: 'block',
    textAlign: 'center',
    background: '#e94560',
    color: '#fff',
    padding: '14px',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 16,
  },
  payMethods: {
    textAlign: 'center',
    paddingTop: 16,
    borderTop: '1px solid #f0f0f0',
  },
  payTitle: { fontSize: 12, color: '#999', marginBottom: 8 },
  payIcons: { fontSize: 12, color: '#666' },
};
