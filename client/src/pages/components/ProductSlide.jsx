import React, { useEffect, useState } from 'react';
import { Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-10">
      <Swiper
        spaceBetween={20} // Space between slides (in pixels)
        slidesPerView={1} // Slides per view at the smallest breakpoint
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }} // Enable pagination dots
        scrollbar={{ draggable: true }} // Enable a draggable scrollbar
        modules={[Pagination, Autoplay, Scrollbar, A11y]} // Include required modules
        breakpoints={{
          640: {
            width: 640,
            slidesPerView: 2, // Show 2 slides at 640px wide
          },
          768: {
            width: 768,
            slidesPerView: 3, // Show 3 slides at 768px wide
          },
          1024: {
            width: 1024,
            slidesPerView: 4, // Show 4 slides at 1024px wide
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
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
