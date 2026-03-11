import { useState } from 'react';
import { products as initialProducts, categories } from '../data/mockData';

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
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>⚙️ Quản trị TechShop</h1>
          <div style={styles.tabs}>
            {[
              { key: 'products', label: '📦 Sản phẩm' },
              { key: 'categories', label: '📂 Danh mục' },
            ].map(tab => (
              <button
                key={tab.key}
                style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
                onClick={() => setActiveTab(tab.key)}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Tổng sản phẩm', value: stats.total, icon: '📦', color: '#667eea' },
            { label: 'Đang bán', value: stats.active, icon: '✅', color: '#27ae60' },
            { label: 'Hết hàng', value: stats.outOfStock, icon: '⚠️', color: '#f39c12' },
            { label: 'Danh mục', value: stats.categories, icon: '📂', color: '#e94560' },
          ].map(stat => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'products' && (
          <div style={styles.panel}>
            {/* Toolbar */}
            <div style={styles.toolbar}>
              <input
                type="text"
                placeholder="Tìm tên hoặc SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button style={styles.addBtn} onClick={openAdd}>+ Thêm sản phẩm</button>
            </div>

            {/* Table */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Sản phẩm</th>
                    <th style={styles.th}>SKU</th>
                    <th style={styles.th}>Danh mục</th>
                    <th style={styles.th}>Giá</th>
                    <th style={styles.th}>Tồn kho</th>
                    <th style={styles.th}>Trạng thái</th>
                    <th style={styles.th}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <img src={p.image} alt={p.name} style={styles.productThumb} />
                          <span style={styles.productName}>{p.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}><code style={styles.code}>{p.sku}</code></td>
                      <td style={styles.td}>{getCatName(p.category_id)}</td>
                      <td style={styles.td}><strong style={{ color: '#e94560' }}>{fmt(p.price)}</strong></td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.stockBadge,
                          background: p.stock === 0 ? '#fff0f0' : p.stock <= 5 ? '#fff8e6' : '#f0fff4',
                          color: p.stock === 0 ? '#e74c3c' : p.stock <= 5 ? '#f39c12' : '#27ae60',
                        }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          background: p.status === 'active' && p.stock > 0 ? '#f0fff4' : '#f5f5f5',
                          color: p.status === 'active' && p.stock > 0 ? '#27ae60' : '#999',
                        }}>
                          {p.status === 'active' && p.stock > 0 ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button style={styles.editBtn} onClick={() => openEdit(p)}>✏️ Sửa</button>
                          <button style={styles.deleteBtn} onClick={() => setDeleteConfirm(p.id)}>🗑️ Xóa</button>
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
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Quản lý danh mục</h2>
            <div style={styles.catGrid}>
              {categories.map(cat => {
                const count = products.filter(p => p.category_id === cat.id).length;
                return (
                  <div key={cat.id} style={styles.catCard}>
                    <div style={styles.catCardIcon}>
                      {cat.id === 1 ? '📱' : cat.id === 2 ? '💻' : cat.id === 3 ? '🎧' : cat.id === 4 ? '📟' : '🔊'}
                    </div>
                    <div style={styles.catCardName}>{cat.name}</div>
                    <div style={styles.catCardCount}>{count} sản phẩm</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Tên sản phẩm *</label>
                  <input
                    style={styles.input}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="iPhone 15 Pro Max"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>SKU *</label>
                  <input
                    style={styles.input}
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    placeholder="IPH-15PM-256"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Giá (₫) *</label>
                  <input
                    style={styles.input}
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="29990000"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Tồn kho</label>
                  <input
                    style={styles.input}
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Danh mục</label>
                  <select
                    style={styles.input}
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Trạng thái</label>
                  <select
                    style={styles.input}
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ngừng bán</option>
                  </select>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>URL Hình ảnh</label>
                <input
                  style={styles.input}
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
                {form.image && (
                  <img src={form.image} alt="preview" style={styles.imgPreview} />
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Mô tả sản phẩm</label>
                <textarea
                  style={{ ...styles.input, resize: 'vertical' }}
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả chi tiết sản phẩm..."
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Hủy</button>
              <button style={styles.saveBtn} onClick={handleSave}>
                {editingId ? '💾 Lưu thay đổi' : '➕ Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.confirmModal}>
            <div style={styles.confirmIcon}>⚠️</div>
            <h3 style={styles.confirmTitle}>Xác nhận xóa</h3>
            <p style={styles.confirmDesc}>
              Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </p>
            <div style={styles.confirmBtns}>
              <button style={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button style={styles.confirmDeleteBtn} onClick={() => handleDelete(deleteConfirm)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: '#f0f2f5', minHeight: '100vh' },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff',
    padding: '20px 0',
  },
  headerContent: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700 },
  tabs: { display: 'flex', gap: 8 },
  tab: {
    padding: '8px 18px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  },
  tabActive: {
    background: '#e94560',
    border: '1px solid #e94560',
    color: '#fff',
    fontWeight: 700,
  },
  container: { maxWidth: 1280, margin: '0 auto', padding: '24px 20px' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  statValue: { fontSize: 28, fontWeight: 800, color: '#1a1a2e', lineHeight: 1 },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  panel: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  panelTitle: { padding: '20px 24px 0', margin: 0, fontSize: 18, fontWeight: 700, color: '#1a1a2e' },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    maxWidth: 300,
    padding: '9px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 13,
    outline: 'none',
  },
  addBtn: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '9px 18px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '14px 16px', fontSize: 13, color: '#333', verticalAlign: 'middle' },
  productCell: { display: 'flex', alignItems: 'center', gap: 12 },
  productThumb: {
    width: 44,
    height: 44,
    objectFit: 'cover',
    borderRadius: 6,
    background: '#f5f5f5',
    flexShrink: 0,
  },
  productName: { fontWeight: 600, color: '#1a1a2e', maxWidth: 200 },
  code: {
    fontFamily: 'monospace',
    background: '#f5f5f5',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 11,
    color: '#555',
  },
  stockBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontWeight: 700,
    fontSize: 12,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 20,
    fontWeight: 600,
    fontSize: 12,
  },
  actions: { display: 'flex', gap: 6 },
  editBtn: {
    padding: '5px 12px',
    background: '#f0f8ff',
    border: '1px solid #d0e8ff',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    color: '#2980b9',
    fontWeight: 600,
  },
  deleteBtn: {
    padding: '5px 12px',
    background: '#fff0f0',
    border: '1px solid #ffd0d0',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: 600,
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
    padding: 20,
  },
  catCard: {
    background: '#f8f9fa',
    borderRadius: 12,
    padding: '24px 16px',
    textAlign: 'center',
    border: '1px solid #eee',
  },
  catCardIcon: { fontSize: 36, marginBottom: 8 },
  catCardName: { fontWeight: 700, color: '#1a1a2e', marginBottom: 4 },
  catCardCount: { fontSize: 12, color: '#888' },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 20,
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 680,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #f0f0f0',
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#1a1a2e' },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
  modalBody: {
    padding: '20px 24px',
    overflowY: 'auto',
    flex: 1,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16,
  },
  field: { marginBottom: 16 },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  imgPreview: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 8,
    marginTop: 8,
    border: '1px solid #eee',
  },
  modalFooter: {
    display: 'flex',
    gap: 12,
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: '#555',
  },
  saveBtn: {
    padding: '10px 24px',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
  },
  confirmModal: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    textAlign: 'center',
    maxWidth: 360,
    width: '100%',
  },
  confirmIcon: { fontSize: 48, marginBottom: 12 },
  confirmTitle: { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' },
  confirmDesc: { color: '#666', fontSize: 14, margin: '0 0 24px' },
  confirmBtns: { display: 'flex', gap: 12 },
  confirmDeleteBtn: {
    flex: 1,
    padding: '10px',
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 14,
  },
};
