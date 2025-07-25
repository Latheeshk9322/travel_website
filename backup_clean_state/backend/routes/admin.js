const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Place = require('../models/Place');
const Package = require('../models/Package');
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get recent users
    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: { exclude: ['password'] }
    });

    // Get recent places
    const recentPlaces = await Place.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get recent packages
    const recentPackages = await Package.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get recent reviews
    const recentReviews = await Review.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get counts
    const userCount = await User.count();
    const placeCount = await Place.count({ where: { isActive: true } });
    const packageCount = await Package.count({ where: { isActive: true } });
    const reviewCount = await Review.count();

    // Get top rated places
    const topPlaces = await Place.findAll({
      where: { isActive: true },
      order: [['rating', 'DESC']],
      limit: 5
    });

    // Get top rated packages
    const topPackages = await Package.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      stats: {
        users: userCount,
        places: placeCount,
        packages: packageCount,
        reviews: reviewCount
      },
      recent: {
        users: recentUsers,
        places: recentPlaces,
        packages: recentPackages,
        reviews: recentReviews
      },
      top: {
        places: topPlaces,
        packages: topPackages
      }
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

// @route   GET /api/admin/packages
// @desc    Get all packages for admin
// @access  Private/Admin
router.get('/packages', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: packages } = await Package.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      packages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ message: 'Server error' });
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