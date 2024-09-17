import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HeaderBar from './pages/HeaderBar.jsx';
import Footer from './pages/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import NewCustomerForm from './pages/NewCustomerForm.jsx';
import NewAppointmentForm from './pages/NewAppointmentForm.jsx';
import NewOrderForm from './pages/NewOrderForm.jsx';
import DashboardLayout from './pages/dashboards/DashboardLayout.jsx';
import ProductsList from './pages/dashboards/ProductsList.jsx';
import ServicesList from './pages/dashboards/ServicesList.jsx';
import AppointmentCalendar from './pages/dashboards/AppointmentCalendar.jsx';
import { ToastContainer } from 'react-toastify';
import './index.css';

function MainLayout() {
  const location = useLocation();
  const isBackendRoute = location.pathname.startsWith('/backend');

  return (
    <>
      {!isBackendRoute && <HeaderBar />}
      <ToastContainer />
      <Routes>
        {/* frontend */}
        <Route path="/" element={<HomePage />} />
        <Route path="/new-customer" element={<NewCustomerForm />} />
        <Route path="/new-appointment" element={<NewAppointmentForm />}/>
        <Route path="/new-order" element={<NewOrderForm />}/>

        <Route path="/backend" element={<DashboardLayout />}>
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
