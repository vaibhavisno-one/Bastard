const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  sku: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  images: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['T-Shirt', 'Hoodie'],
  },
  sizes: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  }],
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug and SKU from name
productSchema.pre('save', async function (next) {
  // Generate slug if name is modified or slug doesn't exist
  if (this.isModified('name') || !this.slug) {
    // Create base slug from name
    let baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen

    let slug = baseSlug;
    let counter = 1;

    // Check for uniqueness and add numeric suffix if needed
    while (true) {
      const existingProduct = await mongoose.model('Product').findOne({
        slug,
        _id: { $ne: this._id } // Exclude current document
      });

      if (!existingProduct) {
        break;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    this.slug = slug;
  }

  // Generate SKU if it doesn't exist
  if (!this.sku) {
    // Create SKU format: CATEGORY-RANDOM (e.g., TSH-A1B2C3, HOO-D4E5F6)
    const categoryPrefix = this.category === 'T-Shirt' ? 'TSH' : 'HOO';

    let sku;
    let isUnique = false;

    // Keep generating until we find a unique SKU
    while (!isUnique) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      sku = `${categoryPrefix}-${randomPart}`;

      const existingProduct = await mongoose.model('Product').findOne({
        sku,
        _id: { $ne: this._id }
      });

      if (!existingProduct) {
        isUnique = true;
      }
    }

    this.sku = sku;
  }

  next();
});

// Virtual for total stock
productSchema.virtual('totalStock').get(function () {
  return this.sizes.reduce((total, item) => total + item.stock, 0);
});

module.exports = mongoose.model('Product', productSchema);