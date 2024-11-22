import React, { useState } from 'react';
import logo from '../images/logo.png';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

const HeaderBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gradient-to-r from-pink-600 via-transparent to-purple-600 text-white p-2 sm:p-3 shadow-md fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1 sm:mr-2 border-2 border-white"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">Aesthetics23</h1>
        </a>

        {/* Hamburger Menu for Mobile */}
        <button
          className="block sm:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>

        {/* Navigation links */}
        <nav className={`sm:flex items-center ${isOpen ? 'block' : 'hidden'} sm:block`}>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm sm:text-lg font-semibold my-2 md:mt-0 sm:mt-0">
            <li>
              <a href="#products" className="hover:text-yellow-300 transition-colors duration-200">
                Product
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-yellow-300 transition-colors duration-200">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-yellow-300 transition-colors duration-200">
                Contact
              </a>
            </li>
            <li>
              <a href="#location" className="hover:text-yellow-300 transition-colors duration-200">
                Location
              </a>
            </li>
            {/* <li>
              <a href="/backend" className="hover:text-yellow-300 transition-colors duration-200">
                Dashboard
              </a>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderBar;
