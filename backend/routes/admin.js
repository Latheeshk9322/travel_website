const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const User = require('../models/User');
const Place = require('../models/Place');
const Package = require('../models/Package');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Ensure uploads/packages directory exists
const packagesDir = path.join(__dirname, '../uploads/packages');
if (!fs.existsSync(packagesDir)) {
  fs.mkdirSync(packagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, packagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts
    const userCount = await User.count();
    const placeCount = await Place.count({ where: { isActive: true } });
    const packageCount = await Package.count({ where: { isActive: true } });
    const reviewCount = await Review.count();
    const bookingCount = await Booking.count();
    
    // Calculate total revenue
    const totalRevenue = await Booking.sum('finalAmount', {
      where: { paymentStatus: 'paid' }
    });

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Package,
          attributes: ['id', 'name', 'primaryImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalPlaces: placeCount,
        totalPackages: packageCount,
        totalReviews: reviewCount,
        totalBookings: bookingCount,
        totalRevenue: totalRevenue || 0
      },
      recentBookings
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews for moderation
// @access  Private/Admin
router.get('/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve a review
// @access  Private/Admin
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ isApproved: true });

    res.json({
      success: true,
      message: 'Review approved successfully',
      review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reviews/:id/reject
// @desc    Reject a review
// @access  Private/Admin
router.put('/reviews/:id/reject', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ isApproved: false });

    res.json({
      success: true,
      message: 'Review rejected successfully',
      review
    });
  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/places
// @desc    Get all places for admin
// @access  Private/Admin
router.get('/places', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: places } = await Place.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      places,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/places
// @desc    Create a new place
// @access  Private/Admin
router.post('/places', [
  body('name').notEmpty().withMessage('Place name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['beach', 'mountain', 'city', 'historical', 'adventure', 'cultural', 'nature']).withMessage('Invalid category'),
  body('location').notEmpty().withMessage('Location is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  body('featured').isBoolean().withMessage('featured must be a boolean'),
  body('primaryImage').optional().isString(),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const place = await Place.create(req.body);
    res.status(201).json({ success: true, place });
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/packages
// @desc    Create a new package
// @access  Private/Admin
router.post('/packages', [
  body('name').notEmpty().withMessage('Package name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['adventure', 'cultural', 'beach', 'city', 'nature', 'luxury']).withMessage('Invalid category'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('currentPrice').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('destinations').isArray().withMessage('Destinations must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const package = await Package.create(req.body);

    res.status(201).json({
      success: true,
      package
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/packages/:id
// @desc    Update a package
// @access  Private/Admin
router.put('/packages/:id', [
  body('name').notEmpty().withMessage('Package name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['adventure', 'cultural', 'beach', 'city', 'nature', 'luxury']).withMessage('Invalid category'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('currentPrice').isFloat({ min: 0 }).withMessage('Price must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const package = await Package.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await package.update(req.body);

    res.json({
      success: true,
      package
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/packages/:id
// @desc    Delete a package
// @access  Private/Admin
router.delete('/packages/:id', async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await package.destroy();

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/packages/:id/feature
// @desc    Toggle package featured status
// @access  Private/Admin
router.post('/packages/:id/feature', async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await package.update({ isFeatured: !package.isFeatured });

    res.json({
      success: true,
      message: `Package ${package.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      package
    });
  } catch (error) {
    console.error('Toggle package feature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/packages
// @desc    Get all packages for admin management
// @access  Private/Admin
router.get('/packages', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }
    
    if (category) {
      whereClause.category = category;
    }

    const { count, rows: packages } = await Package.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      packages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get admin packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/packages/upload-image
// @desc    Upload package image
// @access  Private/Admin
router.options('/packages/upload-image', cors());

// Test endpoint for connectivity (no auth required)
router.get('/packages/upload-image/test', (req, res) => {
  res.json({ success: true, message: 'Upload endpoint is reachable.' });
});

router.post('/packages/upload-image', cors(), (req, res, next) => {
  // Ensure directory exists before handling upload
  const packagesDir = path.join(__dirname, '../uploads/packages');
  try {
    if (!fs.existsSync(packagesDir)) {
      fs.mkdirSync(packagesDir, { recursive: true });
      console.log('Created uploads/packages directory');
    }
  } catch (dirErr) {
    console.error('Failed to create uploads/packages directory:', dirErr);
    return res.status(500).json({ message: 'Failed to create upload directory', error: dirErr.message });
  }
  next();
}, upload.single('image'), (req, res) => {
  try {
    console.log('Upload request headers:', req.headers);
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Uploaded file:', req.file);
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/packages/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ message: 'Failed to upload image', error: err.message });
  }
});

// @route   PUT /api/admin/places/:id/toggle
// @desc    Toggle place active status
// @access  Private/Admin
router.put('/places/:id/toggle', async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    await place.update({ isActive: !place.isActive });

    res.json({
      success: true,
      message: `Place ${place.isActive ? 'activated' : 'deactivated'} successfully`,
      place
    });
  } catch (error) {
    console.error('Toggle place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/packages/:id/toggle
// @desc    Toggle package active status
// @access  Private/Admin
router.put('/packages/:id/toggle', async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await package.update({ isActive: !package.isActive });

    res.json({
      success: true,
      message: `Package ${package.isActive ? 'activated' : 'deactivated'} successfully`,
      package
    });
  } catch (error) {
    console.error('Toggle package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 