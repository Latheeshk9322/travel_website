const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Review = require('../models/Review');
const Place = require('../models/Place');
const Package = require('../models/Package');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews with filtering
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('placeId').optional().isInt().withMessage('Place ID must be an integer'),
  query('packageId').optional().isInt().withMessage('Package ID must be an integer'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    
    if (req.query.placeId) where.placeId = req.query.placeId;
    if (req.query.packageId) where.packageId = req.query.packageId;
    if (req.query.rating) where.rating = req.query.rating;
    if (req.query.status) where.status = req.query.status;

    // Only show approved reviews to public
    if (!req.user?.role === 'admin') {
      where.status = 'approved';
    }

    // Execute query
    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: require('../models/User'),
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Place,
          attributes: ['id', 'name', 'primaryImage']
        },
        {
          model: Package,
          attributes: ['id', 'name', 'primaryImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
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

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('placeId').optional().isInt().withMessage('Place ID must be an integer'),
  body('packageId').optional().isInt().withMessage('Package ID must be an integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, title, comment, placeId, packageId } = req.body;

    // Validate that either placeId or packageId is provided
    if (!placeId && !packageId) {
      return res.status(400).json({ message: 'Either placeId or packageId is required' });
    }

    // Check if user has already reviewed this place/package
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        ...(placeId && { placeId }),
        ...(packageId && { packageId })
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      placeId,
      packageId,
      rating,
      title,
      comment
    });

    // Update average rating for place/package
    if (placeId) {
      await updatePlaceRating(placeId);
    } else if (packageId) {
      await updatePackageRating(packageId);
    }

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.update(req.body);

    // Update average rating for place/package
    if (review.placeId) {
      await updatePlaceRating(review.placeId);
    } else if (review.packageId) {
      await updatePackageRating(review.packageId);
    }

    res.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.destroy();

    // Update average rating for place/package
    if (review.placeId) {
      await updatePlaceRating(review.placeId);
    } else if (review.packageId) {
      await updatePackageRating(review.packageId);
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions to update average ratings
async function updatePlaceRating(placeId) {
  const reviews = await Review.findAll({
    where: { placeId, status: 'approved' }
  });

  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await Place.update(
      { 
        averageRating: avgRating,
        totalReviews: reviews.length
      },
      { where: { id: placeId } }
    );
  }
}

async function updatePackageRating(packageId) {
  const reviews = await Review.findAll({
    where: { packageId, status: 'approved' }
  });

  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await Package.update(
      { 
        averageRating: avgRating,
        totalReviews: reviews.length
      },
      { where: { id: packageId } }
    );
  }
}

module.exports = router; 