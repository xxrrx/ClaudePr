import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">⚡ TechShop</div>
            <p className="footer-desc">
              Cửa hàng công nghệ hàng đầu Việt Nam. Cam kết sản phẩm chính hãng,
              giao hàng nhanh toàn quốc.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Danh mục</div>
            <Link to="/products?category=1" className="footer-link">Điện thoại</Link>
            <Link to="/products?category=2" className="footer-link">Laptop</Link>
            <Link to="/products?category=4" className="footer-link">Máy tính bảng</Link>
            <Link to="/products?category=5" className="footer-link">Âm thanh</Link>
          </div>
          <div>
            <div className="footer-col-title">Hỗ trợ</div>
            <a href="#" className="footer-link">Chính sách đổi trả</a>
            <a href="#" className="footer-link">Bảo hành</a>
            <a href="#" className="footer-link">Hướng dẫn mua hàng</a>
            <a href="#" className="footer-link">Liên hệ</a>
          </div>
          <div>
            <div className="footer-col-title">Liên hệ</div>
            <p className="footer-contact">📍 123 Nguyễn Văn Linh, TP.HCM</p>
            <p className="footer-contact">📞 1800 6868</p>
            <p className="footer-contact">✉️ support@techshop.vn</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 TechShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
