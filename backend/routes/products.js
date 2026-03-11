const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products - danh sách sản phẩm (có filter)
router.get('/', async (req, res) => {
  try {
    const { search, category_id, status, min_price, max_price, sort } = req.query;
    let sql = 'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (search) { sql += ' AND p.name LIKE ?'; params.push(`%${search}%`); }
    if (category_id) { sql += ' AND p.category_id = ?'; params.push(Number(category_id)); }
    if (status) { sql += ' AND p.status = ?'; params.push(status); }
    if (min_price) { sql += ' AND p.price >= ?'; params.push(Number(min_price)); }
    if (max_price) { sql += ' AND p.price <= ?'; params.push(Number(max_price)); }

    if (sort === 'price-asc') sql += ' ORDER BY p.price ASC';
    else if (sort === 'price-desc') sql += ' ORDER BY p.price DESC';
    else if (sort === 'name') sql += ' ORDER BY p.name ASC';
    else sql += ' ORDER BY p.id DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id - chi tiết sản phẩm
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products - thêm sản phẩm
router.post('/', async (req, res) => {
  try {
    const { name, price, stock, sku, category_id, description, image, status } = req.body;
    if (!name || !price || !sku) return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });

    const [result] = await db.query(
      'INSERT INTO products (name, price, stock, sku, category_id, description, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, price, stock || 0, sku, category_id || 1, description || '', image || '', status || 'active']
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id - cập nhật sản phẩm
router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock, sku, category_id, description, image, status } = req.body;
    await db.query(
      'UPDATE products SET name=?, price=?, stock=?, sku=?, category_id=?, description=?, image=?, status=? WHERE id=?',
      [name, price, stock, sku, category_id, description, image, status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id - xóa sản phẩm
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
