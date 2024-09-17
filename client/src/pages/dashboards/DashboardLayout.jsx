import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Appointments from './AppointmentCalendar.jsx';

const DashboardLayout = () => {
  const location = useLocation();
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    // Show the calendar only if the route matches specific paths
    setShowCalendar(location.pathname === '/backend' || location.pathname === '/appointments');
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar styling */}
      <div className="fixed bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main content area styling */}
      <div className="flex-1 p-8 ml-20">
        {showCalendar && <Appointments />}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
