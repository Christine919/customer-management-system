import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-600 via-transparent to-purple-600 text-white p-4 sm:p-3 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-xs md:text-md">
        <p className="mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} Aesthetics23. All rights reserved.
        </p>
        <p className='hidden md:block mb-2 sm:mb-0'>
          Designed and Developed by AquaFroma Web Solutions Enterprise
        </p>
        <p className='text-center block md:hidden'>
          Designed and Developed by <br /> AquaFroma Web Solutions Enterprise
        </p>
      </div>
    </footer>
  );
};

export default Footer;
