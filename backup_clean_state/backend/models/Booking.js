const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');
const User = require('./User');
const Package = require('./Package');

const Booking = sequelize.define('Booking', {
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
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Package,
      key: 'id'
    }
  },
  bookingNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  numberOfPeople: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  travelDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactInfo: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['packageId']
    },
    {
      fields: ['bookingNumber']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    }
  ],
  hooks: {
    beforeCreate: (booking) => {
      // Generate booking number
      if (!booking.bookingNumber) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        booking.bookingNumber = `BK${timestamp}${random}`;
      }
      
      // Calculate final amount
      if (booking.totalAmount && booking.discountAmount) {
        booking.finalAmount = booking.totalAmount - booking.discountAmount;
      } else if (booking.totalAmount) {
        booking.finalAmount = booking.totalAmount;
      }
    }
  }
});

// Associations
Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Package, { foreignKey: 'packageId' });

module.exports = Booking; 