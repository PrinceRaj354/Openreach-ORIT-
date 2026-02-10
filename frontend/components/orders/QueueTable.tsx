import React, { useState } from 'react';
import QueueActions from './QueueActions';

interface OrderQueueItem {
  id: number;
  order_number: string;
  customer_name: string;
  priority: string;
  status: string;
  sla_due_date: string | null;
  postcode: string | null;
  assigned_agent_id: string | null;
  product_summary: string;
}

interface QueueTableProps {
  orders: OrderQueueItem[];
  loading: boolean;
  onView: (orderId: number) => void;
}

export default function QueueTable({ orders, loading, onView }: QueueTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const getPriorityBadge = (priority: string) => {
    const colors = {
      URGENT: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      NORMAL: 'bg-gray-100 text-gray-800'
    };
    return colors[priority as keyof typeof colors] || colors.NORMAL;
  };

  const getStatusChip = (status: string) => {
    const colors = {
      CREATED: 'bg-blue-100 text-blue-800',
      SITE_CHECK_PENDING: 'bg-yellow-100 text-yellow-800',
      INVENTORY_CHECK_PENDING: 'bg-yellow-100 text-yellow-800',
      NODE_CAPACITY_PENDING: 'bg-yellow-100 text-yellow-800',
      STOCK_ALLOCATED: 'bg-purple-100 text-purple-800',
      AGENT_ASSIGNED: 'bg-indigo-100 text-indigo-800',
      SERVICE_ENABLED: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSLAColor = (slaDate: string | null) => {
    if (!slaDate) return 'text-gray-500';
    const now = new Date();
    const sla = new Date(slaDate);
    const diff = sla.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    
    if (days < 0) return 'text-red-600 font-semibold';
    if (days < 2) return 'text-amber-600 font-semibold';
    return 'text-green-600';
  };

  const formatSLA = (slaDate: string | null) => {
    if (!slaDate) return 'N/A';
    const date = new Date(slaDate);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">SLA</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Agent</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr 
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.order_number}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.customer_name}
                  {order.postcode && <span className="text-gray-500 text-xs block">{order.postcode}</span>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{order.product_summary}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityBadge(order.priority)}`}>
                    {order.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusChip(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className={`px-4 py-3 text-sm ${getSLAColor(order.sla_due_date)}`}>
                  {formatSLA(order.sla_due_date)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.assigned_agent_id || <span className="text-gray-400">Unassigned</span>}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <QueueActions
                    orderId={order.id}
                    onView={() => onView(order.id)}
                  />
                </td>
              </tr>
              {expandedRow === order.id && (
                <tr className="bg-gray-50">
                  <td colSpan={8} className="px-4 py-3">
                    <div className="text-sm text-gray-700">
                      <strong>Full Product Details:</strong> {order.product_summary}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
