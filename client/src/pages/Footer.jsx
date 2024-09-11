import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-600 via-transparent to-purple-600 text-white p-2 sm:p-3 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm">
        <p className="mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} Aesthetics_23. All rights reserved.
        </p>
        <p>
          Designed and Developed by Christine Ng
        </p>
      </div>
    </footer>
  );
};

export default Footer;
