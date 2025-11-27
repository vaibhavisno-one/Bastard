import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/client';
import './Products.scss';
import Loading from '../components/Loading';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update filters when URL params change (e.g., clicking from home page)
  useEffect(() => {
    const newFilters = {
      category: searchParams.get('category') || '',
      size: searchParams.get('size') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '',
    };
    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.size) params.size = filters.size;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await API.get('/products', { params });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newParams = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) newParams[k] = newFilters[k];
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      size: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
    });
    setSearchParams({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header-actions">
          <h1 className="page-title">
            {filters.category ? `${filters.category}s` : 'All Products'}
          </h1>

          <div className="header-controls">
            <button
              className="filter-toggle-btn"
              onClick={() => setIsFilterOpen(true)}
            >
              <span className="icon">⚡</span> Filters
              {getActiveFilterCount() > 0 && (
                <span className="badge">{getActiveFilterCount()}</span>
              )}
            </button>

            <div className="sort-dropdown">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="">Sort by: Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Drawer Overlay */}
        <div className={`filter-overlay ${isFilterOpen ? 'open' : ''}`} onClick={() => setIsFilterOpen(false)}></div>

        {/* Filter Drawer */}
        <aside className={`filter-drawer ${isFilterOpen ? 'open' : ''}`}>
          <div className="drawer-header">
            <h3>Filter Products</h3>
            <button className="close-btn" onClick={() => setIsFilterOpen(false)}>×</button>
          </div>

          <div className="drawer-content">
            <div className="filter-group">
              <label>Category</label>
              <div className="category-pills">
                {['T-Shirt', 'Hoodie', 'Jacket', 'Accessories'].map(cat => (
                  <button
                    key={cat}
                    className={`pill ${filters.category === cat ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Size</label>
              <div className="size-grid">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    className={`size-box ${filters.size === size ? 'active' : ''}`}
                    onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span className="separator">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="drawer-footer">
            <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            <button className="apply-btn" onClick={() => setIsFilterOpen(false)}>Show Results</button>
          </div>
        </aside>

        <div className="products-grid-container">
          {products.length === 0 ? (
            <div className="no-products">
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={clearFilters} className="reset-btn">
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <p className="results-count">Showing {products.length} results</p>
              <div className="product-grid">
                {products.map(product => (
                  <Link
                    to={`/products/${product._id}`}
                    key={product._id}
                    className="product-card"
                  >
                    <div className="card-image">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} loading="lazy" />
                      ) : (
                        <div className="placeholder">{product.name[0]}</div>
                      )}
                      {product.rating > 0 && (
                        <div className="rating-tag">
                          ★ {product.rating.toFixed(1)}
                        </div>
                      )}
                      <div className="card-overlay">
                        <span>View Details</span>
                      </div>
                    </div>
                    <div className="card-details">
                      <div className="card-header">
                        <h3>{product.name}</h3>
                        <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="category">{product.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;