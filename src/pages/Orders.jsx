import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      setOrders(response.data.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-24 text-center">Loading orders...</div>;

  return (
    <div className="pt-24 min-h-screen px-4 container mx-auto">
      <h1 className="text-4xl font-bold text-center text-cafe-dark mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {orders.map(order => (
            <div key={order.id} className="glass-panel p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-2 gap-2">
                <div>
                  <span className="text-gray-500 text-sm">Order ID: {order.id}</span>
                  <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold text-center w-max ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </div>
              </div>
              <div className="mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t text-cafe-dark">
                <span>Total Amount</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
