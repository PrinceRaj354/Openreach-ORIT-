import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QueueFilters from '../../components/orders/QueueFilters';
import QueueTable from '../../components/orders/QueueTable';
import { mockOrders } from '../../mockData';

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

interface QueueResponse {
  total: number;
  items: OrderQueueItem[];
}

export default function OrderQueue() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderQueueItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const limit = 20;
  const orderServiceUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [search, status, priority, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let filtered = mockOrders.filter(order => {
        const matchesSearch = !search || 
          order.orderId.toLowerCase().includes(search.toLowerCase()) ||
          order.customer.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !status || order.status === status;
        const matchesPriority = !priority || order.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
      });

      const start = page * limit;
      const paginatedOrders = filtered.slice(start, start + limit);

      const mappedOrders: OrderQueueItem[] = paginatedOrders.map((order, idx) => ({
        id: start + idx + 1,
        order_number: order.orderId,
        customer_name: order.customer,
        priority: order.priority,
        status: order.status,
        sla_due_date: order.createdDate,
        postcode: order.address.split(',').pop()?.trim() || null,
        assigned_agent_id: order.agent?.name || null,
        product_summary: order.products.map(p => p.product).join(', ')
      }));

      setOrders(mappedOrders);
      setTotal(filtered.length);
    } catch (error) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleView = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      navigate(`/orders/${order.order_number}`);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Queue</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all orders</p>
      </div>

      {/* Filters */}
      <QueueFilters
        search={search}
        status={status}
        priority={priority}
        onSearchChange={(value) => { setSearch(value); setPage(0); }}
        onStatusChange={(value) => { setStatus(value); setPage(0); }}
        onPriorityChange={(value) => { setPriority(value); setPage(0); }}
      />

      {/* Stats */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{orders.length}</span> of{' '}
            <span className="font-semibold">{total}</span> orders
          </div>
          <div className="flex items-center gap-4">
            {mockOrders.filter(o => o.currentStage === 'Work Completed by Agent').length > 0 && (
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold animate-pulse">
                🔔 {mockOrders.filter(o => o.currentStage === 'Work Completed by Agent').length} Installation(s) Completed - Review Needed
              </div>
            )}
            <div className="text-sm text-gray-600">
              Page {page + 1} of {totalPages || 1}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <QueueTable
        orders={orders}
        loading={loading}
        onView={handleView}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white border border-gray-300 rounded-md">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
