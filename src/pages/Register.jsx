import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-cafe-DEFAULT mb-6">Create Account</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text" name="name"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none"
              value={formData.name} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email" name="email"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none"
              value={formData.email} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password" name="password"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none"
              value={formData.password} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text" name="phone"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none"
              value={formData.phone} onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cafe-DEFAULT text-white py-2 rounded font-semibold hover:bg-cafe-dark transition-colors"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-cafe-accent hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
