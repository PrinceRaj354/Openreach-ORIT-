import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTracker from '../../components/orders/ProgressTracker';
import { mockOrders } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  created_at: string;
}

export default function ServiceComplete() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  const orderServiceUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const foundOrder = mockOrders.find(o => o.orderId === orderId);
      if (foundOrder) {
        setOrder({
          id: parseInt(orderId?.split('-')[2] || '0'),
          order_number: foundOrder.orderId,
          customer_name: foundOrder.customer,
          status: foundOrder.currentStage,
          created_at: foundOrder.createdDate
        });
      }
    } catch (err) {
      console.error('Failed to fetch order');
    }
  };

  if (!order) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/orders')} className="mb-4 text-blue-900 hover:underline">
          ← Back to Queue
        </button>

        <ProgressTracker currentStage="SERVICE_ENABLED" />

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-lg shadow-lg text-white text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Service Activated!</h1>
          <p className="text-green-100">Order {order.order_number} is now live</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-semibold">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-green-600">Service Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Customer has been notified</li>
            <li>✓ Service is now active</li>
            <li>✓ Billing cycle started</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="w-full mt-6 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold"
        >
          Return to Order Queue
        </button>
      </div>
    </div>
  );
}
