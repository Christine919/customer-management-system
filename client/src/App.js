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
import Sales from './pages/dashboards/Sales.jsx';
import ViewOrder from './pages/components/ViewOrder.jsx';
import './index.css';

function MainLayout() {
  const location = useLocation();
  const isBackendRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isBackendRoute && <HeaderBar />}
      <Routes>
        {/* frontend */}
        <Route path="/" element={<HomePage />} />

        {/* dashboard */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new-customer" element={<NewCustomerForm />} />
          <Route path="orders" element={<OrderDashboard />} />
          <Route path="orders/new-order" element={<NewOrderForm />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="appointments" element={<AppointmentCalendar />} />
          <Route path="sales" element={<Sales />} />
        </Route>

        {/* Individual Order View */}
        <Route path="/orders/:order_id" element={<ViewOrder />} />

        {/* 404 Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
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
