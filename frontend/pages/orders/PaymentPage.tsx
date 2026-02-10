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

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

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

  const requestPayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setConfirmed(true);
    setProcessing(false);
  };

  const assignAgent = async () => {
    const foundOrder = mockOrders.find(o => o.orderId === orderId);
    if (foundOrder) {
      foundOrder.currentStage = 'Field Agent Assigned';
      foundOrder.agent = { name: 'Emma Engineer', phone: '07700 900456', region: 'London', vehicle: 'VAN-1001' };
    }
    alert('Field agent Emma Engineer has been notified!');
    navigate(`/orders/${orderId}/agent-waiting`);
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

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Verification</h2>

          {!processing && !confirmed && (
            <button onClick={requestPayment} className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold">
              Request Customer Payment
            </button>
          )}

          {processing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Waiting for customer payment...</p>
              <p className="text-sm text-gray-500 mt-2">Processing with business unit</p>
            </div>
          )}

          {confirmed && (
            <div>
              <div className="p-4 bg-green-50 rounded mb-4 text-center">
                <div className="text-green-600 text-4xl mb-2">✓</div>
                <p className="text-green-800 font-semibold">Payment Confirmed</p>
                <p className="text-sm text-gray-600 mt-1">Amount verified and approved</p>
              </div>
              <div className="p-3 bg-blue-50 rounded mb-4">
                <p className="text-sm text-gray-700">Ready to assign field agent</p>
              </div>
              <button onClick={assignAgent} className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                Assign Field Agent →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
