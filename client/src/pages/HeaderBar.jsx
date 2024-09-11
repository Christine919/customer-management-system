import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { HomeIcon, UserAddIcon, CalendarIcon, ShoppingBagIcon, ChartBarIcon } from '@heroicons/react/outline';

const HeaderBar = () => {
  return (
    <header className="bg-gradient-to-r from-pink-600 via-transparent to-purple-600 text-white p-2 sm:p-3 shadow-md fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1 sm:mr-2 border-2 border-white"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">Aesthetics23</h1>
        </div>
        <nav>
          <ul className="flex space-x-4 sm:space-x-6 text-sm sm:text-lg font-semibold">
            <li>
              <Link to="/">
                <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 hover:text-yellow-300 transition-colors duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/new-customer">
                <UserAddIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 hover:text-yellow-300 transition-colors duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/new-appointment">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 hover:text-yellow-300 transition-colors duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/new-order">
                <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 hover:text-yellow-300 transition-colors duration-200" />
              </Link>
            </li>
            <li>
              <Link to="/login">
                <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 hover:text-yellow-300 transition-colors duration-200" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderBar;
