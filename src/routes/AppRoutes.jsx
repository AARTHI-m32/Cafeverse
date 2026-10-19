import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import Reservations from '../pages/Reservations';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      
      {/* Protected Customer Routes */}
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
      
      {/* Admin Route */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
