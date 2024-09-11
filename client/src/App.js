import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HeaderBar from './components/HeaderBar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './components/HomePage.jsx';
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
