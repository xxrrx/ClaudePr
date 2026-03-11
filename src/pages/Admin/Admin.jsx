import { useState } from 'react';
import { products as initialProducts, categories } from '../../data/mockData';
import './Admin.css';

const emptyForm = {
  name: '', price: '', stock: '', sku: '', category_id: 1,
  description: '', image: '', status: 'active',
};

export default function Admin() {
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '—';

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      ...product,
      price: String(product.price),
      stock: String(product.stock),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.sku) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    if (editingId) {
      setProducts(prev => prev.map(p =>
        p.id === editingId
          ? { ...form, id: editingId, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) }
          : p
      ));
    } else {
      const newId = Math.max(...products.map(p => p.id)) + 1;
      setProducts(prev => [...prev, {
        ...form,
        id: newId,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: Number(form.category_id),
      }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active' && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    categories: categories.length,
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">⚙️ Quản trị TechShop</h1>
          <div className="admin-tabs">
            {[
              { key: 'products', label: '📦 Sản phẩm' },
              { key: 'categories', label: '📂 Danh mục' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`admin-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Stats */}
        <div className="admin-stats-grid">
          {[
            { label: 'Tổng sản phẩm', value: stats.total, icon: '📦', color: '#667eea' },
            { label: 'Đang bán', value: stats.active, icon: '✅', color: '#27ae60' },
            { label: 'Hết hàng', value: stats.outOfStock, icon: '⚠️', color: '#f39c12' },
            { label: 'Danh mục', value: stats.categories, icon: '📂', color: '#e94560' },
          ].map(stat => (
            <div key={stat.label} className="admin-stat-card">
              <div
                className="admin-stat-icon"
                style={{ background: stat.color + '20', color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="admin-stat-value">{stat.value}</div>
                <div className="admin-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'products' && (
          <div className="admin-panel">
            {/* Toolbar */}
            <div className="admin-toolbar">
              <input
                type="text"
                placeholder="Tìm tên hoặc SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="admin-search-input"
              />
              <button className="admin-add-btn" onClick={openAdd}>+ Thêm sản phẩm</button>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr className="admin-thead">
                    <th className="admin-th">Sản phẩm</th>
                    <th className="admin-th">SKU</th>
                    <th className="admin-th">Danh mục</th>
                    <th className="admin-th">Giá</th>
                    <th className="admin-th">Tồn kho</th>
                    <th className="admin-th">Trạng thái</th>
                    <th className="admin-th">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="admin-tr">
                      <td className="admin-td">
                        <div className="admin-product-cell">
                          <img src={p.image} alt={p.name} className="admin-product-thumb" />
                          <span className="admin-product-name">{p.name}</span>
                        </div>
                      </td>
                      <td className="admin-td"><code className="admin-code">{p.sku}</code></td>
                      <td className="admin-td">{getCatName(p.category_id)}</td>
                      <td className="admin-td">
                        <strong className="admin-price-cell">{fmt(p.price)}</strong>
                      </td>
                      <td className="admin-td">
                        <span
                          className="admin-stock-badge"
                          style={{
                            background: p.stock === 0 ? '#fff0f0' : p.stock <= 5 ? '#fff8e6' : '#f0fff4',
                            color: p.stock === 0 ? '#e74c3c' : p.stock <= 5 ? '#f39c12' : '#27ae60',
                          }}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="admin-td">
                        <span
                          className="admin-status-badge"
                          style={{
                            background: p.status === 'active' && p.stock > 0 ? '#f0fff4' : '#f5f5f5',
                            color: p.status === 'active' && p.stock > 0 ? '#27ae60' : '#999',
                          }}
                        >
                          {p.status === 'active' && p.stock > 0 ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                      </td>
                      <td className="admin-td">
                        <div className="admin-row-actions">
                          <button className="admin-edit-btn" onClick={() => openEdit(p)}>✏️ Sửa</button>
                          <button className="admin-delete-btn" onClick={() => setDeleteConfirm(p.id)}>🗑️ Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="admin-panel">
            <h2 className="admin-panel-title">Quản lý danh mục</h2>
            <div className="admin-cat-grid">
              {categories.map(cat => {
                const count = products.filter(p => p.category_id === cat.id).length;
                return (
                  <div key={cat.id} className="admin-cat-card">
                    <div className="admin-cat-card-icon">
                      {cat.id === 1 ? '📱' : cat.id === 2 ? '💻' : cat.id === 3 ? '🎧' : cat.id === 4 ? '📟' : '🔊'}
                    </div>
                    <div className="admin-cat-card-name">{cat.name}</div>
                    <div className="admin-cat-card-count">{count} sản phẩm</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="admin-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button className="admin-close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label className="admin-label">Tên sản phẩm *</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="iPhone 15 Pro Max"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">SKU *</label>
                  <input
                    className="admin-input"
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    placeholder="IPH-15PM-256"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Giá (₫) *</label>
                  <input
                    className="admin-input"
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="29990000"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Tồn kho</label>
                  <input
                    className="admin-input"
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Danh mục</label>
                  <select
                    className="admin-input"
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Trạng thái</label>
                  <select
                    className="admin-input"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ngừng bán</option>
                  </select>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label">URL Hình ảnh</label>
                <input
                  className="admin-input"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
                {form.image && (
                  <img src={form.image} alt="preview" className="admin-img-preview" />
                )}
              </div>

              <div className="admin-field">
                <label className="admin-label">Mô tả sản phẩm</label>
                <textarea
                  className="admin-input admin-input-textarea"
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả chi tiết sản phẩm..."
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-cancel-btn" onClick={() => setShowForm(false)}>Hủy</button>
              <button className="admin-save-btn" onClick={handleSave}>
                {editingId ? '💾 Lưu thay đổi' : '➕ Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-overlay">
          <div className="admin-confirm-modal">
            <div className="admin-confirm-icon">⚠️</div>
            <h3 className="admin-confirm-title">Xác nhận xóa</h3>
            <p className="admin-confirm-desc">
              Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </p>
            <div className="admin-confirm-btns">
              <button className="admin-cancel-btn" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="admin-confirm-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
