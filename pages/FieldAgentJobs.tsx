import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from '../mockData';
import { orderStateManager } from '../orderState';
import { useApp } from '../AppContext';

const FieldAgentJobs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = orderStateManager.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  const myOrders = mockOrders.filter(order => {
    const orderState = orderStateManager.getOrder(order.orderId);
    return orderState && (
      orderState.currentStage === 'Field Agent Assigned' ||
      orderState.currentStage === 'Work Completed by Agent' ||
      orderState.currentStage === 'Payment Verification'
    );
  }).slice(0, 5); // Show first 5 orders for field agent

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#073b4c', marginBottom: '0.5rem' }}>My Assigned Orders</h2>
        <p style={{ color: '#6b7280' }}>Agent: {user?.username} • {user?.region} • {myOrders.length} active orders</p>
      </div>

      {myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>No Orders Assigned</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Check back later for new assignments</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {myOrders.map(order => {
            const orderState = orderStateManager.getOrder(order.orderId);
            if (!orderState) return null;

            const isWaiting = orderState.currentStage === 'Work Completed by Agent' || orderState.currentStage === 'Payment Verification';
            const canWork = orderState.currentStage === 'Field Agent Assigned';

            return (
              <div
                key={order.orderId}
                onClick={() => navigate(`/agent/orders/${order.orderId}`)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0a9c82';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,156,130,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#073b4c', marginBottom: '0.25rem' }}>{order.orderId}</h3>
                    <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>{order.customer}</p>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{order.address}</p>
                  </div>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: canWork ? '#e0f2fe' : isWaiting ? '#fef3c7' : '#dcfce7',
                    color: canWork ? '#075985' : isWaiting ? '#92400e' : '#166534'
                  }}>
                    {canWork ? '🚀 Ready' : isWaiting ? '⏳ Waiting OPS' : '✓ Complete'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Priority</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#073b4c' }}>{order.priority}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Status</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#073b4c' }}>{orderState.currentStage}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Products</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#073b4c' }}>{order.products.length}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FieldAgentJobs;
