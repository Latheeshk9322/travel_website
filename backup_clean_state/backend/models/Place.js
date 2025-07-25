const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

const Place = sequelize.define('Place', {
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
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
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
  coordinates: {
    type: DataTypes.JSON,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('beach', 'mountain', 'city', 'historical', 'adventure', 'cultural', 'nature'),
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
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
    beforeCreate: (place) => {
      // Set primaryImage to image if not provided
      if (!place.primaryImage && place.image) {
        place.primaryImage = place.image;
      }
      // Set averageRating to rating if not provided
      if (!place.averageRating && place.rating) {
        place.averageRating = place.rating;
      }
    },
    beforeUpdate: (place) => {
      // Set primaryImage to image if not provided
      if (!place.primaryImage && place.image) {
        place.primaryImage = place.image;
      }
      // Set averageRating to rating if not provided
      if (!place.averageRating && place.rating) {
        place.averageRating = place.rating;
      }
    }
  }
});

module.exports = Place; 