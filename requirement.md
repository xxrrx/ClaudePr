1. Trang hiển thị sản phẩm (Frontend)
Đây là phần người dùng nhìn thấy.
Trang chủ
Hiển thị sản phẩm nổi bật
Banner / khuyến mãi
Menu danh mục
Trang danh sách sản phẩm
Hiển thị sản phẩm dạng card
Có:
hình ảnh
tên sản phẩm
giá
nút xem chi tiết
Trang chi tiết sản phẩm
Hình ảnh lớn
Mô tả
Giá
Số lượng tồn
Nút Thêm vào giỏ hàng
Tìm kiếm & lọc
Tìm theo tên
Lọc theo:
danh mục
giá
trạng thái
2. Giỏ hàng (Shopping Cart)
Chức năng quan trọng:
Thêm sản phẩm
Xóa sản phẩm
Cập nhật số lượng
Tính tổng tiền
Thông thường giỏ hàng có thể:
hiển thị dropdown trên navbar
hoặc trang giỏ hàng riêng
3. Thanh toán / đặt hàng (Checkout)
Ở bản cơ bản thường có:
Nhập thông tin khách hàng
tên
số điện thoại
địa chỉ
Xác nhận đơn hàng
(Hệ thống đơn giản có thể chưa cần tích hợp thanh toán online)
4. Quản lý sản phẩm (Admin)
Trang dành cho quản trị:
Thêm sản phẩm
Sửa sản phẩm
Xóa sản phẩm
Quản lý danh mục
Thông tin sản phẩm thường gồm:
tên
giá
tồn kho
SKU
danh mục
mô tả
hình ảnh
trạng thái (còn bán / ngừng bán)
5. Backend (API / xử lý dữ liệu)
Phần server xử lý:
lấy danh sách sản phẩm
thêm / sửa / xóa sản phẩm
xử lý giỏ hàng
tạo đơn hàng
Công nghệ phổ biến:
Frontend: React
Backend: Node.js + Express
Database: MySQL
6. Database (Cơ sở dữ liệu)
Các bảng cơ bản:
products
i
name
price
stock
sku
description
image
category_id
status
categories
id
name
orders
id
customer_name
phone
address
total_price
created_at
order_items
id
order_id
product_id
quantity
price