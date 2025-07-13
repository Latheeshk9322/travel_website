const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

console.log('🔍 Testing PostgreSQL Connection...');
console.log('Database Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : 'NOT SET'
});

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: false
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const result = await sequelize.query('SELECT NOW()');
    console.log('✅ Database query test successful:', result[0][0]);
    
    await sequelize.close();
    console.log('✅ Connection closed.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your config.env file');
    console.log('3. Verify the database "travel_app" exists');
    console.log('4. Check username and password');
  }
})(); 