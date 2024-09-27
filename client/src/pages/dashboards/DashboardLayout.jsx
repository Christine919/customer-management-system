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
    <div className="text-var(--black) h-screen flex items-center justify-center">
      <div className="grid h-[97%] w-[97%] rounded-3xl gap-4 grid-cols-[11rem_auto] bg-gradient-to-b from-[#fdf5e6] to-[#f8e1dd]">
        {/* Sidebar on the left */}
        <div className="h-full">
          <Sidebar />
        </div>

        {/* Right content area - only this section is scrollable */}
        <div className="h-full overflow-y-auto p-4">
          {showCalendar && <Appointments />}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
