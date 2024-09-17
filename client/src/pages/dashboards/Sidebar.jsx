import React from 'react';
import { Link, useLocation,} from 'react-router-dom';
import { HomeIcon, UserIcon, ClipboardListIcon, ShoppingBagIcon, CalendarIcon, ChartBarIcon, LogoutIcon } from '@heroicons/react/outline';
import supabase from '../../config/supabaseClient';

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; // Redirect to login after logging out
};

  return (
    <div className="flex flex-col p-2 md:p-3 h-screen shadow-lg w-20 lg:w-24 xl:w-28 transition-width duration-300 bg-gradient-to-b from-pink-500 to-purple-800">
    <div className="flex flex-col items-center mb-6">
      <Link to="/" className="flex flex-col items-center text-white hover:text-pink-200">
      <h2 className="text-xs md:text-sm lg:text-base font-serif">Aesthetics23</h2>
        <HomeIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
      </Link>
    </div>
    <ul className="space-y-6">
      <li className={location.pathname === '/customers' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="customers" className="flex flex-col items-center hover:text-pink-200">
          <UserIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">Clients</span>
        </Link>
      </li>
      <li className={location.pathname === '/orders' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="orders" className="flex flex-col items-center hover:text-pink-200">
          <ClipboardListIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">Orders</span>
        </Link>
      </li>
      <li className={location.pathname === '/products' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="products" className="flex flex-col items-center hover:text-pink-200">
          <ShoppingBagIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">Products</span>
        </Link>
      </li>
      <li className={location.pathname === '/services' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="services" className="flex flex-col items-center hover:text-pink-200">
          <ClipboardListIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">Services</span>
        </Link>
      </li>
      <li className={location.pathname === '/appointments' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="appointments" className="flex flex-col items-center hover:text-pink-200">
          <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">Calendar</span>
        </Link>
      </li>
      <li className={location.pathname === '/sales' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="sales" className="flex flex-col items-center hover:text-pink-200">
          <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">Sales</span>
        </Link>
      </li>
      {/* <li className={location.pathname === '/e-invoice' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="e-invoice" className="flex flex-col items-center hover:text-pink-200">
          <ClipboardListIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">E-invoice</span>
        </Link>
      </li> */}
      {/* <li className={location.pathname === '/settings' ? 'text-pink-200 font-semibold' : 'text-white'}>
        <Link to="settings" className="flex flex-col items-center hover:text-pink-200">
          <CogIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
          <span className="text-xs md:text-sm lg:text-base">Settings</span>
        </Link>
      </li> */}
    </ul>
    <button
      onClick={handleLogout}
      className="mt-auto py-2 px-3 md:px-4 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex flex-col items-center"
    >
      <LogoutIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mb-1" />
      <span className="text-xs md:text-sm lg:text-base">Logout</span>
    </button>
  </div>
  
  );
};

export default Sidebar;
