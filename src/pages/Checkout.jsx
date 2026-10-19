import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { clearCart } from '../redux/cartSlice';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { items, totalAmount } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const finalTotal = totalAmount * 1.05;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice
        })),
        totalAmount: finalTotal,
        deliveryAddress: address,
        paymentMethod
      };
      
      await api.post('/orders', orderData);
      dispatch(clearCart());
      navigate('/orders');
    } catch (error) {
      console.error("Error placing order", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setAddress({...address, [e.target.name]: e.target.value});

  if (items.length === 0) return <div className="pt-24 text-center">Your cart is empty.</div>;

  return (
    <div className="pt-24 min-h-screen px-4 container mx-auto">
      <h1 className="text-4xl font-bold text-center text-cafe-dark mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
          <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            <input type="text" name="street" placeholder="Street Address" required onChange={handleChange} className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="city" placeholder="City" required onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="state" placeholder="State" required onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="zipCode" placeholder="ZIP Code" required onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="country" placeholder="Country" required onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4">Payment Method</h2>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
              <option value="COD">Cash on Delivery</option>
              <option value="PAY_AT_CAFE">Pay at Cafe</option>
            </select>
          </form>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="max-h-60 overflow-y-auto mb-4 border-b pb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-xl mb-6">
            <span>Total to Pay</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
          <button 
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full bg-cafe-DEFAULT text-white py-3 rounded font-bold hover:bg-cafe-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
