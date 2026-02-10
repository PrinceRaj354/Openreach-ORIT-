import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrders } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_address: string;
  product_summary: string;
}

export default function AgentInstall() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [step, setStep] = useState(0);

  const orderServiceUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8000';

  const steps = ['Verify Site', 'Install ONT', 'Install Router', 'Test Connection', 'Customer Sign-off'];

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
          customer_address: foundOrder.address,
          product_summary: foundOrder.products.map(p => p.product).join(', ')
        });
      }
    } catch (err) {
      console.error('Failed to fetch order');
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const completeInstallation = async () => {
    const foundOrder = mockOrders.find(o => o.orderId === orderId);
    if (foundOrder) {
      foundOrder.currentStage = 'Work Completed by Agent';
    }
    navigate('/agent');
  };

  if (!order) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Installation in Progress</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{order.order_number}</h2>
          <p className="text-gray-700 font-medium">{order.customer_name}</p>
          <p className="text-gray-600 text-sm">{order.customer_address}</p>
          <p className="text-gray-600 text-sm mt-1">Product: {order.product_summary}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Installation Steps</h3>
          
          <div className="space-y-3 mb-6">
            {steps.map((stepName, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded ${
                idx < step ? 'bg-green-50' : idx === step ? 'bg-blue-50' : 'bg-gray-50'
              }`}>
                {idx < step ? (
                  <div className="text-green-600 text-xl">✓</div>
                ) : idx === step ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900"></div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                )}
                <span className={`font-medium ${idx <= step ? 'text-gray-900' : 'text-gray-400'}`}>
                  {stepName}
                </span>
              </div>
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold"
            >
              Complete {steps[step]}
            </button>
          ) : (
            <button
              onClick={completeInstallation}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Complete Installation & Notify OPS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
