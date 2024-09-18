import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProductCard from './ProductCard';

const ProductSlider = () => {
  const products = [
    { id: 1, name: 'LUXORA', price: '$2,200', image: '/images/luxora.png' },
    { id: 2, name: 'GRANDEUR', price: '$3,500', image: '/images/grandeur.png' },
    { id: 3, name: 'PRESTIGIO', price: '$4,500', image: '/images/prestigio.png' },
    { id: 4, name: 'SAPPHIRE', price: '$3,500', image: '/images/sapphire.png' },
    { id: 5, name: 'ONYX', price: '$2,200', image: '/images/onyx.png' },
  ];

  return (
    <div className="bg-green-100 p-10">
      <Swiper spaceBetween={20} slidesPerView={3}>
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;