import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTracker from '../../components/orders/ProgressTracker';
import { mockOrders } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  address: string;
  status: string;
}

const MOCK_AGENT = {
  name: 'Emma Engineer',
  phone: '+44 7700 900456',
  vehicle: 'VAN-1001',
  status: 'Assigned'
};

export default function AgentWaiting() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [agentStatus, setAgentStatus] = useState('En Route');

  const orderServiceUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => {
      const foundOrder = mockOrders.find(o => o.orderId === orderId);
      if (foundOrder && foundOrder.currentStage === 'Work Completed by Agent') {
        navigate(`/orders/${orderId}/installation-review`);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const foundOrder = mockOrders.find(o => o.orderId === orderId);
      if (foundOrder) {
        setOrder({
          id: parseInt(orderId?.split('-')[2] || '0'),
          order_number: foundOrder.orderId,
          customer_name: foundOrder.customer,
          address: foundOrder.address,
          status: foundOrder.currentStage
        });
      }
    } catch (err) {
      console.error('Failed to fetch order');
    }
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
          <p className="text-gray-600">Address: {order.address}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Field Agent</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><span className="text-gray-600">Name:</span> <span className="font-semibold">{MOCK_AGENT.name}</span></div>
            <div><span className="text-gray-600">Phone:</span> <span className="font-semibold">{MOCK_AGENT.phone}</span></div>
            <div><span className="text-gray-600">Vehicle:</span> <span className="font-semibold">{MOCK_AGENT.vehicle}</span></div>
            <div><span className="text-gray-600">Status:</span> <span className="font-semibold text-blue-600">{agentStatus}</span></div>
          </div>
          <div className="p-3 bg-blue-50 rounded text-blue-800 text-sm">
            ℹ️ Agent has been notified and is handling the installation
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Installation Status</h2>
          <div className="text-center py-8">
            <div className="animate-pulse text-4xl mb-4">⏳</div>
            <p className="text-gray-700 font-semibold mb-2">Waiting for Field Agent</p>
            <p className="text-sm text-gray-500">Installation will be completed by the field agent</p>
            <p className="text-xs text-gray-400 mt-4">This page will auto-update when field agent completes the work</p>
          </div>
        </div>
      </div>
    </div>
  );
}
