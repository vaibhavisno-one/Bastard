import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../api/client';
import Loading from '../components/Loading';
import {
  FiArrowRight,
  FiMapPin,
  FiPlusSquare,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';
import './Home.scss';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products/featured');
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="home-bastard">

      {/* SECTION A: HERO (Edgy + Premium) */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-split">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">
                DESIGNER.<br />
                OVERSIZED <span className="highlight">FITS.</span>
              </h1>
              <p className="hero-subtitle">
                The ultimate collection of designer hoodies and oversized tees.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary">
                  Start Browsing
                </Link>
                <Link to="/profile" className="btn btn-outline">
                  <FiPlusSquare /> JOIN TO BE THE PART
                </Link>
              </div>
            </motion.div>

            <div className="hero-collage">
              {/* Abstract 'Street' Composition */}
              <motion.div
                className="collage-item item-1"
                initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: -12 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="item-inner"></div>
                <div className="item-tag">OVERSIZED</div>
              </motion.div>
              <motion.div
                className="collage-item item-2"
                initial={{ opacity: 0, scale: 0.8, y: -100 }}
                animate={{ opacity: 1, scale: 1, y: -70 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="item-inner"></div>
                <div className="item-tag">HOODIES</div>
              </motion.div>
              <motion.div
                className="collage-item item-3"
                initial={{ opacity: 0, scale: 0.8, rotate: 20 }}
                animate={{ opacity: 1, scale: 1, rotate: 18 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="item-inner"></div>
                <div className="item-tag">DESIGNER</div>
              </motion.div>
              <div className="collage-bg-graphic"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: MARKETPLACE PREVIEW (Realism + Fresh Drops) */}
      <motion.section
        className="marketplace-preview-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="section-header split">
            <h2 className="section-title">OUR DROPS</h2>
            <Link to="/products" className="link-arrow">
              See All Fits <FiArrowRight />
            </Link>
          </div>

          <motion.div className="products-grid" variants={staggerContainer}>
            {featuredProducts.slice(0, 4).map(product => (
              <motion.div key={product._id} variants={fadeInUp}>
                <Link to={`/products/${product._id}`} className="raw-product-card">
                  <div className="card-image">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} loading="lazy" />
                    ) : (
                      <div className="placeholder">{product.name[0]}</div>
                    )}
                  </div>
                  <div className="card-details">
                    <h3>{product.name}</h3>
                    <div className="card-meta">
                      {/* <span className="value-est">₹{product.price.toLocaleString('en-IN')}</span> */}
                      <span className="user-handle text-muted"></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION D: WHY BASTARD? (Value Props) */}
      <motion.section
        className="value-props-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container">
          <div className="value-grid">
            <motion.div className="value-card" variants={fadeInUp}>
              <h3>Premium Cotton.</h3>
              <p>Heavyweight fabric, perfect drape.</p>
            </motion.div>
            <motion.div className="value-card" variants={fadeInUp}>
              <h3>Oversized Perfection.</h3>
              <p>Drop shoulders & boxy cuts.</p>
            </motion.div>
            <motion.div className="value-card" variants={fadeInUp}>
              <h3>Limited Editions.</h3>
              <p>Cop it before it's gone.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECTION E: USER STORIES (Polaroid Style) */}
      <motion.section
        className="user-stories-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">STREET TALK</h2>
          </div>

          <div className="stories-grid">
            <div className="polaroid-card rotate-left">
              <div className="polaroid-image">
                <div className="avatar-placeholder bg-blue">PG</div>
              </div>
              <div className="polaroid-caption">
                <p>"Best oversized tee I've ever owned. The fabric weight is insane."</p>
                <span>- Pedri G.</span>
              </div>
            </div>

            <div className="polaroid-card rotate-right">
              <div className="polaroid-image">
                <div className="avatar-placeholder bg-red">MZ</div>
              </div>
              <div className="polaroid-caption">
                <p>"The hoodie fit is perfect. Boxy but not sloppy. Definitely copping more."</p>
                <span>- Mark Z.</span>
              </div>
            </div>

            <div className="polaroid-card rotate-left-sm">
              <div className="polaroid-image">
                <div className="avatar-placeholder bg-yellow">TD</div>
              </div>
              <div className="polaroid-caption">
                <p>"Designs are actually unique. Not that generic mall trash."</p>
                <span>- Tyler D.</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION F: FINAL CTA (Bold) */}
      <motion.section
        className="final-cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="cta-content">
            <h2 className="giant-text">
              START SHOPPING<br />
              LIKE A <span className="outline-text">BASTARD.</span>
            </h2>
            <Link to="/products" className="btn btn-primary large">
              Start Browsing
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default Home;