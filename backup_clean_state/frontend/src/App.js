import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Protected Pages
import Profile from './pages/user/Profile';
import Favorites from './pages/user/Favorites';
import Reviews from './pages/user/Reviews';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPlaces from './pages/admin/Places';
import AdminPackages from './pages/admin/Packages';
import AdminReviews from './pages/admin/Reviews';
import AdminUsers from './pages/admin/Users';

// Error Pages
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="places" element={<Places />} />
          <Route path="places/:id" element={<PlaceDetail />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:id" element={<PackageDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected User Routes */}
        <Route path="/user" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="profile" element={<Profile />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="places" element={<AdminPlaces />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 