import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/mockData';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 60000000]);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') ? Number(searchParams.get('category')) : 0;
  const statusFilter = searchParams.get('status') || 'all';

  const filtered = useMemo(() => {
    let list = [...products];

    if (searchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (categoryFilter) {
      list = list.filter(p => p.category_id === categoryFilter);
    }
    if (statusFilter === 'active') {
      list = list.filter(p => p.status === 'active' && p.stock > 0);
    } else if (statusFilter === 'inactive') {
      list = list.filter(p => p.status === 'inactive' || p.stock === 0);
    }

    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [searchQuery, categoryFilter, statusFilter, priceRange, sortBy]);

  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tất cả sản phẩm'}
          </h1>
          <p style={styles.count}>{filtered.length} sản phẩm</p>
        </div>

        <div style={styles.layout}>
          {/* Sidebar Filters */}
          <aside style={styles.sidebar}>
            <div style={styles.filterBox}>
              <h3 style={styles.filterTitle}>Danh mục</h3>
              <button
                style={{ ...styles.filterBtn, ...(categoryFilter === 0 ? styles.filterBtnActive : {}) }}
                onClick={() => updateParam('category', '')}
              >Tất cả</button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  style={{ ...styles.filterBtn, ...(categoryFilter === cat.id ? styles.filterBtnActive : {}) }}
                  onClick={() => updateParam('category', cat.id)}
                >{cat.name}</button>
              ))}
            </div>

            <div style={styles.filterBox}>
              <h3 style={styles.filterTitle}>Khoảng giá</h3>
              <div style={styles.priceRange}>
                <div style={styles.priceLabels}>
                  <span>{fmt(priceRange[0])}</span>
                  <span>{fmt(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60000000}
                  step={500000}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  style={styles.slider}
                />
              </div>
              <div style={styles.pricePresets}>
                {[
                  { label: 'Dưới 5 triệu', range: [0, 5000000] },
                  { label: '5 - 15 triệu', range: [5000000, 15000000] },
                  { label: '15 - 30 triệu', range: [15000000, 30000000] },
                  { label: 'Trên 30 triệu', range: [30000000, 60000000] },
                ].map(p => (
                  <button
                    key={p.label}
                    style={styles.presetBtn}
                    onClick={() => setPriceRange(p.range)}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div style={styles.filterBox}>
              <h3 style={styles.filterTitle}>Trạng thái</h3>
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'active', label: 'Còn hàng' },
                { value: 'inactive', label: 'Hết hàng' },
              ].map(s => (
                <button
                  key={s.value}
                  style={{ ...styles.filterBtn, ...(statusFilter === s.value ? styles.filterBtnActive : {}) }}
                  onClick={() => updateParam('status', s.value === 'all' ? '' : s.value)}
                >{s.label}</button>
              ))}
            </div>

            <button
              style={styles.resetBtn}
              onClick={() => { setSearchParams({}); setPriceRange([0, 60000000]); setSortBy('default'); }}
            >Xóa bộ lọc</button>
          </aside>

          {/* Products */}
          <main style={styles.main}>
            {/* Sort */}
            <div style={styles.sortBar}>
              <span style={styles.sortLabel}>Sắp xếp:</span>
              {[
                { value: 'default', label: 'Mặc định' },
                { value: 'price-asc', label: 'Giá tăng dần' },
                { value: 'price-desc', label: 'Giá giảm dần' },
                { value: 'name', label: 'Tên A-Z' },
              ].map(s => (
                <button
                  key={s.value}
                  style={{ ...styles.sortBtn, ...(sortBy === s.value ? styles.sortBtnActive : {}) }}
                  onClick={() => setSortBy(s.value)}
                >{s.label}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>🔍</div>
                <p>Không tìm thấy sản phẩm phù hợp</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f8f9fa', minHeight: '100vh', paddingBottom: 60 },
  container: { maxWidth: 1280, margin: '0 auto', padding: '24px 20px' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' },
  count: { color: '#888', margin: 0, fontSize: 14 },
  layout: { display: 'flex', gap: 24 },
  sidebar: { width: 240, flexShrink: 0 },
  filterBox: {
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  filterTitle: { fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '0 0 12px' },
  filterBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '8px 12px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  filterBtnActive: {
    background: '#fff0f3',
    border: '1px solid #e94560',
    color: '#e94560',
    fontWeight: 600,
  },
  priceRange: { marginBottom: 12 },
  priceLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  slider: { width: '100%', accentColor: '#e94560' },
  pricePresets: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  presetBtn: {
    padding: '4px 8px',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: 4,
    fontSize: 11,
    cursor: 'pointer',
    color: '#555',
  },
  resetBtn: {
    width: '100%',
    padding: '10px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  main: { flex: 1 },
  sortBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    padding: '12px 16px',
    borderRadius: 10,
    marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  sortLabel: { fontSize: 13, color: '#888', marginRight: 4 },
  sortBtn: {
    padding: '6px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: 6,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 13,
    color: '#555',
  },
  sortBtnActive: {
    background: '#e94560',
    border: '1px solid #e94560',
    color: '#fff',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  empty: {
    textAlign: 'center',
    padding: 80,
    color: '#999',
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
};
