import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTracker from '../../components/orders/ProgressTracker';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  address: string;
  status: string;
}

const MOCK_AGENT = {
  name: 'John Smith',
  phone: '+44 7700 900123',
  vehicle: 'VAN-2847',
  eta: '45 minutes'
};

export default function AgentAssignment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  const orderServiceUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${orderServiceUrl}/orders/${orderId}`);
      const data = await response.json();
      setOrder(data);
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

        <ProgressTracker currentStage={order.status} />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order: {order.order_number}</h2>
          <p className="text-gray-600">Customer: {order.customer_name}</p>
          <p className="text-gray-600">Address: {order.address}</p>
        </div>

        {/* Agent Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Field Agent</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-semibold">{MOCK_AGENT.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-semibold">{MOCK_AGENT.phone}</span>
            </div>
            <div>
              <span className="text-gray-600">Vehicle:</span>
              <span className="ml-2 font-semibold">{MOCK_AGENT.vehicle}</span>
            </div>
            <div>
              <span className="text-gray-600">ETA:</span>
              <span className="ml-2 font-semibold text-green-600">{MOCK_AGENT.eta}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded text-green-800 text-sm">
            ✓ Agent has been notified and is en route
          </div>
        </div>

        {/* Field Agent Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Installation Status</h2>
          <div className="p-4 bg-blue-50 rounded text-center">
            <p className="text-blue-900 font-semibold">Waiting for field agent to start installation</p>
            <p className="text-sm text-gray-600 mt-2">Field agent will update status from their mobile app</p>
          </div>
        </div>
      </div>
    </div>
  );
}
