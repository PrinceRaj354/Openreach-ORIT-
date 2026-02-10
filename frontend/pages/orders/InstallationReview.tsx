import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTracker from '../../components/orders/ProgressTracker';
import { mockOrders } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
}

const MOCK_PHOTOS = [
  { id: 1, label: 'ONT Installation', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop' },
  { id: 2, label: 'Router Setup', url: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=300&h=200&fit=crop' },
  { id: 3, label: 'Cable Management', url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=300&h=200&fit=crop' },
  { id: 4, label: 'Customer Signature', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop' }
];

export default function InstallationReview() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [activating, setActivating] = useState(false);

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
          status: foundOrder.currentStage
        });
      }
    } catch (err) {
      console.error('Failed to fetch order');
    }
  };

  const activateService = async () => {
    setActivating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const foundOrder = mockOrders.find(o => o.orderId === orderId);
    if (foundOrder) {
      foundOrder.currentStage = 'Service Enabled';
      foundOrder.status = 'Completed';
    }
    navigate(`/orders/${orderId}/complete`);
  };

  if (!order) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
  </div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/orders')} className="mb-4 text-blue-900 hover:underline">← Back</button>
        <ProgressTracker currentStage={order.status} />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order: {order.order_number}</h2>
          <p className="text-gray-600">Customer: {order.customer_name}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="text-green-600 text-2xl">✓</div>
            <div>
              <p className="font-semibold text-green-900">Installation Completed</p>
              <p className="text-sm text-green-700">Field agent has finished the installation</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Installation Photos</h2>
          <div className="grid grid-cols-2 gap-4">
            {MOCK_PHOTOS.map(photo => (
              <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <img src={photo.url} alt={photo.label} className="w-full h-48 object-cover" />
                <div className="p-2 bg-gray-50 text-sm text-gray-700 font-medium">{photo.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Activation</h2>
          <p className="text-gray-600 mb-4">Review the installation photos and activate the service for the customer.</p>
          
          {!activating ? (
            <button onClick={activateService} className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
              Activate Service →
            </button>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Activating service...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
