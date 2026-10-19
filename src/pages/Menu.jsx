import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../redux/cartSlice';
import api from '../services/api';
import { motion } from 'framer-motion';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
      const uniqueCategories = ['All', ...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    console.log(item.available);
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (item) => {
  try {
    const response = await api.post("/cart/add", {
      menuItemId: item.id || item._id,
      quantity: 1,
    });

    dispatch(addItemToCart(item));

    console.log("Added to cart:", response.data);
  } catch (error) {
    console.error(
      "Error adding item to cart:",
      error.response?.data || error.message
    );
  }
  };



  if (loading) return <div className="pt-24 text-center">Loading menu...</div>;

  return (
    <div className="pt-24 min-h-screen px-4 container mx-auto">
      <h1 className="text-4xl font-bold text-center text-cafe-dark mb-8">Our Menu</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category 
                ? 'bg-cafe-DEFAULT text-white' 
                : 'bg-white text-cafe-dark border border-cafe-DEFAULT hover:bg-cafe-light'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="Search items..." 
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredItems.map(item => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel overflow-hidden flex flex-col"
          >
            <div className="h-48 bg-gray-200 w-full flex items-center justify-center relative">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
              {item.isAvailable === false && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-xl transform -rotate-12">Sold Out</span>
                </div>
              )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-cafe-dark">{item.name}</h3>
                <span className="text-cafe-DEFAULT font-bold">{item.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
              <button 
                disabled={!item.available}
                onClick={() => handleAddToCart(item)}
                className={`w-full py-2 rounded font-semibold transition-colors ${
                  item.available 
                  ? 'bg-cafe-DEFAULT text-white hover:bg-cafe-dark' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500">No items found matching your criteria.</div>
      )}
    </div>
  );
};

export default Menu;
