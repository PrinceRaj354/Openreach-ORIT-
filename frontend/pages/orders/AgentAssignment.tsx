import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTracker from '../../components/orders/ProgressTracker';
import { mockOrders } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  products: Array<{ product_name: string; quantity: number }>;
}

export default function InventoryCheck() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [checking, setChecking] = useState(false);
  const [inventoryDone, setInventoryDone] = useState(false);

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
          products: foundOrder.products.map(p => ({ product_name: p.product, quantity: p.quantity }))
        });
      }
    } catch (err) {
      console.error('Failed to fetch order');
    }
  };

  const runInventoryCheck = async () => {
    setChecking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setInventoryDone(true);
    setChecking(false);
  };

  const proceedToPayment = async () => {
    const foundOrder = mockOrders.find(o => o.orderId === orderId);
    if (foundOrder) {
      foundOrder.currentStage = 'Payment Verification';
    }
    navigate(`/orders/${orderId}/payment`);
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Inventory Verification</h2>

          {!checking && !inventoryDone && (
            <button
              onClick={runInventoryCheck}
              className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold"
            >
              Start Verification Process
            </button>
          )}

          {(checking || inventoryDone) && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded">
              {!inventoryDone && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900"></div>}
              {inventoryDone && <div className="text-green-600 text-xl">✓</div>}
              <div>
                <div className="font-medium">Inventory Check</div>
                {inventoryDone && <div className="text-sm text-gray-600">ONT, Router, and Cables reserved</div>}
              </div>
            </div>
          )}

          {inventoryDone && (
            <button
              onClick={proceedToPayment}
              className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Proceed to Payment →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
