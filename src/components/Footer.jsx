import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div>
            <div style={styles.brand}>⚡ TechShop</div>
            <p style={styles.desc}>
              Cửa hàng công nghệ hàng đầu Việt Nam. Cam kết sản phẩm chính hãng,
              giao hàng nhanh toàn quốc.
            </p>
          </div>
          <div>
            <div style={styles.colTitle}>Danh mục</div>
            <Link to="/products?category=1" style={styles.link}>Điện thoại</Link>
            <Link to="/products?category=2" style={styles.link}>Laptop</Link>
            <Link to="/products?category=4" style={styles.link}>Máy tính bảng</Link>
            <Link to="/products?category=5" style={styles.link}>Âm thanh</Link>
          </div>
          <div>
            <div style={styles.colTitle}>Hỗ trợ</div>
            <a href="#" style={styles.link}>Chính sách đổi trả</a>
            <a href="#" style={styles.link}>Bảo hành</a>
            <a href="#" style={styles.link}>Hướng dẫn mua hàng</a>
            <a href="#" style={styles.link}>Liên hệ</a>
          </div>
          <div>
            <div style={styles.colTitle}>Liên hệ</div>
            <p style={styles.contact}>📍 123 Nguyễn Văn Linh, TP.HCM</p>
            <p style={styles.contact}>📞 1800 6868</p>
            <p style={styles.contact}>✉️ support@techshop.vn</p>
          </div>
        </div>
        <div style={styles.bottom}>
          <p>© 2024 TechShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1a1a2e',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 60,
  },
  container: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '40px 20px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: 40,
    paddingBottom: 40,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 12,
  },
  desc: {
    fontSize: 13,
    lineHeight: 1.7,
    margin: 0,
  },
  colTitle: {
    color: '#fff',
    fontWeight: 600,
    marginBottom: 14,
    fontSize: 14,
  },
  link: {
    display: 'block',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: 13,
    marginBottom: 8,
  },
  contact: {
    fontSize: 13,
    margin: '0 0 8px',
  },
  bottom: {
    textAlign: 'center',
    padding: '20px 0',
    fontSize: 13,
  },
};
