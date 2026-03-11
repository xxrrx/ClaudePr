import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { products, categories } from '../../data/mockData';
import './Products.css';

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
    <div className="products-page">
      <div className="products-container">
        {/* Header */}
        <div className="products-header">
          <h1 className="products-title">
            {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tất cả sản phẩm'}
          </h1>
          <p className="products-count">{filtered.length} sản phẩm</p>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="products-sidebar">
            <div className="products-filter-box">
              <h3 className="products-filter-title">Danh mục</h3>
              <button
                className={`products-filter-btn${categoryFilter === 0 ? ' active' : ''}`}
                onClick={() => updateParam('category', '')}
              >Tất cả</button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`products-filter-btn${categoryFilter === cat.id ? ' active' : ''}`}
                  onClick={() => updateParam('category', cat.id)}
                >{cat.name}</button>
              ))}
            </div>

            <div className="products-filter-box">
              <h3 className="products-filter-title">Khoảng giá</h3>
              <div className="products-price-range">
                <div className="products-price-labels">
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
                  className="products-slider"
                />
              </div>
              <div className="products-price-presets">
                {[
                  { label: 'Dưới 5 triệu', range: [0, 5000000] },
                  { label: '5 - 15 triệu', range: [5000000, 15000000] },
                  { label: '15 - 30 triệu', range: [15000000, 30000000] },
                  { label: 'Trên 30 triệu', range: [30000000, 60000000] },
                ].map(p => (
                  <button
                    key={p.label}
                    className="products-preset-btn"
                    onClick={() => setPriceRange(p.range)}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div className="products-filter-box">
              <h3 className="products-filter-title">Trạng thái</h3>
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'active', label: 'Còn hàng' },
                { value: 'inactive', label: 'Hết hàng' },
              ].map(s => (
                <button
                  key={s.value}
                  className={`products-filter-btn${statusFilter === s.value ? ' active' : ''}`}
                  onClick={() => updateParam('status', s.value === 'all' ? '' : s.value)}
                >{s.label}</button>
              ))}
            </div>

            <button
              className="products-reset-btn"
              onClick={() => { setSearchParams({}); setPriceRange([0, 60000000]); setSortBy('default'); }}
            >Xóa bộ lọc</button>
          </aside>

          {/* Products */}
          <main className="products-main">
            {/* Sort */}
            <div className="products-sort-bar">
              <span className="products-sort-label">Sắp xếp:</span>
              {[
                { value: 'default', label: 'Mặc định' },
                { value: 'price-asc', label: 'Giá tăng dần' },
                { value: 'price-desc', label: 'Giá giảm dần' },
                { value: 'name', label: 'Tên A-Z' },
              ].map(s => (
                <button
                  key={s.value}
                  className={`products-sort-btn${sortBy === s.value ? ' active' : ''}`}
                  onClick={() => setSortBy(s.value)}
                >{s.label}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="products-empty">
                <div className="products-empty-icon">🔍</div>
                <p>Không tìm thấy sản phẩm phù hợp</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
