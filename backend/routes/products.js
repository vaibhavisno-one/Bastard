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
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/trending', getTrendingProducts);
router.get('/best-sellers', getBestSellers);

router.post('/upload', protect, adminOnly, upload.array('images', 4), uploadImages);

router.route('/:id')
  .get(getProduct)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.post('/:id/reviews', protect, addReview);

module.exports = router;