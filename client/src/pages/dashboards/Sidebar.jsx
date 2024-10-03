import React, { useState } from 'react';
import { Link, useLocation,} from 'react-router-dom';
import { HomeIcon, UserIcon, ClipboardListIcon, ShoppingBagIcon, CalendarIcon, ChartBarIcon, LogoutIcon } from '@heroicons/react/outline';
import supabase from '../../config/supabaseClient';

const Sidebar = ({ setSidebarOpen }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleSelection = (path) => {
    setSelected(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col p-4 h-screen w-64">
      <div className="flex items-center mb-12 p-2">
        <Link to="/" className="flex flex-col items-center text-white hover:text-pink-200 mt-8">
          <HomeIcon className="w-7 h-7 text-black" />
          <h2 className="ml-2 text-lg font-semibold text-black">Aesthetics23</h2>
        </Link>
      </div>
      <ul className="space-y-4">
        <li className={selected === 'customers' ? 'bg-[#f799a354] rounded-r-lg' : 'text-black'}>
          <Link to="customers" className="flex items-center p-2 rounded-r-lg ml-4" onClick={() => handleSelection('customers')}>
            <UserIcon className="w-6 h-6" />
            <span className="ml-4">Clients</span>
          </Link>
        </li>
        <li className={selected === 'orders' ? 'bg-[#f799a354] rounded-r-lg' : 'text-black'}>
          <Link to="orders" className="flex items-center p-2 rounded-r-lg ml-4" onClick={() => handleSelection('orders')}>
            <ClipboardListIcon className="w-6 h-6" />
            <span className="ml-4">Orders</span>
          </Link>
        </li>
        <li className={selected === 'services' ? 'bg-[#f799a354] rounded-r-lg' : 'text-black'}>
          <Link to="services" className="flex items-center p-2 rounded-r-lg ml-4" onClick={() => handleSelection('services')}>
            <ClipboardListIcon className="w-6 h-6" />
            <span className="ml-4">Services</span>
          </Link>
        </li>
        <li className={selected === 'products' ? 'bg-[#f799a354] rounded-r-lg' : 'text-black'}>
          <Link to="products" className="flex items-center p-2 rounded-r-lg ml-4" onClick={() => handleSelection('products')}>
            <ShoppingBagIcon className="w-6 h-6" />
            <span className="ml-4">Products</span>
          </Link>
        </li>
        <li className={selected === 'appointments' ? 'bg-[#f799a354] rounded-r-lg' : 'text-black'}>
          <Link to="appointments" className="flex items-center p-2 rounded-r-lg ml-4" onClick={() => handleSelection('appointments')}>
            <CalendarIcon className="w-6 h-6" />
            <span className="ml-4">Appointment</span>
          </Link>
        </li>
      </ul>
      <button onClick={handleLogout} className="mt-auto py-2 px-3 md:px-4 rounded-md hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center">
        <LogoutIcon className="w-6 h-6 ml-4" />
      </button>
    </div>
  );
};

export default Sidebar;
