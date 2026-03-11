# ⚡ TechShop — E-Commerce Website

Website bán hàng công nghệ xây dựng bằng **React + Vite** (frontend) và **Node.js + Express + MySQL** (backend).

---

## Cấu trúc project

```
ClaudePrac/
├── src/                        # Frontend (React)
│   ├── components/
│   │   ├── Navbar.jsx          # Thanh điều hướng + giỏ hàng dropdown
│   │   ├── ProductCard.jsx     # Card hiển thị sản phẩm
│   │   └── Footer.jsx          # Footer
│   ├── pages/
│   │   ├── Home.jsx            # Trang chủ (banner, danh mục, sản phẩm nổi bật)
│   │   ├── Products.jsx        # Danh sách sản phẩm (tìm kiếm + lọc)
│   │   ├── ProductDetail.jsx   # Chi tiết sản phẩm
│   │   ├── Cart.jsx            # Giỏ hàng
│   │   ├── Checkout.jsx        # Thanh toán (3 bước)
│   │   └── Admin.jsx           # Trang quản trị
│   ├── context/
│   │   └── CartContext.jsx     # Quản lý state giỏ hàng (React Context)
│   ├── data/
│   │   └── mockData.js         # Dữ liệu mẫu (12 sản phẩm, 5 danh mục)
│   ├── App.jsx                 # Router chính
│   └── index.css               # Global styles
├── backend/                    # Backend (Node.js + Express)
│   ├── routes/
│   │   ├── products.js         # API CRUD sản phẩm
│   │   ├── categories.js       # API CRUD danh mục
│   │   └── orders.js           # API tạo & xem đơn hàng
│   ├── server.js               # Entry point Express
│   ├── db.js                   # Kết nối MySQL pool
│   ├── database.sql            # Schema + dữ liệu mẫu MySQL
│   └── package.json
├── requirement.md              # Yêu cầu dự án
└── package.json
```

---

## Tính năng

### Frontend
| Trang | URL | Mô tả |
|-------|-----|-------|
| Trang chủ | `/` | Banner slideshow, danh mục, sản phẩm nổi bật |
| Danh sách SP | `/products` | Grid sản phẩm, lọc theo danh mục/giá/trạng thái, sắp xếp |
| Chi tiết SP | `/products/:id` | Hình lớn, mô tả, tồn kho, chọn số lượng, thêm giỏ hàng |
| Giỏ hàng | `/cart` | Cập nhật số lượng, xóa sản phẩm, tính tổng + phí ship |
| Thanh toán | `/checkout` | 3 bước: nhập thông tin → xác nhận → hoàn tất |
| Admin | `/admin` | Thêm/sửa/xóa sản phẩm, xem danh mục, thống kê |

### Backend API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Lấy danh sách (filter: search, category_id, status, giá, sort) |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| POST | `/api/products` | Thêm sản phẩm |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xóa sản phẩm |
| GET | `/api/categories` | Danh sách danh mục |
| POST | `/api/orders` | Tạo đơn hàng (có transaction, trừ tồn kho) |
| GET | `/api/orders/:id` | Chi tiết đơn hàng |
| GET | `/api/health` | Kiểm tra server |

### Database (MySQL)
4 bảng: `categories`, `products`, `orders`, `order_items`

---

## Cài đặt & Chạy

### Frontend

```bash
# Cài dependencies
npm install

# Chạy development server (http://localhost:5173)
npm run dev

# Build production
npm run build
```

### Backend

> Yêu cầu: MySQL đang chạy trên máy

```bash
# 1. Import database
# Mở MySQL và chạy file backend/database.sql

# 2. Cấu hình kết nối (nếu cần)
# Sửa host/user/password trong backend/db.js

# 3. Cài dependencies và chạy
cd backend
npm install
node server.js
# Server chạy tại http://localhost:3001

# Hoặc dùng nodemon (tự reload khi sửa code)
npm run dev
```

---

## Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 19, React Router v6, Vite 7 |
| Backend | Node.js, Express 4 |
| Database | MySQL 8, mysql2 |
| State | React Context API |
| Style | Inline styles (CSS-in-JS) |
