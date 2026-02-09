import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockOrders, orderSteps, getActionForStage, getActionTitle, canUserProgressStage } from '../mockData';
import { orderStateManager } from '../orderState';
import { useApp } from '../AppContext';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const { user } = useApp();
  const orderData = mockOrders.find(o => o.orderId === orderId);
  
  const [orderState, setOrderState] = useState(orderStateManager.getOrder(orderId!));
  const [loading, setLoading] = useState(false);
  const [showSiteCheckModal, setShowSiteCheckModal] = useState(false);

  useEffect(() => {
    const unsubscribe = orderStateManager.subscribe(() => {
      setOrderState(orderStateManager.getOrder(orderId!));
    });
    return unsubscribe;
  }, [orderId]);

  if (!orderData || !orderState) return <div style={{ padding: '2rem' }}>Order not found</div>;

  const currentStage = orderState.currentStage;
  const timeline = orderState.timeline;
  const currentStepIndex = orderSteps.indexOf(currentStage);
  const isStepCompleted = (step: string) => orderSteps.indexOf(step) < currentStepIndex;
  const isStepCurrent = (step: string) => step === currentStage;
  const isCompleted = currentStage === 'Service Enabled';
  const userRole = user?.role || 'ORIT_OPS';
  const canProgress = canUserProgressStage(currentStage, userRole);

  const handleAction = () => {
    if (currentStage === 'Site Check') {
      setShowSiteCheckModal(true);
      return;
    }
    if (currentStage === 'Field Agent Assigned' && userRole === 'FIELD_AGENT') {
      progressToNext('Field Agent');
      return;
    }
    if (currentStage === 'Payment Verification' && userRole === 'ORIT_OPS') {
      handlePaymentVerification();
      return;
    }
    progressToNext('Ops Team');
  };

  const progressToNext = (actor: string) => {
    setLoading(true);
    setTimeout(() => {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < orderSteps.length) {
        const newStage = orderSteps[nextIndex];
        orderStateManager.updateStage(orderId!, newStage, actor);
      }
      setLoading(false);
    }, 2000);
  };

  const handlePaymentVerification = () => {
    setLoading(true);
    setTimeout(() => {
      orderStateManager.markPaymentVerified(orderId!, 'Ops Team');
      setLoading(false);
    }, 2000);
  };

  const completeSiteCheck = () => {
    setShowSiteCheckModal(false);
    progressToNext('Ops Team');
  };

  const showNextActionPanel = !isCompleted && 
    (currentStage !== 'Work Completed by Agent' || userRole === 'ORIT_OPS');

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#073b4c', marginBottom: '0.5rem' }}>{orderData.orderId}</h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '0.5rem' }}>{orderData.customer}</p>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              background: orderData.priority === 'High' ? '#fee2e2' : orderData.priority === 'Medium' ? '#fef3c7' : '#e0f2fe',
              color: orderData.priority === 'High' ? '#991b1b' : orderData.priority === 'Medium' ? '#92400e' : '#075985'
            }}>
              {orderData.priority} Priority
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              background: isCompleted ? '#dcfce7' : '#fef3c7',
              color: isCompleted ? '#166534' : '#92400e',
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </span>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Created: {orderData.createdDate}</p>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '1rem', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflowX: 'auto', paddingBottom: '1rem' }}>
          {orderSteps.map((step, idx) => {
            const completed = isStepCompleted(step);
            const current = isStepCurrent(step);
            return (
              <div key={step} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                {idx > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '50%',
                    width: '100%',
                    height: '2px',
                    background: completed ? '#10b981' : '#e5e7eb',
                    zIndex: 0
                  }} />
                )}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: completed ? '#10b981' : current ? '#3b82f6' : '#e5e7eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  zIndex: 1,
                  position: 'relative',
                  boxShadow: current ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {completed ? '✓' : idx + 1}
                </div>
                <p style={{
                  marginTop: '0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: current ? '600' : '500',
                  color: completed ? '#10b981' : current ? '#3b82f6' : '#9ca3af',
                  textAlign: 'center',
                  maxWidth: '100px'
                }}>
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Verification Panel (OPS Only) */}
      {currentStage === 'Payment Verification' && userRole === 'ORIT_OPS' && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>💳 Payment Verification Required</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Agent has completed work. Confirm payment received to enable service.</p>
            </div>
            <button
              onClick={handleAction}
              disabled={loading}
              style={{
                background: 'white',
                color: '#f59e0b',
                padding: '0.75rem 2rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? '⏳ Processing...' : '✓ Confirm Payment Received'}
            </button>
          </div>
        </div>
      )}

      {/* Work Completed Notification (OPS View) */}
      {currentStage === 'Work Completed by Agent' && userRole === 'ORIT_OPS' && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>✅ Work Completed by Field Agent</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Installation finished. Moving to payment verification.</p>
            </div>
            <button
              onClick={() => progressToNext('System')}
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
                transition: 'transform 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? '⏳ Processing...' : '→ Proceed to Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Agent Waiting Panel */}
      {(currentStage === 'Work Completed by Agent' || currentStage === 'Payment Verification') && userRole === 'FIELD_AGENT' && (
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
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Payment verification in progress. You will be notified once complete.</p>
        </div>
      )}

      {/* Next Action Panel */}
      {showNextActionPanel && canProgress && currentStage !== 'Payment Verification' && currentStage !== 'Work Completed by Agent' && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>⚡ Next Step Required</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Current Stage: {currentStage}</p>
            </div>
            <button
              onClick={handleAction}
              disabled={loading}
              style={{
                background: 'white',
                color: '#667eea',
                padding: '0.75rem 2rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? '⏳ Processing...' : `🚀 ${getActionForStage(currentStage, userRole)}`}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Service Enabled Successfully!</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>All workflow stages completed. Payment verified.</p>
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Customer Details */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👤 Customer Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div><span style={{ fontWeight: '600' }}>Name:</span> {orderData.customer}</div>
            <div><span style={{ fontWeight: '600' }}>Phone:</span> {orderData.phone}</div>
            <div><span style={{ fontWeight: '600' }}>Address:</span> {orderData.address}</div>
          </div>
        </div>

        {/* Product Details */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📦 Product Details
          </h3>
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

        {/* Site Information */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📍 Site Information
          </h3>
          {isStepCompleted('Site Check') ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: '#dcfce7',
                  color: '#166534'
                }}>
                  Serviceable
                </span>
              </div>
              <div><span style={{ fontWeight: '600' }}>Technology:</span> {orderData.site.technology}</div>
              <div><span style={{ fontWeight: '600' }}>Distance:</span> {orderData.site.distance}</div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>⏳ Waiting for completion</p>
          )}
        </div>

        {/* Inventory Availability */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📊 Inventory Availability
          </h3>
          {isStepCompleted('Inventory Check') ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: '#dcfce7',
                  color: '#166534'
                }}>
                  {orderData.inventory.status}
                </span>
              </div>
              <div><span style={{ fontWeight: '600' }}>Warehouse:</span> {orderData.inventory.warehouse}</div>
              <div><span style={{ fontWeight: '600' }}>Allocation Time:</span> {orderData.inventory.allocationTime}</div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>⏳ Waiting for completion</p>
          )}
        </div>

        {/* Node Capacity */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔌 Node Capacity
          </h3>
          {isStepCompleted('Node Capacity Check') ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: '#dcfce7',
                  color: '#166534'
                }}>
                  {orderData.node.capacity}
                </span>
              </div>
              <div><span style={{ fontWeight: '600' }}>Port:</span> {orderData.node.port}</div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>⏳ Waiting for completion</p>
          )}
        </div>

        {/* Assigned Agent */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🚗 Assigned Agent
          </h3>
          {isStepCompleted('Field Agent Assigned') ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><span style={{ fontWeight: '600' }}>Name:</span> {orderData.agent.name}</div>
              <div><span style={{ fontWeight: '600' }}>Phone:</span> {orderData.agent.phone}</div>
              <div><span style={{ fontWeight: '600' }}>Region:</span> {orderData.agent.region}</div>
              <div><span style={{ fontWeight: '600' }}>Vehicle:</span> {orderData.agent.vehicle}</div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>⏳ Waiting for completion</p>
          )}
        </div>

        {/* Audit Timeline */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#073b4c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📅 Audit Timeline
          </h3>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {timeline.map((event, idx) => (
              <div key={idx} style={{ position: 'relative', paddingBottom: '1.5rem' }}>
                {idx < timeline.length - 1 && (
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

      {/* Site Check Modal */}
      {showSiteCheckModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowSiteCheckModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#073b4c' }}>🔍 Site Check</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}><span style={{ fontWeight: '600' }}>Address:</span> {orderData.address}</p>
              <div style={{ padding: '1rem', background: '#dcfce7', borderRadius: '8px', marginTop: '1rem' }}>
                <p style={{ fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>✓ Site Check Passed</p>
                <p style={{ fontSize: '0.875rem', color: '#166534' }}>Location is serviceable with FTTP technology</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSiteCheckModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={completeSiteCheck}
                className="btn-primary"
                style={{ minWidth: 'auto' }}
              >
                Complete Check
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
