import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, resRes, menuRes] = await Promise.all([
        api.get('/orders'),
        api.get('/reservations'),
        api.get('/menu')
      ]);
      setOrders(ordersRes.data.reverse());
      setReservations(resRes.data.reverse());
      setMenuItems(menuRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status?status=${status}`);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status?status=${status}`);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="pt-24 min-h-screen px-4 container mx-auto pb-12">
      <h1 className="text-4xl font-bold text-cafe-dark mb-8">Admin Dashboard</h1>
      
      <div className="flex space-x-4 mb-8 border-b pb-4 overflow-x-auto">
        {['orders', 'reservations', 'menu'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold capitalize transition-colors ${
              activeTab === tab ? 'text-cafe-DEFAULT border-b-2 border-cafe-DEFAULT' : 'text-gray-500 hover:text-cafe-dark'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-cafe-dark text-white text-left">
                <tr>
                  <th className="p-4 rounded-tl-lg">ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm font-mono">{order.id.slice(-6)}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="p-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="p-1 border rounded outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'reservations' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Manage Reservations</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-cafe-dark text-white text-left">
                <tr>
                  <th className="p-4 rounded-tl-lg">ID</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm font-mono">{res.id.slice(-6)}</td>
                    <td className="p-4">{res.date} {res.time}</td>
                    <td className="p-4">{res.guests}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={res.status}
                        onChange={(e) => updateReservationStatus(res.id, e.target.value)}
                        className="p-1 border rounded outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'menu' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Manage Menu</h2>
            <button className="bg-cafe-DEFAULT text-white px-4 py-2 rounded font-bold hover:bg-cafe-dark transition-colors">
              + Add Item
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map(item => (
              <div key={item.id} className="glass-panel p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-cafe-DEFAULT">${item.price.toFixed(2)}</span>
                  <button className="text-sm border border-cafe-DEFAULT text-cafe-DEFAULT px-3 py-1 rounded hover:bg-cafe-DEFAULT hover:text-white transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default AdminDashboard;
