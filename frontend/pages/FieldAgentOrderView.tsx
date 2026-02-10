import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockOrders } from '../mockData';
import { orderStateManager } from '../orderState';

const FieldAgentOrderView: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const orderData = mockOrders.find(o => o.orderId === orderId);
  
  const [orderState, setOrderState] = useState(orderStateManager.getOrder(orderId!));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = orderStateManager.subscribe(() => {
      setOrderState(orderStateManager.getOrder(orderId!));
    });
    return unsubscribe;
  }, [orderId]);

  if (!orderData || !orderState) return <div style={{ padding: '2rem' }}>Order not found</div>;

  const canStartWork = orderState.currentStage === 'Field Agent Assigned' && !orderState.workStarted;
  const canCompleteWork = orderState.currentStage === 'Field Agent Assigned' && orderState.workStarted && !orderState.workCompleted;
  const isWaitingForOps = orderState.currentStage === 'Work Completed by Agent' || orderState.currentStage === 'Payment Verification';
  const isCompleted = orderState.currentStage === 'Service Enabled';

  const handleStartWork = () => {
    setLoading(true);
    setTimeout(() => {
      orderStateManager.startWork(orderId!, 'Field Agent');
      setLoading(false);
    }, 1500);
  };

  const handleCompleteWork = () => {
    setLoading(true);
    setTimeout(() => {
      orderStateManager.completeWork(orderId!, 'Field Agent');
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/orders')}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer' }}
      >
        ← Back to Orders
      </button>

      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#073b4c', marginBottom: '1rem' }}>{orderData.orderId}</h1>
        <div style={{ marginBottom: '1rem' }}>
          <p><span style={{ fontWeight: '600' }}>Customer:</span> {orderData.customer}</p>
          <p><span style={{ fontWeight: '600' }}>Address:</span> {orderData.address}</p>
          <p><span style={{ fontWeight: '600' }}>Phone:</span> {orderData.phone}</p>
        </div>
        <div>
          <span style={{
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '600',
            background: isCompleted ? '#dcfce7' : isWaitingForOps ? '#fef3c7' : '#e0f2fe',
            color: isCompleted ? '#166534' : isWaitingForOps ? '#92400e' : '#075985'
          }}>
            {orderState.currentStage}
          </span>
        </div>
      </div>

      {/* Action Panel */}
      {canStartWork && (
        <div style={{
          background: 'linear-gradient(135deg, #0a9c82 0%, #4ac59d 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(10, 156, 130, 0.3)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>🚀 Ready to Start</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.9 }}>Click below to begin installation work</p>
          <button
            onClick={handleStartWork}
            disabled={loading}
            style={{
              background: 'white',
              color: '#0a9c82',
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '⏳ Starting...' : '▶ Start Work'}
          </button>
        </div>
      )}

      {canCompleteWork && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>✅ Complete Installation</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.9 }}>Mark work as completed and notify OPS team</p>
          <button
            onClick={handleCompleteWork}
            disabled={loading}
            style={{
              background: 'white',
              color: '#10b981',
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '⏳ Completing...' : '✓ Complete Work'}
          </button>
        </div>
      )}

      {isWaitingForOps && (
        <div style={{
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(107, 114, 128, 0.3)',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Waiting for OPS Team</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {orderState.currentStage === 'Work Completed by Agent' 
              ? 'Work completed. Waiting for payment verification.'
              : 'Payment verification in progress.'}
          </p>
        </div>
      )}

      {isCompleted && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Service Enabled!</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Order completed successfully</p>
        </div>
      )}

      {/* Products */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c' }}>📦 Products</h3>
        <table style={{ width: '100%', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Product</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Category</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Qty</th>
            </tr>
          </thead>
          <tbody>
            {orderData.products.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>{p.product}</td>
                <td style={{ padding: '0.5rem' }}>{p.category}</td>
                <td style={{ padding: '0.5rem' }}>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c' }}>📅 Timeline</h3>
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {orderState.timeline.map((event, idx) => (
            <div key={idx} style={{ position: 'relative', paddingBottom: '1.5rem' }}>
              {idx < orderState.timeline.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '-1.5rem',
                  top: '1.5rem',
                  width: '2px',
                  height: '100%',
                  background: '#e5e7eb'
                }} />
              )}
              <div style={{
                position: 'absolute',
                left: '-1.75rem',
                top: '0.25rem',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#0a9c82',
                border: '2px solid white',
                boxShadow: '0 0 0 2px #0a9c82'
              }} />
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{event.time}</div>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{event.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{event.actor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldAgentOrderView;
