import { React, useState } from 'react';
import Modal from './Modal';

const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');

  const openModal = (photoUrl) => {
    setSelectedPhotoUrl(photoUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhotoUrl('');
  };

  // Fallback image if none provided
  const defaultImage = '/images/default-product.png';

  // Assuming product.image might be an array or a single URL
  const imageUrl = Array.isArray(product.image) ? product.image[0] : product.image;

  return (
    <div className="bg-white p-2 md:p-4 mb-4 rounded-xl shadow-lg w-80 h-[250px] md:h-[430px]">
      <div>
        <img
          src={imageUrl || defaultImage}
          alt={product.name}
          className="h-70 w-full object-cover rounded-t-xl"
          onClick={() => openModal(imageUrl)}
        />

      </div>
      <div className="mt-3">
        <h3 className="text-xs md:text-base font-semibold">{product.name}</h3>
        <p className="text-xs md:text-base  text-gray-500 mt-2 md:mt-4">{product.price}</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={selectedPhotoUrl}
      />
    </div>
  );
};

export default ProductCard;

