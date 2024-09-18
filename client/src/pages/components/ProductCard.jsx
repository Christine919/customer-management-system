import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-64">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover rounded-t-xl"
        />
        <div className="absolute top-2 left-2 bg-white p-1 rounded-full">
          <button className="text-gray-500">❤️</button>
        </div>
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
          <button className="text-gray-500">🔗</button>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500">{product.price}</p >
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-3 w-full">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;