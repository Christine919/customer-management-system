import React, { useState, useEffect } from 'react';
import logo from '../images/logo.png';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

const HeaderBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {

        setIsVisible(false);
      } else {

        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`bg-gradient-to-r from-pink-600 via-transparent to-purple-600 text-white p-2 sm:p-3 shadow-md fixed top-0 left-0 w-full z-50 backdrop-blur-md transform-gpu transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1 sm:mr-2 border-2 border-white"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">Aesthetics23</h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex space-x-6 text-sm lg:text-lg font-semibold">
            <li>
              <a href="#products" className="hover:text-yellow-300 transition-colors duration-200">
                Products
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
            <li>
              <a href="/dashboard" className="hover:text-yellow-300 transition-colors duration-200">
                Dashboard
              </a>
            </li>
          </ul>
        </nav>

        {/* Hamburger Menu for Mobile/Tablets */}
        <button
          className="block lg:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile/Tablet Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-pink-500 z-50 flex flex-col items-center justify-center min-h-screen w-full">
          <button
            className="absolute top-4 right-4 focus:outline-none"
            onClick={toggleMenu}
          >
            <XIcon className="h-8 w-8 text-white" />
          </button>
          <ul className="flex flex-col space-y-8 text-2xl font-semibold text-white text-center">
            <li>
              <a
                href="#products"
                className="hover:text-pink-400 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-pink-400 transition-colors duration-200"
                onClick={toggleMenu}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-pink-400 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#location"
                className="hover:text-pink-400 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Location
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className="hover:text-pink-400 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Dashboard
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default HeaderBar;
