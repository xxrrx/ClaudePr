-- TechShop Database Schema
-- Chạy file này trong MySQL để tạo database

CREATE DATABASE IF NOT EXISTS techshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techshop;

-- Bảng danh mục
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Bảng sản phẩm
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(15,0) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  sku VARCHAR(100) NOT NULL UNIQUE,
  category_id INT,
  description TEXT,
  image VARCHAR(500),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bảng đơn hàng
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  note TEXT,
  total_price DECIMAL(15,0) NOT NULL DEFAULT 0,
  status ENUM('pending','confirmed','shipping','delivered','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng chi tiết đơn hàng
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(15,0) NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Dữ liệu mẫu - Danh mục
INSERT INTO categories (name) VALUES
  ('Điện thoại'),
  ('Laptop'),
  ('Phụ kiện'),
  ('Máy tính bảng'),
  ('Âm thanh');

-- Dữ liệu mẫu - Sản phẩm
INSERT INTO products (name, price, stock, sku, category_id, description, image, status) VALUES
  ('iPhone 15 Pro Max', 29990000, 15, 'IPH-15PM-256', 1, 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.7 inch.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 'active'),
  ('Samsung Galaxy S24 Ultra', 26990000, 20, 'SAM-S24U-256', 1, 'Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP, màn hình Dynamic AMOLED 2X 6.8 inch.', 'https://images.unsplash.com/photo-1706439571780-5956c87e8a3e?w=400', 'active'),
  ('MacBook Pro 14 inch M3', 49990000, 8, 'MBP-14-M3-512', 2, 'MacBook Pro 14 inch với chip Apple M3, màn hình Liquid Retina XDR, pin lên đến 18 giờ.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'active'),
  ('Dell XPS 15', 35990000, 5, 'DELL-XPS15-I7', 2, 'Dell XPS 15 với màn hình OLED 15.6 inch, Intel Core i7 thế hệ 13, RAM 32GB, SSD 1TB.', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', 'active'),
  ('AirPods Pro 2', 6490000, 30, 'APP-PRO2-USB', 5, 'AirPods Pro 2 với chống ồn chủ động H2, âm thanh Spatial Audio, pin 6 giờ.', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 'active'),
  ('iPad Pro 12.9 inch M2', 28990000, 12, 'IPAD-PRO-M2-256', 4, 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil 2.', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'active'),
  ('Ốp lưng iPhone 15 Pro', 290000, 100, 'CASE-IPH15P-CLR', 3, 'Ốp lưng trong suốt chống sốc cho iPhone 15 Pro, chất liệu TPU cao cấp.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', 'active'),
  ('Sony WH-1000XM5', 8490000, 0, 'SONY-WH1000XM5', 5, 'Tai nghe Sony WH-1000XM5 với chống ồn hàng đầu thế giới, pin 30 giờ.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'inactive');
