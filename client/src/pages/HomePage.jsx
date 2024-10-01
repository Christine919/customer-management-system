import React, { useEffect, useState}  from 'react';
import bannerImage from '../images/banner.png'; 
import about_me from '../images/about_me.jpg'
import supabase from '../config/supabaseClient';
import ProductSlider from './components/ProductSlide';
import claymask from "../images/claymask.png"
import rose from "../images/rose.png"
import oat from "../images/oat.png"
import peppermint from "../images/peppermint.png"
import Modal from './components/Modal';
import { SocialIcon } from 'react-social-icons'

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

<div className="p-10 bg-gray-100 my-10">
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
<div className="mt-6 px-8 py-16 border border-gray-300 shadow-lg rounded-lg bg-pink-50">
  <section id="products" className="container mx-auto">
    <h3 className="text-center text-2xl md:text-4xl font-bold text-pink-900 mb-6">Our Products</h3>
    <ProductSlider />
  </section>
</div>

<section id='about'>
  <div className="py-16 bg-white">
    <h2 className="text-center text-3xl md:text-4xl font-bold text-pink-900 mb-6">
      About Me
    </h2>
    <div className="flex flex-col md:flex-row items-center justify-center">
      {/* Image */}
      <div className="w-full md:w-1/2 max-w-sm mb-6 md:mb-0">
        <img
          src={about_me}
          alt="About Me"
          className="rounded-lg shadow-lg w-full h-auto object-cover"
        />
      </div>
      {/* Text Content */}
      <div className="w-full md:w-1/2 px-4 md:px-8">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Hi, I’m Britney, the owner of Aesthetics_23, a skincare studio based
          in Melaka. My passion for beauty and wellness inspired me to create a
          space where people can feel empowered through effective skincare
          solutions. With years of experience in the beauty industry, I’m
          dedicated to providing personalized skincare treatments that bring out
          the best in your skin.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          At Aesthetics_23, I believe that healthy skin is the foundation of
          confidence. My approach combines modern skincare technology with a
          deep understanding of individual skin needs. I am committed to helping
          you achieve your skincare goals through customized treatments tailored
          specifically to your skin type and concerns.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Whether you are looking to treat acne, rejuvenate your skin, or simply
          enjoy a relaxing facial, I’m here to guide you on your skincare
          journey. Welcome to Aesthetics_23, where every treatment is a step
          toward glowing, healthy skin.
        </p>
      </div>
    </div>
  </div>
</section>


<div>
      {/* Contact Me Section */}
      <section id="contact" className="py-16">
        <h2 className="text-center text-4xl md:text-2xl font-bold text-pink-900 mb-6">
          Contact Me for Appointments or Skincare Consultations
        </h2>

        
        <div className="flex justify-center">
        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-lg">
        
        <div className="flex justify-center space-x-6">
          {/* Instagram */}
          <SocialIcon 
            url="https://www.instagram.com/_aesthetics_23/?hl=ha-ng" 
            className="hover:opacity-80 transition-opacity duration-300" 
            target="_blank" 
          />

          {/* Facebook */}
          <SocialIcon 
            url="https://www.facebook.com/aesthetics250722/" 
            className="hover:opacity-80 transition-opacity duration-300" 
            target="_blank" 
          />

          {/* WhatsApp */}
          <SocialIcon 
            url="https://wa.link/l0ilua" 
            className="hover:opacity-80 transition-opacity duration-300" 
            target="_blank" 
            network="whatsapp" // Ensures correct icon
          />
        </div>

        <h2 className="text-center text-2xl md:text-4xl font-bold text-pink-900 my-6">Business Hours</h2>

          <ul className="text-gray-700">
          <li className="flex justify-between py-2 border-b">
              <span>Monday</span>
              <span>11 am – 7 pm</span>
            </li>
            <li className="flex justify-between py-2 border-b">
              <span>Tuesday</span>
              <span>11 am – 7 pm</span>
            </li>
            <li className="flex justify-between py-2  border-b">
              <span>Wednesday</span>
              <span>11 am – 7 pm</span>
            </li>
            <li className="flex justify-between py-2 border-b">
              <span>Thursday</span>
              <span>Closed</span>
            </li>
            <li className="flex justify-between py-2 border-b">
              <span>Friday</span>
              <span>10 am – 6 pm</span>
            </li>
            <li className="flex justify-between py-2 border-b">
              <span>Saturday</span>
              <span>10 am – 7 pm</span>
            </li>
            <li className="flex justify-between py-2">
              <span>Sunday</span>
              <span>10 am – 7 pm</span>
            </li>
          </ul>
        </div>
      </div>
      </section>
    </div>
      {/* Location Section */}
      <section id="location" className="py-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-pink-900 mb-10">Our Location</h2>
        <div >
          {/* Google Map */}
          <div className="w-full h-64 md:h-auto px-8">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.8939540409683!2d102.26048100000001!3d2.1938326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xab25e4d06c8ac419%3A0x1960394ab38b48a6!2sAesthetics%2023%20Melaka!5e0!3m2!1sen!2smy!4v1726753352713!5m2!1sen!2smy"
              width="100%"
              height="300"
              className="rounded-lg shadow-lg"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;

