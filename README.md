# Travel Explorer - Full Stack Travel Website

A comprehensive travel website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring tourist destinations, travel packages, user reviews, and an admin dashboard.

## 🌟 Features

### For Users
- **Browse Destinations**: Explore tourist places with photos, descriptions, and location details
- **Travel Packages**: View curated travel packages with real-time pricing and seasonal discounts
- **User Reviews**: Read and write reviews for places and packages
- **User Authentication**: Secure registration and login system
- **User Profiles**: Manage personal information and preferences
- **Favorites**: Save favorite places and packages
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-friendly interface

### For Admins
- **Admin Dashboard**: Comprehensive management interface
- **Content Management**: Add, edit, and delete places and packages
- **Review Moderation**: Approve, reject, or edit user reviews
- **User Management**: View and manage user accounts
- **Analytics**: View statistics and insights
- **Discount Management**: Create and manage seasonal discounts
- **Featured Content**: Highlight special places and packages

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Axios** - HTTP client

## 📁 Project Structure

```
travel-explorer/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   ├── .env.example       # Environment variables example
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
├── frontend/              # Frontend React app
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── search/    # Search components
│   │   │   └── ui/        # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Authentication pages
│   │   │   ├── admin/     # Admin pages
│   │   │   └── user/      # User pages
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-explorer
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   ```
   
   Edit `backend/.env` with your configuration:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your-db-password
   DB_NAME=travel_app
   DB_PORT=5432
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Places Endpoints
- `GET /api/places` - Get all places (with filtering)
- `GET /api/places/:id` - Get place by ID
- `POST /api/places` - Create new place (admin only)
- `PUT /api/places/:id` - Update place (admin only)
- `DELETE /api/places/:id` - Delete place (admin only)
- `GET /api/places/featured` - Get featured places

### Packages Endpoints
- `GET /api/packages` - Get all packages (with filtering)
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create new package (admin only)
- `PUT /api/packages/:id` - Update package (admin only)
- `DELETE /api/packages/:id` - Delete package (admin only)
- `GET /api/packages/featured` - Get featured packages

### Reviews Endpoints
- `GET /api/reviews` - Get reviews (with filtering)
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PUT /api/reviews/:id/helpful` - Mark review as helpful

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/reviews/pending` - Get pending reviews
- `PUT /api/admin/reviews/:id/moderate` - Moderate review
- `PUT /api/admin/places/:id/feature` - Toggle place featured status
- `PUT /api/admin/packages/:id/feature` - Toggle package featured status

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication:

- **User Role**: Regular users can browse, review, and manage their profiles
- **Admin Role**: Admins have full access to manage content and moderate reviews
- **Protected Routes**: Certain endpoints require authentication
- **Role-based Access**: Admin-only endpoints are protected

## 🎨 UI Components

The frontend includes reusable components:
- **Layout Components**: Header, Footer, Navigation
- **Authentication Components**: Login, Register, Protected Routes
- **UI Components**: Loading Spinner, Buttons, Forms, Cards
- **Search Components**: Search Modal with real-time results

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Configure MongoDB connection
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Future Enhancements

- Real-time notifications
- Payment integration
- Booking system
- Social media integration
- Advanced analytics
- Multi-language support
- Mobile app development

---

**Built with ❤️ using the MERN stack** 