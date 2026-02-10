import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from '../mockData';
import { useApp } from '../AppContext';

const OrderQueue: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filtered = mockOrders.filter(order => {
    const matchSearch = order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || order.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleRowClick = (orderId: string) => {
    if (user?.role === 'FIELD_AGENT') {
      navigate(`/agent/orders/${orderId}`);
    } else {
      navigate(`/orders/${orderId}`);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#073b4c' }}>Order Queue</h1>
      
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: '1', minWidth: '250px' }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ minWidth: '150px' }}>
            <option>All</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ minWidth: '150px' }}>
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Order ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Customer</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Address</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Priority</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Current Stage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr
                  key={order.orderId}
                  onClick={() => handleRowClick(order.orderId)}
                  style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#0a9c82' }}>{order.orderId}</td>
                  <td style={{ padding: '1rem' }}>{order.customer}</td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{order.address}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: order.priority === 'High' ? '#fee2e2' : order.priority === 'Medium' ? '#fef3c7' : '#e0f2fe',
                      color: order.priority === 'High' ? '#991b1b' : order.priority === 'Medium' ? '#92400e' : '#075985'
                    }}>
                      {order.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{order.currentStage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderQueue;
