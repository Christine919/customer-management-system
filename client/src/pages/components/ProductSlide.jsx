import React, { useEffect, useState } from 'react';
import { Autoplay, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';
import ProductCard from './ProductCard';
import supabase from '../../config/supabaseClient';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');

        if (error) {
          throw error;
        }

        setProducts(data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center py-20 text-lg text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mx-auto py-4 md:px-4 lg:px-8 md:max-w-8xl">
      <Swiper
        spaceBetween={16} // Reduce space between slides for better alignment
        autoplay={{
          delay: 3000, // Adjust autoplay speed for better user experience
          disableOnInteraction: false,
        }}
        scrollbar={{ draggable: true }}
        modules={[Autoplay, Scrollbar, A11y]}
        breakpoints={{
          320: {
            slidesPerView: 2, // Mobile: Show 1 slide
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2, // Tablets: Show 2 slides
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3, // Laptops: Show 3 slides
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 3, // Desktops: Show 4 slides
            spaceBetween: 32,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex justify-center">
            <ProductCard
              product={{
                id: product.id,
                name: product.product_name,
                price: `RM ${product.product_price}`,
                image: product.image[0],
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
