const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Place = require('../models/Place');
const Package = require('../models/Package');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const { Op } = require('sequelize');

const router = express.Router();

// Helper function to calculate location-based pricing
const calculateLocationBasedPrice = (package, userLocation = 'default') => {
  if (!package.locationBasedPricing) {
    return package.currentPrice;
  }
  
  const multiplier = package.locationBasedPricing[userLocation] || package.locationBasedPricing.default || 1.0;
  return Math.round(package.currentPrice * multiplier);
};

// @route   GET /api/places
// @desc    Get all places with filtering and pagination
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['beach', 'mountain', 'city', 'historical', 'adventure', 'cultural']),
  query('country').optional().isString(),
  query('city').optional().isString(),
  query('search').optional().isString(),
  query('featured').optional().isBoolean(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('sortBy').optional().isIn(['name', 'rating', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
],
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = { isActive: true };
    
    if (req.query.category) where.category = req.query.category;
    if (req.query.country) where.country = { [Op.iLike]: `%${req.query.country}%` };
    if (req.query.city) where.city = { [Op.iLike]: `%${req.query.city}%` };
    if (req.query.featured) where.featured = req.query.featured === 'true';
    if (req.query.minRating) where.rating = { [Op.gte]: parseFloat(req.query.minRating) };

    // Build search query
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    // Build order clause
    let order = [['createdAt', 'DESC']];
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
      switch (req.query.sortBy) {
        case 'name':
          order = [['name', sortOrder]];
          break;
        case 'rating':
          order = [['rating', sortOrder]];
          break;
        default:
          order = [['createdAt', sortOrder]];
      }
    }

    // Execute query
    const { count, rows: places } = await Place.findAndCountAll({
      where,
      order,
      limit,
      offset
    });

    // Transform places to match frontend expectations
    const transformedPlaces = places.map(place => {
      const placeData = place.toJSON();
      return {
        ...placeData,
        location: {
          city: placeData.city,
          country: placeData.country
        }
      };
    });

    res.json({
      places: transformedPlaces,
      total: count,
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

// @route   GET /api/places/featured
// @desc    Get featured places
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredPlaces = await Place.findAll({
      where: { featured: true, isActive: true },
      order: [['rating', 'DESC']],
      limit: 6
    });

    // Transform places to match frontend expectations
    const transformedPlaces = featuredPlaces.map(place => {
      const placeData = place.toJSON();
      return {
        ...placeData,
        location: {
          city: placeData.city,
          country: placeData.country
        }
      };
    });

    res.json({ places: transformedPlaces });
  } catch (error) {
    console.error('Get featured places error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/places/:id
// @desc    Get single place by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error('Get place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/places/:id/packages
// @desc    Get packages for a specific place
// @access  Public
router.get('/:id/packages', optionalAuth, async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Get packages for this place
    const packages = await Package.findAll({
      where: { 
        placeId: req.params.id,
        isActive: true 
      },
      order: [['rating', 'DESC']],
      limit: 10
    });

    // Apply location-based pricing
    const userLocation = req.user?.location || req.query.location || 'default';
    const transformedPackages = packages.map(pkg => {
      const pkgData = pkg.toJSON();
      const locationBasedPrice = calculateLocationBasedPrice(pkg, userLocation);
      
      return {
        ...pkgData,
        currentPrice: locationBasedPrice,
        originalPrice: Math.round(pkgData.originalPrice * (locationBasedPrice / pkgData.currentPrice)),
        locationBasedPricing: pkgData.locationBasedPricing,
        userLocation: userLocation
      };
    });

    res.json({
      place: place,
      packages: transformedPackages,
      total: transformedPackages.length
    });
  } catch (error) {
    console.error('Get place packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/places
// @desc    Create a new place
// @access  Private/Admin
router.post('/', protect, admin, uploadMultiple, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category').isIn(['beach', 'mountain', 'city', 'historical', 'adventure', 'cultural']),
  body('location').notEmpty().withMessage('Location is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('city').notEmpty().withMessage('City is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const placeData = req.body;
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      placeData.image = `/uploads/${req.files[0].filename}`;
      placeData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const place = await Place.create(placeData);

    res.status(201).json(place);
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/places/:id
// @desc    Update a place
// @access  Private/Admin
router.put('/:id', protect, admin, uploadMultiple, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category').optional().isIn(['beach', 'mountain', 'city', 'historical', 'adventure', 'cultural'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const place = await Place.findByPk(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const updateData = req.body;
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      updateData.image = `/uploads/${req.files[0].filename}`;
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    await place.update(updateData);

    res.json(place);
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/places/:id
// @desc    Delete a place
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    await place.destroy();

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 