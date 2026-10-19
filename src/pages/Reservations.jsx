import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ date: '', time: '', guests: 2, specialRequests: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations/myreservations');
      setReservations(response.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/reservations', formData);
      setSuccess("Reservation booked successfully! It will expire in 5 minutes if not confirmed by admin.");
      setFormData({ date: '', time: '', guests: 2, specialRequests: '' });
      fetchReservations();
    } catch (err) {
      setError("Failed to book reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen px-4 container mx-auto pb-12">
      <h1 className="text-4xl font-bold text-center text-cafe-dark mb-8">Table Reservations</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Book a Table</h2>
          {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" required min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Guests</label>
              <input type="number" name="guests" min="1" max="20" required value={formData.guests} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
              <textarea name="specialRequests" rows="3" value={formData.specialRequests} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-cafe-DEFAULT outline-none"></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cafe-DEFAULT text-white py-3 rounded font-bold hover:bg-cafe-dark transition-colors disabled:opacity-50">
              {loading ? 'Booking...' : 'Book Table'}
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">My Reservations</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-500">No reservations found.</p>
          ) : (
            reservations.map(res => (
              <div key={res.id} className="glass-panel p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-lg">{res.date} at {res.time}</h3>
                  <p className="text-gray-600 text-sm">{res.guests} Guests</p>
                  {res.specialRequests && <p className="text-gray-500 text-xs italic mt-1">"{res.specialRequests}"</p>}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold text-center w-max ${
                  res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                  res.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                  res.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {res.status}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reservations;
