import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import ProductCard from './ProductCard';
import supabase from '../../config/supabaseClient';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          throw error;
        }

        // Update state with fetched products
        setProducts(data);
      } catch (error) {
        // Handle error
        setError(error.message || 'An error occurred while fetching products.');
      } finally {
        // Set loading to false
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
      spaceBetween={20}
      slidesPerView={3}
     >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={{
                id: product.id,
                name: product.product_name,
                price: `RM ${product.product_price}`, // Format price if necessary
                image: product.image[0], // Assuming image is an array, take the first image
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
