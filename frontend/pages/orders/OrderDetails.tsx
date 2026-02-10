import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrders } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  status: string;
  products: Array<{ product_name: string; quantity: number }>;
  created_at: string;
  priority: string;
}

const STAGE_ROUTES: Record<string, string> = {
  'Site Check': 'site-check',
  'Inventory Check': 'inventory',
  'Node Capacity Check': 'inventory',
  'Allocate Local Stock': 'inventory',
  'Payment Verification': 'payment',
  'Field Agent Assigned': 'agent-waiting',
  'Work Completed by Agent': 'installation-review',
  'Service Enabled': 'complete'
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderServiceUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const foundOrder = mockOrders.find(o => o.orderId === orderId);
      if (!foundOrder) {
        throw new Error('Order not found');
      }
      
      const mappedOrder: Order = {
        id: parseInt(orderId?.split('-')[2] || '0'),
        order_number: foundOrder.orderId,
        customer_name: foundOrder.customer,
        customer_phone: foundOrder.phone,
        address: foundOrder.address,
        status: foundOrder.currentStage,
        products: foundOrder.products.map(p => ({ product_name: p.product, quantity: p.quantity })),
        created_at: foundOrder.createdDate,
        priority: foundOrder.priority
      };
      
      setOrder(mappedOrder);
      
      const route = STAGE_ROUTES[foundOrder.currentStage] || 'site-check';
      navigate(`/orders/${orderId}/${route}`, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="w-full px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
          >
            Back to Queue
          </button>
        </div>
      </div>
    );
  }

  return null;
}
