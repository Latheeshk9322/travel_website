const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currentPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  pricing: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      perPerson: true,
      includes: [],
      excludes: []
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  destinations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('adventure', 'cultural', 'beach', 'city', 'nature', 'luxury'),
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (pkg) => {
      // Set primaryImage to image if not provided
      if (!pkg.primaryImage && pkg.image) {
        pkg.primaryImage = pkg.image;
      }
      // Set currentPrice to price if not provided
      if (!pkg.currentPrice && pkg.price) {
        pkg.currentPrice = pkg.price;
      }
      // Set originalPrice to price if not provided
      if (!pkg.originalPrice && pkg.price) {
        pkg.originalPrice = pkg.price;
      }
      // Set averageRating to rating if not provided
      if (!pkg.averageRating && pkg.rating) {
        pkg.averageRating = pkg.rating;
      }
    },
    beforeUpdate: (pkg) => {
      // Set primaryImage to image if not provided
      if (!pkg.primaryImage && pkg.image) {
        pkg.primaryImage = pkg.image;
      }
      // Set currentPrice to price if not provided
      if (!pkg.currentPrice && pkg.price) {
        pkg.currentPrice = pkg.price;
      }
      // Set originalPrice to price if not provided
      if (!pkg.originalPrice && pkg.price) {
        pkg.originalPrice = pkg.price;
      }
      // Set averageRating to rating if not provided
      if (!pkg.averageRating && pkg.rating) {
        pkg.averageRating = pkg.rating;
      }
    }
  }
});

module.exports = Package; 