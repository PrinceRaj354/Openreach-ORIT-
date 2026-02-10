import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from '../../mockData';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_address: string;
  status: string;
  product_summary: string;
  sla_due_date: string;
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const orderServiceUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchAssignedOrders();
    const interval = setInterval(fetchAssignedOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      const assignedOrders = mockOrders.filter(o => o.currentStage === 'Field Agent Assigned');
      const mappedOrders: Order[] = assignedOrders.map((o, idx) => ({
        id: idx + 1,
        order_number: o.orderId,
        customer_name: o.customer,
        customer_address: o.address,
        status: o.currentStage,
        product_summary: o.products.map(p => p.product).join(', '),
        sla_due_date: o.createdDate
      }));
      setOrders(mappedOrders);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const startInstallation = async (orderNumber: string) => {
    navigate(`/agent/install/${orderNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Field Agent Portal</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-sm">🔔 Notifications</span>
              {orders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </div>
            <span className="text-sm">Agent #1</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Assigned Orders ({orders.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            No orders assigned yet
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{order.order_number}</h3>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                        NEW
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">{order.customer_name}</p>
                    <p className="text-gray-600 text-sm">{order.customer_address}</p>
                    <p className="text-gray-600 text-sm mt-1">Product: {order.product_summary}</p>
                    <p className="text-gray-500 text-xs mt-1">SLA: {new Date(order.sla_due_date).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => startInstallation(order.order_number)}
                    className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold"
                  >
                    Start Installation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
