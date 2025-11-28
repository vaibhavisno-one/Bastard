const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getTrendingProducts,
  getBestSellers,
  addReview,
  uploadImages,
  checkPurchase,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { cacheMiddleware } = require('../middleware/cache');

// Cache durations in seconds
const CACHE_5_MIN = 300;
const CACHE_10_MIN = 600;
const CACHE_15_MIN = 900;

router.route('/')
  .get(cacheMiddleware(CACHE_5_MIN), getProducts)
  .post(protect, adminOnly, createProduct);

router.get('/featured', cacheMiddleware(CACHE_15_MIN), getFeaturedProducts);
router.get('/new-arrivals', cacheMiddleware(CACHE_15_MIN), getNewArrivals);
router.get('/trending', cacheMiddleware(CACHE_15_MIN), getTrendingProducts);
router.get('/best-sellers', cacheMiddleware(CACHE_15_MIN), getBestSellers);

router.post('/upload', protect, adminOnly, upload.array('images', 4), uploadImages);

router.route('/:id')
  .get(cacheMiddleware(CACHE_10_MIN), getProduct)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

// Check if user purchased product (must be before /:id/reviews to avoid route conflict)
router.get('/:id/check-purchase', protect, checkPurchase);

// Add review (only for verified buyers)
router.post('/:id/reviews', protect, addReview);

module.exports = router;