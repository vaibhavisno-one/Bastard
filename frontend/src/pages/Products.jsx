import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/client';
import './Products.scss';

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

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Our Products</h1>

        <div className="products-layout">
          <aside className="filters">
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="T-Shirt">T-Shirts</option>
                <option value="Hoodie">Hoodies</option>
                <option value="Hoodie">Men</option>
                <option value="Hoodie">Women</option>
                <option value="Hoodie">Unisex</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Size</label>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <option value="">All Sizes</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          </aside>

          <div className="products-content">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>No products found</p>
              </div>
            ) : (
              <div className="product-grid">
                {products.map(product => (
                  <Link
                    to={`/products/${product._id}`}
                    key={product._id}
                    className="product-card"
                  >
                    <div className="product-image">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className="image-placeholder">{product.name[0]}</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;