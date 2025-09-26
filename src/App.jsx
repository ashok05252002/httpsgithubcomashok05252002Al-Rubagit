import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/auth/LoginScreen';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';

import EnquiryList from './components/enquiry/EnquiryList';
import EnquiryDetail from './components/enquiry/EnquiryDetail_clean';
import NewEnquiry from './components/enquiry/NewEnquiry';

import BudgetList from './components/budget/BudgetList';
import BudgetCreateEdit from './components/budget/BudgetCreateEdit';
import BudgetView from './components/budget/BudgetView';

import QuotationList from './components/quotation/QuotationList';
import QuotationCreateEdit from './components/quotation/QuotationCreateEdit';

import ReceivedOrderList from './components/orders/ReceivedOrderList';
import ReceivedOrderForm from './components/orders/ReceivedOrderForm';

import SalesOrderList from './components/orders/SalesOrderList';
import SalesOrderForm from './components/orders/SalesOrderForm';

import FPOList from './components/fpo/FPOList';
import FPOForm from './components/fpo/FPOForm';

import InwardReceipt from './components/inward/InwardReceipt';
import IssuanceList from './components/issuance/IssuanceList';
import IssuanceDetail from './components/issuance/IssuanceDetail';
import InvoiceList from './components/invoice/InvoiceList';
import InvoiceForm from './components/invoice/InvoiceForm';

import InventoryMaster from './components/inventory/InventoryMaster';
import InventoryBlockingList from './components/inventory/InventoryBlockingList';

import AuditTrail from './components/audit/AuditTrail';
import Settings from './components/settings/Settings';

import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ReceivedOrdersProvider } from './context/ReceivedOrdersContext';
import { SalesOrdersProvider } from './context/SalesOrdersContext';
import { InvoicesProvider } from './context/InvoicesContext';
import NotFoundPage from './components/system/NotFoundPage';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/enquiries" element={<EnquiryList />} />
        <Route path="/enquiries/new" element={<NewEnquiry />} />
        <Route path="/enquiries/:id" element={<EnquiryDetail />} />

        <Route path="/budgets" element={<BudgetList />} />
        <Route path="/budget/new" element={<BudgetCreateEdit />} />
        <Route path="/budget/:id/view" element={<BudgetView />} />
        <Route path="/budget/:id/edit" element={<BudgetCreateEdit />} />

        <Route path="/quotations" element={<QuotationList />} />
        <Route path="/quotations/new" element={<QuotationCreateEdit />} />
        <Route path="/quotations/:id" element={<QuotationCreateEdit />} />

        <Route path="/received-orders" element={<ReceivedOrderList />} />
        <Route path="/received-orders/new" element={<ReceivedOrderForm />} />
        <Route path="/received-orders/edit/:id" element={<ReceivedOrderForm />} />

        <Route path="/sales-orders" element={<SalesOrderList />} />
        <Route path="/sales-orders/new" element={<SalesOrderForm />} />
        <Route path="/sales-orders/:id" element={<SalesOrderForm />} />

        <Route path="/blocking" element={<InventoryBlockingList />} />

        <Route path="/fpo" element={<FPOList />} />
        <Route path="/fpo/new" element={<FPOForm />} />
        <Route path="/fpo/:id" element={<FPOForm />} />

        <Route path="/inward" element={<InwardReceipt />} />

        <Route path="/issuance" element={<IssuanceList />} />
        <Route path="/issuance/:id" element={<IssuanceDetail />} />

        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />
        <Route path="/invoices/:id" element={<InvoiceForm />} />

        <Route path="/inventory" element={<InventoryMaster />} />
        <Route path="/audit-trail" element={<AuditTrail />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ReceivedOrdersProvider>
          <SalesOrdersProvider>
            <InvoicesProvider>
              <Router>
                <AppRoutes />
              </Router>
            </InvoicesProvider>
          </SalesOrdersProvider>
        </ReceivedOrdersProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
