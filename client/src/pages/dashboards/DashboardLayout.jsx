import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Appointments from './AppointmentCalendar.jsx';
import { XIcon } from '@heroicons/react/solid';

const DashboardLayout = () => {
  const location = useLocation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setShowCalendar(location.pathname === '/backend' || location.pathname === '/appointments');
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-[#fdf5e6] to-[#f8e1dd] ${sidebarOpen ? 'block' : 'hidden'} md:block fixed h-full z-20 w-64 md:w-64 lg:w-64 xl:w-64 2xl:w-64`}>
        <button className="absolute top-4 right-4 p-2 md:hidden" onClick={toggleSidebar}>
          <XIcon className="h-6 w-6 text-gray-500" />
        </button>
        <Sidebar setSidebarOpen={setSidebarOpen}/>
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col md:ml-64">
        {/* Hamburger Menu Button for Mobile */}
        <button className="md:hidden p-4 bg-gradient-to-b from-[#fdf5e6] to-[#f8e1dd]" onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-grow p-4 overflow-y-auto">
          {showCalendar && <Appointments />}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
