import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import OpsDashboard from './pages/OpsDashboard';
import FieldAgentJobs from './pages/FieldAgentJobs';
import AnalyticsPage from './pages/AnalyticsPage';
import MapPage from './pages/MapPage';
import InventoryPage from './pages/InventoryPage';

import JobOperations from './pages/JobOperations';
import SupportPage from './pages/SupportPage';
import OrderQueue from './pages/orders/OrderQueue';
import OrderDetails from './pages/orders/OrderDetails';
import SiteCheck from './pages/orders/SiteCheck';
import InventoryCheck from './pages/orders/AgentAssignment';
import PaymentPage from './pages/orders/PaymentPage';
import AgentWaiting from './pages/orders/AgentWaiting';
import InstallationReview from './pages/orders/InstallationReview';
import ServiceComplete from './pages/orders/ServiceComplete';
import FieldAgentOrderView from './pages/FieldAgentOrderView';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentInstall from './pages/agent/AgentInstall';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <OpsDashboard />
          </ProtectedRoute>
        } />

        <Route path="/jobs" element={
          <ProtectedRoute>
            <JobOperations />
          </ProtectedRoute>
        } />

        <Route path="/field-jobs" element={
          <ProtectedRoute>
            <FieldAgentJobs />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } />

        <Route path="/inventory" element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        } />

        <Route path="/map" element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        } />

        <Route path="/support" element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderQueue />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId" element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId/site-check" element={
          <ProtectedRoute>
            <SiteCheck />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId/inventory" element={
          <ProtectedRoute>
            <InventoryCheck />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId/payment" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId/agent-waiting" element={
          <ProtectedRoute>
            <AgentWaiting />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId/installation-review" element={
          <ProtectedRoute>
            <InstallationReview />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId/complete" element={
          <ProtectedRoute>
            <ServiceComplete />
          </ProtectedRoute>
        } />

        <Route path="/agent/orders/:orderId" element={
          <ProtectedRoute>
            <FieldAgentOrderView />
          </ProtectedRoute>
        } />

        <Route path="/agent" element={
          <ProtectedRoute>
            <AgentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/agent/install/:orderId" element={
          <ProtectedRoute>
            <AgentInstall />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
