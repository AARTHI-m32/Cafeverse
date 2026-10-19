import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center glass-panel p-12"
      >
        <h1 className="text-6xl font-bold text-cafe-DEFAULT mb-4">Welcome to CafeVerse</h1>
        <p className="text-2xl text-cafe-light mb-8 font-light">Experience the best coffee and food in town.</p>
        <Link to="/menu">
          <button className="bg-cafe-DEFAULT text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-cafe-dark transition-colors">
            Explore Menu
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
