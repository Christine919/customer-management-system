import React  from 'react';
import tonerImage from '../images/toner.png';
import serumImage from '../images/serum.png';
import sunscreenImage from '../images/sunscreen.png';
import bannerImage from '../images/banner.png'; // Add the path to your banner image


const HomePage = () => {
  return (
    <div className="frontend p-2 min-h-screen sm:p-4 md:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl text-pink-800 font-bold mb-4 text-gray-800 md:text-3xl">Welcome to Aesthetics_23 精简·美肌</h2>
      
  {/* Services Section with Banner */}
  <section className="mb-6 bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-col lg:flex-row">
        {/* Banner Image */}
        <div className="w-full lg:w-1/2">
          <img src={bannerImage} alt="Banner" className="w-full h-40 sm:h-60 md:h-72 lg:h-full object-cover"/>
        </div>

</section>

      {/* Products Section */}
      <section className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold uppercase mb-2">Our Products</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <li className="border p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
            <img src={tonerImage} alt="toner" className="w-full h-auto mb-2" />
            <h4 className="font-bold text-sm sm:text-base">Derm10 Solar Defense Toner 150ml</h4>
            <p className="text-xs sm:text-sm">RM 199</p>
          </li>
          <li className="border p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
            <img src={serumImage} alt="serum" className="w-full h-auto mb-2" />
            <h4 className="font-bold text-sm sm:text-base">Derm10 Solar Defense Serum 30ml</h4>
            <p className="text-xs sm:text-sm">RM 259</p>
          </li>
          <li className="border p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
            <img src={sunscreenImage} alt="sunscreen" className="w-full h-auto mb-2" />
            <h4 className="font-bold text-sm sm:text-base">Derm10 Solar Defense Sunscreen SPF50+++</h4>
            <p className="text-xs sm:text-sm">RM 189</p>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
