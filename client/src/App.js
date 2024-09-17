import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HeaderBar from './pages/HeaderBar.jsx';
import Footer from './pages/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import NewCustomerForm from './pages/NewCustomerForm.jsx';
import NewAppointmentForm from './pages/NewAppointmentForm.jsx';
import NewOrderForm from './pages/NewOrderForm.jsx';
import DashboardLayout from './pages/dashboards/DashboardLayout.jsx';
import Customers from './pages/dashboards/Customers.jsx';
import OrderDashboard from './pages/dashboards/Orders.jsx';
import ProductsList from './pages/dashboards/ProductsList.jsx';
import ServicesList from './pages/dashboards/ServicesList.jsx';
import AppointmentCalendar from './pages/dashboards/AppointmentCalendar.jsx';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import './index.css';

function MainLayout() {
  const location = useLocation();
  const isBackendRoute = location.pathname.startsWith('/backend');

  return (
    <>
      {!isBackendRoute && <HeaderBar />}
      <Routes>
        {/* frontend */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/new-customer" element={<ProtectedRoute><NewCustomerForm /></ProtectedRoute>} />
        <Route path="/new-appointment" element={<ProtectedRoute><NewAppointmentForm /></ProtectedRoute>} />
        <Route path="/new-order" element={<ProtectedRoute><NewOrderForm /></ProtectedRoute>} />

        {/* backend (protected) */}
        <Route path="/backend" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<OrderDashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="appointments" element={<AppointmentCalendar />} />
        </Route>
      </Routes>
      {!isBackendRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;