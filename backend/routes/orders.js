const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/orders - danh sách đơn hàng
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id - chi tiết đơn hàng
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

    const [items] = await db.query(
      `SELECT oi.*, p.name AS product_name, p.image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders - tạo đơn hàng
router.post('/', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { customer_name, phone, address, note, items } = req.body;

    if (!customer_name || !phone || !address || !items?.length) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt hàng' });
    }

    const total_price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_name, phone, address, note, total_price) VALUES (?, ?, ?, ?, ?)',
      [customer_name, phone, address, note || '', total_price]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      // Cập nhật tồn kho
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.product_id, item.quantity]
      );
    }

    await conn.commit();
    res.status(201).json({ success: true, data: { id: orderId, total_price } });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
