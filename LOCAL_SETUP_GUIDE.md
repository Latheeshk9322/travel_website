# 🚀 Travel Website Local Setup Guide

## 📦 **Download Your Project**

Your clean project archive is ready: **`travel-website-project-clean.zip`** (8.8MB)

This contains all your source code with PostgreSQL configuration restored, excluding node_modules for a faster download.

## 🔧 **Local Setup Instructions**

### **Step 1: Extract the Project**
```bash
# Download and extract the zip file
unzip travel-website-project-clean.zip
cd travel-website-project-clean
```

### **Step 2: Install Dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### **Step 3: Database Setup Options**

#### **Option A: Use PostgreSQL (Recommended)**
1. **Install PostgreSQL:**
   - **Windows:** Download from https://www.postgresql.org/download/windows/
   - **macOS:** `brew install postgresql`
   - **Ubuntu/Linux:** `sudo apt install postgresql postgresql-contrib`

2. **Set up the database:**
   ```bash
   # Start PostgreSQL service
   sudo systemctl start postgresql  # Linux
   brew services start postgresql   # macOS
   
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE travel_app;
   ALTER USER postgres PASSWORD 'Latheesh';
   \q
   ```

3. **Test connection:**
   ```bash
   cd backend
   node testConnection.js
   ```

#### **Option B: Use SQLite (Simpler Alternative)**
If you prefer not to set up PostgreSQL, you can switch to SQLite:

1. **Update backend/config.env:**
   ```env
   # Comment out PostgreSQL settings
   # DB_HOST=localhost
   # DB_USER=postgres
   # DB_PASSWORD=Latheesh
   # DB_NAME=travel_app
   # DB_PORT=5432
   
   # Add SQLite setting
   DB_DIALECT=sqlite
   DB_STORAGE=./travel_app.sqlite
   ```

2. **Install SQLite dependency:**
   ```bash
   cd backend
   npm install sqlite3
   ```

### **Step 4: Environment Configuration**

The project already includes a properly configured `backend/config.env` file with:
- ✅ PostgreSQL settings
- ✅ JWT configuration
- ✅ Server settings

**Optional:** Update these values if needed:
```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
```

### **Step 5: Run the Application**

1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev     # Development mode with auto-restart
   # OR
   npm start       # Production mode
   ```
   Backend will run on: http://localhost:5000

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on: http://localhost:3000

### **Step 6: Initialize Sample Data (Optional)**
```bash
cd backend
node scripts/seedData.js
```

## 🎯 **Project Features Restored**

✅ **Backend:**
- PostgreSQL database integration
- User authentication with JWT
- CRUD operations for packages, places, bookings, reviews
- File upload functionality
- Admin panel API

✅ **Frontend:**
- React.js with modern hooks
- Tailwind CSS styling
- User authentication flow
- Admin dashboard
- Responsive design
- Search functionality

✅ **Database Schema:**
- Users table with roles
- Places table with locations
- Packages table with travel packages  
- Reviews table with ratings
- Bookings table for reservations

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **PostgreSQL Connection Error:**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgres  # macOS
   ```

2. **Port Already in Use:**
   ```bash
   # Kill process on port 5000
   kill -9 $(lsof -ti:5000)
   
   # Kill process on port 3000  
   kill -9 $(lsof -ti:3000)
   ```

3. **Dependencies Issues:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

## 📂 **Project Structure**

```
travel-website-project/
├── backend/
│   ├── config.env          # Environment configuration
│   ├── server.js           # Express server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & upload middleware
│   └── uploads/            # File upload directory
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Application pages
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   └── public/             # Static assets
└── package.json            # Root package configuration
```

## 🎉 **You're All Set!**

Your travel website project is now restored with full PostgreSQL integration and ready for local development. The project includes all the features you had before the revert, including user authentication, admin panel, booking system, and more.

Happy coding! 🚀