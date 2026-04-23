import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Quotes from './pages/Quotes';
import CreateQuote from './pages/CreateQuote';
import QuoteDetail from './pages/QuoteDetail';
import InvoiceDetail from './pages/InvoiceDetail';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import AppLayout from './layouts/AppLayout';

function App() {
  const { user, loading } = useAuth();

  if (loading) return null; // O un spinner premium

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      {/* Rutas Protegidas */}
      <Route path="/" element={
        user ? (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/clients" element={
        user ? (
          <AppLayout>
            <Clients />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/inventory" element={
        user ? (
          <AppLayout>
            <Inventory />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/invoices" element={
        user ? (
          <AppLayout>
            <Invoices />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/invoices/view/:id" element={
        user ? (
          <AppLayout>
            <InvoiceDetail />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/invoices/new" element={
        user ? (
          <AppLayout>
            <CreateInvoice />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/quotes" element={
        user ? (
          <AppLayout>
            <Quotes />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/quotes/new" element={
        user ? (
          <AppLayout>
            <CreateQuote />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/quotes/view/:id" element={
        user ? (
          <AppLayout>
            <QuoteDetail />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/settings" element={
        user ? (
          <AppLayout>
            <Settings />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/reports" element={
        user ? (
          <AppLayout>
            <Reports />
          </AppLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
