const fs = require('fs');
const { sequelize } = require('./backend/server');
const Place = require('./backend/models/Place');
const Package = require('./backend/models/Package');
const User = require('./backend/models/User');
const Review = require('./backend/models/Review');

const exportData = async (collectionName) => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    let data;
    let fileName;

    switch (collectionName) {
      case 'places':
        data = await Place.findAll();
        fileName = 'places.json';
        break;
      case 'packages':
        data = await Package.findAll();
        fileName = 'packages.json';
        break;
      case 'users':
        data = await User.findAll({
          attributes: { exclude: ['password'] }
        });
        fileName = 'users.json';
        break;
      case 'reviews':
        data = await Review.findAll();
        fileName = 'reviews.json';
        break;
      default:
        throw new Error('Invalid collection name');
    }

    // Convert to JSON and save
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(fileName, jsonData);
    console.log(`Data exported to ${fileName}`);

    await sequelize.close();
  } catch (error) {
    console.error('Export error:', error);
    process.exit(1);
  }
};

const collectionName = process.argv[2];
if (!collectionName) {
  console.error('Please provide a collection name: places, packages, users, or reviews');
  process.exit(1);
}

exportData(collectionName); 