import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/client';
import Loading from '../components/Loading';
import './Home.scss'; // Reusing Home styles for grid

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const res = await API.get('/products/new-arrivals');
                setProducts(res.data.products);
            } catch (error) {
                console.error('Error fetching new arrivals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, []);

    if (loading) return <Loading fullScreen />;

    return (
        <div className="home">
            <div className="featured-grid">
                <div className="container">
                    <div className="section-header">
                        <h2>NEW ARRIVALS</h2>
                        <p style={{ marginTop: '1rem', color: '#666' }}>Check out the latest additions to our collection.</p>
                    </div>

                    {products.length === 0 ? (
                        <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '4rem' }}>No new arrivals at the moment.</p>
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
                                            <img src={product.images[0]} alt={product.name} loading="lazy" />
                                        ) : (
                                            <div className="image-placeholder">{product.name[0]}</div>
                                        )}
                                        {product.rating > 0 && (
                                            <div className="rating-badge">
                                                ★ {product.rating.toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="category">{product.category}</p>
                                        <div className="price-row">
                                            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewArrivals;
