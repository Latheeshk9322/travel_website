const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Package = require('../models/Package');
const Place = require('../models/Place');
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

// @route   GET /api/packages
// @desc    Get all packages with filtering and pagination
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().isString(),
  query('featured').optional().isBoolean(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['name', 'price', 'duration', 'createdAt']),
  query('sortBy').optional().isIn(['name', 'price', 'duration', 'createdAt', 'rating']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('category').optional().isIn(['adventure', 'cultural', 'beach', 'city', 'nature', 'luxury']),
  query('duration').optional().isString(),
  query('placeId').optional().isInt().withMessage('Place ID must be an integer'),
], async (req, res) => {
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
    
    if (req.query.featured) where.featured = req.query.featured === 'true';
    if (req.query.category) where.category = req.query.category;
    // Now supports filtering by place ID as destinations can contain place IDs
    if (req.query.placeId) {
      const placeId = parseInt(req.query.placeId);
      if (!isNaN(placeId)) {
        where.placeId = placeId; // Direct filtering by associated place
      }
    }

    // Build search query
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    // Add duration filter to database query
    if (req.query.duration) {
      switch (req.query.duration) {
        case '1-3':
          where.duration = { [Op.between]: [1, 3] };
          break;
        case '4-7':
          where.duration = { [Op.between]: [4, 7] };
          break;
        case '8-14':
          where.duration = { [Op.between]: [8, 14] };
          break;
        case '15+':
          where.duration = { [Op.gte]: 15 };
          break;
      }
    }

    // Add price filters to database query
    if (req.query.minPrice) {
      where.currentPrice = { [Op.gte]: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      if (where.currentPrice) {
        where.currentPrice = { ...where.currentPrice, [Op.lte]: parseFloat(req.query.maxPrice) };
      } else {
        where.currentPrice = { [Op.lte]: parseFloat(req.query.maxPrice) };
      }
    }

    // Build order clause
    let order = [['createdAt', 'DESC']];
    
    // Handle new sortBy and sortOrder parameters
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder || 'asc';
      const validSortFields = ['name', 'price', 'duration', 'createdAt', 'rating', 'averageRating'];
      const validSortOrders = ['asc', 'desc'];
      
      if (validSortFields.includes(req.query.sortBy) && validSortOrders.includes(sortOrder)) {
        // Map 'price' to 'currentPrice' for sorting
        const sortField = req.query.sortBy === 'price' ? 'currentPrice' : req.query.sortBy;
        order = [[sortField, sortOrder.toUpperCase()]];
      }
    } else if (req.query.sort) {
      // Fallback to old sort parameter
      switch (req.query.sort) {
        case 'name':
          order = [['name', 'ASC']];
          break;
        case 'price':
          order = [['currentPrice', 'ASC']];
          break;
        case 'duration':
          order = [['duration', 'ASC']];
          break;
        default:
          order = [['createdAt', 'DESC']];
      }
    }

    // Execute query
    const { count, rows: packages } = await Package.findAndCountAll({
      where,
      order,
      limit,
      offset
    });

    // No post-query filtering needed since all filters are applied at database level
    const filteredPackages = packages;

    // Transform packages to match frontend expectations with location-based pricing
    const transformedPackages = filteredPackages.map(pkg => {
      const pkgData = pkg.toJSON();
      const userLocation = req.user?.location || req.query.location || 'default';
      const locationBasedPrice = calculateLocationBasedPrice(pkg, userLocation);
      
      return {
        ...pkgData,
        destinations: pkgData.destinations || [],
        currentPrice: locationBasedPrice,
        originalPrice: Math.round(pkgData.originalPrice * (locationBasedPrice / pkgData.currentPrice)),
        locationBasedPricing: pkgData.locationBasedPricing,
        userLocation: userLocation
      };
    });

    res.json({
      packages: transformedPackages,
      total: count,
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

// @route   GET /api/packages/featured
// @desc    Get featured packages
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredPackages = await Package.findAll({
      where: { featured: true, isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    // Transform packages to match frontend expectations with location-based pricing
    const transformedPackages = featuredPackages.map(pkg => {
      const pkgData = pkg.toJSON();
      const userLocation = req.query.location || 'default';
      const locationBasedPrice = calculateLocationBasedPrice(pkg, userLocation);
      
      return {
        ...pkgData,
        destinations: pkgData.destinations || [],
        currentPrice: locationBasedPrice,
        originalPrice: Math.round(pkgData.originalPrice * (locationBasedPrice / pkgData.currentPrice)),
        locationBasedPricing: pkgData.locationBasedPricing,
        userLocation: userLocation
      };
    });

    res.json({ packages: transformedPackages });
  } catch (error) {
    console.error('Get featured packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/packages/:id
// @desc    Get single package by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Apply location-based pricing
    const userLocation = req.user?.location || req.query.location || 'default';
    const locationBasedPrice = calculateLocationBasedPrice(package, userLocation);
    
    const packageData = package.toJSON();
    const transformedPackage = {
      ...packageData,
      currentPrice: locationBasedPrice,
      originalPrice: Math.round(packageData.originalPrice * (locationBasedPrice / packageData.currentPrice)),
      locationBasedPricing: packageData.locationBasedPricing,
      userLocation: userLocation
    };

    res.json(transformedPackage);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/packages
// @desc    Create a new package
// @access  Private/Admin
router.post('/', protect, admin, uploadMultiple, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('destination').notEmpty().withMessage('Destination is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const packageData = req.body;
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      packageData.image = `/uploads/${req.files[0].filename}`;
      packageData.features = req.files.map(file => `/uploads/${file.filename}`);
    }

    const package = await Package.create(packageData);

    res.status(201).json(package);
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/packages/:id
// @desc    Update a package
// @access  Private/Admin
router.put('/:id', protect, admin, uploadMultiple, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be positive')
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

    const updateData = req.body;
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      updateData.image = `/uploads/${req.files[0].filename}`;
      updateData.features = req.files.map(file => `/uploads/${file.filename}`);
    }

    await package.update(updateData);

    res.json(package);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/packages/:id
// @desc    Delete a package
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const package = await Package.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await package.destroy();

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 