const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend/config.env') });

console.log('🔧 Setting up local PostgreSQL database...\n');

// Test database connection
async function setupLocalDatabase() {
  const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  });

  try {
    // Test connection
    console.log('🔍 Testing PostgreSQL connection...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection successful!');

    // Import models
    console.log('📋 Importing database models...');
    const User = require('./backend/models/User');
    const Place = require('./backend/models/Place');
    const Package = require('./backend/models/Package');
    const Review = require('./backend/models/Review');
    const Booking = require('./backend/models/Booking');

    // Set up associations
    console.log('🔗 Setting up model associations...');
    User.hasMany(Review, { foreignKey: 'userId' });
    User.hasMany(Booking, { foreignKey: 'userId' });
    Place.hasMany(Review, { foreignKey: 'placeId' });
    Place.hasMany(Package, { foreignKey: 'placeId' });
    Package.hasMany(Review, { foreignKey: 'packageId' });
    Package.hasMany(Booking, { foreignKey: 'packageId' });
    Package.belongsTo(Place, { foreignKey: 'placeId' });

    // Sync database
    console.log('🔄 Synchronizing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized!');

    // Check tables
    const tables = await sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    console.log('\n📊 Created tables:');
    tables[0].forEach(table => {
      console.log(`  ✓ ${table.tablename}`);
    });

    console.log('\n🎉 Local PostgreSQL database setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. cd backend && npm install');
    console.log('2. cd frontend && npm install');
    console.log('3. Start backend: cd backend && npm start');
    console.log('4. Start frontend: cd frontend && npm start');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running on your system');
    console.log('2. Verify the database "travel_app" exists');
    console.log('3. Check your credentials in backend/config.env');
    console.log('4. Ensure PostgreSQL is listening on port 5432');
  } finally {
    await sequelize.close();
  }
}

setupLocalDatabase();