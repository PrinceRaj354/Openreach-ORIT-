import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTracker from '../../components/orders/ProgressTracker';
import { mockOrders, orderSteps } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  address: string;
  status: string;
  products: Array<{ product_name: string; quantity: number }>;
}

export default function SiteCheck() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [checking, setChecking] = useState(false);
  const [checks, setChecks] = useState({
    reachability: { status: 'pending', message: '' },
    port: { status: 'pending', message: '' },
    latency: { status: 'pending', message: '' },
    bandwidth: { status: 'pending', message: '' }
  });
  const [complete, setComplete] = useState(false);

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
          address: foundOrder.address,
          status: foundOrder.currentStage,
          products: foundOrder.products.map(p => ({ product_name: p.product, quantity: p.quantity }))
        });
      }
    } catch (err) {
      console.error('Failed to fetch order');
    }
  };

  const runSiteCheck = async () => {
    setChecking(true);

    // Check 1: Reachability
    await new Promise(resolve => setTimeout(resolve, 1500));
    setChecks(prev => ({ ...prev, reachability: { status: 'success', message: 'Site is reachable' } }));

    // Check 2: Port
    await new Promise(resolve => setTimeout(resolve, 1500));
    setChecks(prev => ({ ...prev, port: { status: 'success', message: 'Port available' } }));

    // Check 3: Latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    setChecks(prev => ({ ...prev, latency: { status: 'success', message: 'Latency: 12ms (OK)' } }));

    // Check 4: Bandwidth
    await new Promise(resolve => setTimeout(resolve, 1500));
    setChecks(prev => ({ ...prev, bandwidth: { status: 'success', message: 'Bandwidth: 1Gbps available' } }));

    setChecking(false);
    setComplete(true);
  };

  const proceedToInventory = async () => {
    const foundOrder = mockOrders.find(o => o.orderId === orderId);
    if (foundOrder) {
      foundOrder.currentStage = 'Inventory Check';
    }
    navigate(`/orders/${orderId}/inventory`);
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

        {/* Order Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-600">Order Number:</span> <span className="font-semibold">{order.order_number}</span></div>
            <div><span className="text-gray-600">Customer:</span> <span className="font-semibold">{order.customer_name}</span></div>
            <div><span className="text-gray-600">Address:</span> <span className="font-semibold">{order.address}</span></div>
            <div><span className="text-gray-600">Product:</span> <span className="font-semibold">{order.products[0]?.product_name}</span></div>
          </div>
        </div>

        {/* Site Check Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Site Check</h2>
          
          {!checking && !complete && (
            <button
              onClick={runSiteCheck}
              className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold"
            >
              Start Site Verification
            </button>
          )}

          {(checking || complete) && (
            <div className="space-y-4">
              {Object.entries(checks).map(([key, check]) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  {check.status === 'pending' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900"></div>}
                  {check.status === 'success' && <div className="text-green-600 text-xl">✓</div>}
                  <div>
                    <div className="font-medium capitalize">{key.replace('_', ' ')}</div>
                    {check.message && <div className="text-sm text-gray-600">{check.message}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {complete && (
            <button
              onClick={proceedToInventory}
              className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Proceed to Inventory Check →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
