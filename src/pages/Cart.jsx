import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, clearCart } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const Cart = () => {
  const { items, totalAmount } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleRemove = async (id) => {
  try {
    await api.delete(`/cart/remove/${id}`);

    dispatch(removeItemFromCart(id));
  } catch (error) {
    console.error(
      'Failed to remove item from cart:',
      error.response?.data || error.message
    );
  }
};

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-cafe-dark mb-4">
          Your cart is empty
        </h2>
        <Link
          to="/menu"
          className="bg-cafe-DEFAULT text-white px-6 py-2 rounded font-semibold hover:bg-cafe-dark"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen px-4 container mx-auto">
      <h1 className="text-4xl font-bold text-center text-cafe-dark mb-8">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-cafe-dark">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${Number(item.price).toFixed(2)} x {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-bold text-cafe-DEFAULT">
                  ${Number(item.totalPrice).toFixed(2)}
                </span>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}

          <button
            onClick={() => dispatch(clearCart())}
            className="text-red-500 hover:text-red-700 text-sm mt-4 inline-block"
          >
            Clear Cart
          </button>
        </div>

        <div className="glass-panel p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${Number(totalAmount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Taxes</span>
            <span>${(Number(totalAmount) * 0.05).toFixed(2)}</span>
          </div>

          <hr className="my-4 border-gray-300" />

          <div className="flex justify-between font-bold text-xl mb-6">
            <span>Total</span>
            <span>
              ${(Number(totalAmount) * 1.05).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-cafe-DEFAULT text-white py-3 rounded font-bold hover:bg-cafe-dark transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
