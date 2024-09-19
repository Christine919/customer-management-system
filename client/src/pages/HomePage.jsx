import React, { useEffect, useState}  from 'react';
import bannerImage from '../images/banner.png'; // Add the path to your banner image
import supabase from '../config/supabaseClient';
import ProductSlider from './components/ProductSlide';
import claymask from "../images/claymask.png"
import rose from "../images/rose.png"
import oat from "../images/oat.png"
import peppermint from "../images/peppermint.png"
import Modal from './components/Modal';

const HomePage = () => {
  const [ fetchError, setFetchError ] = useState(null);
  const [ services, setServices ] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      const { data, error } = await supabase
      .from('services')
      .select()

      if (error){
        setFetchError('Could not fetch the service');
        setServices(null);
          console.log(error);
      }
      if(data){
        setServices(data);
        setFetchError(null);
      }
    }

    fetchService();
  }, [])
  
   // Separate services into two categories
   const ourServices = services.filter(service => service.service_id >= 1 && service.service_id <= 8);
   const otherServices = services.filter(service => service.service_id >= 9 && service.service_id <= 11);

   const openModal = (photoUrl) => {
    setSelectedPhotoUrl(photoUrl);
    setIsModalOpen(true);
};

const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhotoUrl('');
};

  return (
    <div className="frontend p-2 min-h-screen sm:p-4 md:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl text-pink-800 font-bold mb-4 text-gray-800 md:text-3xl">Welcome to Aesthetics_23 精简·美肌</h2>
      
  {/* Services Section with Banner */}
  <section className="mb-6 bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-col lg:flex-row">
        {/* Banner Image */}
        <div className="w-full lg:w-1/2">
          <img src={bannerImage} alt="Banner" className="w-full h-40 sm:h-60 md:h-72 lg:h-full object-cover"/>
        </div>

         {/* Our Services List */}
  <div className="w-full lg:w-full p-2 sm:p-4 md:p-6">
    <h3 className="text-lg sm:text-xl font-semibold uppercase mb-3 p-2 border-b border-purple-200 bg-purple-100 md:text-2xl">
      Skin Management 皮肤管理
    </h3>
    {fetchError && (<p>{fetchError}</p>)}
    <ul>
      {ourServices.length > 0 ? (
        ourServices.map(service => (
          <li key={service.service_id} className="flex justify-between items-center p-2 sm:p-3 md:p-4 border-b border-gray-200 hover:bg-gray-50 transition">
            <span className="font-medium text-gray-800 text-sm sm:text-base">
              {service.service_name}
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              RM {service.service_price}
            </span>
          </li>
        ))
      ) : (
        <li className="p-2 text-gray-600 text-sm">No services available</li>
      )}
    </ul>
    <h3 className="text-lg sm:text-xl font-semibold uppercase mb-3 p-2 border-b border-purple-200 bg-purple-100 md:text-2xl">
      Other Services 其他服务
    </h3>
    <ul>
      {otherServices.length > 0 ? (
        otherServices.map(service => (
          <li key={service.service_id} className="flex justify-between items-center p-2 sm:p-3 md:p-4 border-b border-gray-200 hover:bg-gray-50 transition">
            <span className="font-medium text-gray-800 text-sm sm:text-base">
              {service.service_name}
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              RM {service.service_price}
            </span>
          </li>
        ))
      ) : (
        <li className="p-2 text-gray-600 text-sm">No services available</li>
      )}
    </ul>
  </div>
</section>

<div className="p-8 bg-gray-100 my-10">
  <h2 className="text-center text-2xl md:text-4xl font-bold text-pink-900 mb-6">New Products</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <div onClick={() => openModal(rose)} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
      <img
        src={rose}
        alt="Gallery Image1"
        className="w-full aspect-square object-cover"
      />
    </div>
    <div onClick={() => openModal(oat)} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
      <img
        src={oat}
        alt="Gallery Image2"
        className="w-full aspect-square object-cover"
      />
    </div>
    <div onClick={() => openModal(claymask)} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
      <img
        src={claymask}
        alt="Gallery Image3"
        className="w-full aspect-square object-cover"
      />
    </div>
    <div onClick={() => openModal(peppermint)} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
      <img
        src={peppermint}
        alt="Gallery Image4"
        className="w-full aspect-square object-cover"
      />
    </div>
  </div>
</div>

<Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    imageUrl={selectedPhotoUrl}
                />


      {/* Products Section */}
<div className="mt-6 p-8 border border-gray-300 shadow-lg rounded-lg bg-pink-50">
  <section className="container mx-auto">
    <h3 className="text-center text-2xl md:text-4xl font-bold text-pink-900 mb-6">Our Products</h3>
    <ProductSlider />
  </section>
</div>
    </div>
  );
};

export default HomePage;
