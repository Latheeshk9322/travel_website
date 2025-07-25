const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');
const User = require('./User');
const Place = require('./Place');
const Package = require('./Package');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Place,
      key: 'id'
    }
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Package,
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 1000]
    }
  },
  helpful: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['placeId']
    },
    {
      fields: ['packageId']
    },
    {
      fields: ['status']
    }
  ]
});

// Associations
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Place, { foreignKey: 'placeId' });
Review.belongsTo(Package, { foreignKey: 'packageId' });

module.exports = Review; 