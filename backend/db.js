const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',        // Thay bằng mật khẩu MySQL của bạn
  database: 'techshop',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
