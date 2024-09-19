import React, { useEffect, useState } from "react";
import supabase from '../config/supabaseClient';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import withReactContent from 'sweetalert2-react-content';
import ImageUpload from "./components/ImageUpload";

const MySwal = withReactContent(Swal);

const NewOrderForm = () => {
  const navigate = useNavigate(); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    fname: '',
    email: '',
    phone_no: '',
    services: [{ service_id: '', service_name: '', service_price: 0, service_disc: 0 }],
    products: [{ product_id: '', product_name: '', product_price: 0, quantity: 1, product_disc: 0 }],
    total_order_price: 0,
    payment_method: '',
    order_status: '',
    order_remark: '',
    photos:[],
  });

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch customer details by phone number
        if (formData.phone_no) {
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('user_id, fname, email, phone_no')
            .eq('phone_no', formData.phone_no)
            .single();
        
          if (customerError) {
            console.error("Error fetching customer details:", customerError);
          } else if (customerData) {
            setFormData(prevState => ({
              ...prevState,
              user_id: customerData.user_id,
              fname: customerData.fname,
              email: customerData.email,
            }));
          }
        }

        // Fetch service details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select();
      
        if (serviceError) {
          console.error("Error fetching service details:", serviceError);
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: `No service found.`,
          });
        } else {
          setServices(serviceData);
        }

        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select();
      
        if (productError) {
          console.error("Error fetching product details:", productError);
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: `No product found.`,
          });
        } else {
          setProducts(productData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch data.',
        });
      }
    };

    fetchAllData();
  }, [formData.phone_no]);


   // Handle image upload
   const handleImageUpload = (imageUrl) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      photos: [...prevFormData.photos, imageUrl] // Add the new image URL to the array
    }));
  };

  const handleChange = async (e, index, type) => {
    const { name, value } = e.target;

    if (type === 'service') {
      const updatedServices = [...formData.services];
      updatedServices[index] = { ...updatedServices[index], [name]: value };
      setFormData(prevFormData => ({
        ...prevFormData,
        services: updatedServices,
      }));
    } else if (type === 'product') {
      const updatedProducts = [...formData.products];
      updatedProducts[index] = { ...updatedProducts[index], [name]: value };
      setFormData(prevFormData => ({
        ...prevFormData,
        products: updatedProducts,
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
        photos: e.target.value,
      }));
    }

    if (name === 'phone_no' && value) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('user_id, fname, email, phone_no')
          .eq('phone_no', value)
          .single();
        
        if (error) {
          console.error("Error fetching customer details:", error);
        }
        if (data) {
          setFormData(prevFormData => ({
            ...prevFormData,
            user_id: data.user_id,
            fname: data.fname,
            email: data.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch customer details.',
        });
      }
    }
  };

  const handleChangeSelection = (e, index, type) => {
    const value = e.target.value;
    
    if (type === 'service') {
      const selectedService = services.find(service => service.service_name === value);
      if (selectedService) {
        const updatedServices = [...formData.services];
        updatedServices[index] = {
          ...updatedServices[index],
          service_name: selectedService.service_name,
          service_id: selectedService.service_id,
          service_price: selectedService.service_price,
        };
        setFormData(prevFormData => ({
          ...prevFormData,
          services: updatedServices,
        }));
      }
    } else if (type === 'product') {
      const selectedProduct = products.find(product => product.product_name === value);
      if (selectedProduct) {
        const updatedProducts = [...formData.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          product_name: selectedProduct.product_name,
          product_id: selectedProduct.product_id,
          product_price: selectedProduct.product_price,
        };
        setFormData(prevFormData => ({
          ...prevFormData,
          products: updatedProducts,
        }));
      }
    }
  };

  const addItem = (type) => {
    if (type === 'service') {
      setFormData(prevFormData => ({
        ...prevFormData,
        services: [...prevFormData.services, { service_id: '', service_name: '', service_price: 0, service_disc: 0 }],
      }));
    } else if (type === 'product') {
      setFormData(prevFormData => ({
        ...prevFormData,
        products: [...prevFormData.products, { product_id: '', product_name: '', product_price: 0, quantity: 1, product_disc: 0 }],
      }));
    }
  };

  const removeItem = (type, index) => {
    if (type === 'service') {
      const updatedServices = formData.services.filter((_, i) => i !== index);
      setFormData(prevFormData => ({
        ...prevFormData,
        services: updatedServices,
      }));
    } else if (type === 'product') {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      setFormData(prevFormData => ({
        ...prevFormData,
        products: updatedProducts,
      }));
    }
  };

  const calculateTotalOrderPrice = () => {
    let totalServicePrice = 0;
    let totalProductPrice = 0;

    formData.services.forEach((service) => {
      totalServicePrice += service.service_price * (1 - service.service_disc / 100);
    });

    formData.products.forEach((product) => {
      totalProductPrice += product.product_price * product.quantity * (1 - product.product_disc / 100);
    });

    return totalServicePrice + totalProductPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const totalOrderPrice = calculateTotalOrderPrice();
  
    const orderServices = formData.services.map((service) => ({
      service_id: service.service_id,
      service_name: service.service_name,
      service_price: service.service_price,
      service_disc: service.service_disc,
      total_service_price: (service.service_price * (1 - service.service_disc / 100)).toFixed(2),
    }));
  
    const orderProducts = formData.products.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      quantity: product.quantity,
      product_disc: product.product_disc,
      total_product_price: (product.product_price * product.quantity * (1 - product.product_disc / 100)).toFixed(2),
    }));
  
    // Clean the photos array to ensure it contains only valid URLs
    const validPhotos = Array.isArray(formData.photos) ? formData.photos.filter(photo => {
      return typeof photo === 'string' && photo.startsWith('http');
    }) : [];
    
    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: formData.user_id,
            fname: formData.fname,
            email: formData.email,
            phone_no: formData.phone_no,
            total_order_price: totalOrderPrice.toFixed(2),
            payment_method: formData.payment_method,
            order_status: formData.order_status,
            order_remark: formData.order_remark,
            photos: validPhotos,
          }
        ]);
  
      if (error) {
        console.error("Error inserting order:", error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create order.',
        });
        return;
      }
  
      // Assuming order_id is auto-generated and available here
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('order_id')
        .order('order_id', { ascending: false })
        .limit(1)
        .single();
  
      if (orderError) {
        console.error("Error fetching order ID:", orderError);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch order ID.',
        });
        return;
      }
  
      const orderId = orderData.order_id;
  
      // Insert services and products into order_services and order_products tables
      await Promise.all([
        ...orderServices.map(service => supabase
          .from('orderservices')
          .insert({ ...service, order_id: orderId })),
        ...orderProducts.map(product => supabase
          .from('orderproducts')
          .insert({ ...product, order_id: orderId }))
      ]);

      MySwal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Order created successfully.',
      }).then(() => {
        // Reset form data after successful submission
        setFormData({
          user_id: '',
          fname: '',
          email: '',
          phone_no: '',
          payment_method: '',
          order_status: '',
          order_remark: '',
          services: [{ service_id: '', service_name: '', service_price: 0, service_disc: 0 }],
          products: [{ product_id: '', product_name: '', product_price: 0, quantity: 0, product_disc: 0 }],
          photos: [] 
        });
        
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 1000); 
  
        // Optionally navigate to another page or reset form state
        navigate('/new-order');
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create order.',
      });
    }
  };

  return (
    <div className="frontend flex flex-col justify-center items-center min-h-screen bg-gray-100 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg form-container">
      <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full" encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold uppercase mb-8 text-center text-gray-800">
          New Order Form
          </h2>

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone_no"
              value={formData.phone_no}
              onChange={(e) => handleChange(e)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>

      {/* Service Details */}
<h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Service Details</h3>
<table className="w-full border border-gray-300 mb-6">
  <thead>
    <tr>
      <th className="p-2 border-b">Service Name</th>
      <th className="p-2 border-b">Service Price</th>
      <th className="p-2 border-b">Discount (%)</th>
      <th className="p-2 border-b">Total Service Price</th>
      <th className="p-2 border-b">Actions</th>
    </tr>
  </thead>
  <tbody>
    {formData.services.map((service, index) => (
      <tr key={index}>
        <td className="p-2 border-b">
          <select
            name="service_name"
            value={service.service_name || ''}
            onChange={(e) => handleChangeSelection(e, index, 'service')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.service_id} value={s.service_name}>
                {s.service_name}
              </option>
            ))}
          </select>
        </td>
        <td className="p-2 border-b">
          <input
            type="number"
            name="service_price"
            value={service.service_price || ''}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Price"
          />
        </td>
        <td className="p-2 border-b">
          <input
            type="number"
            name="service_disc"
            value={service.service_disc || ''}
            onChange={(e) => handleChange(e, index, 'service')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Discount"
          />
        </td>
        <td className="p-2 border-b">
          {(Number(service.service_price) * (1 - Number(service.service_disc) / 100)).toFixed(2)}
        </td>
        <td className="p-2 border-b">
        <button
  type="button"
  onClick={() => removeItem('service', index)}
  className="text-red-500 hover:text-red-700"
>
  Remove
</button>

        </td>
      </tr>
    ))}
    <tr>
      <td colSpan="5" className="p-2 border-t text-right">
      <button
  type="button"
  onClick={() => addItem('service')}
  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
>
  Add Service
</button>
      </td>
    </tr>
  </tbody>
</table>

       {/* Product Details */}
<h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Product Details</h3>
<table className="w-full border border-gray-300 mb-6">
  <thead>
    <tr>
      <th className="p-2 border-b">Product Name</th>
      <th className="p-2 border-b">Product Price</th>
      <th className="p-2 border-b">Quantity</th>
      <th className="p-2 border-b">Discount (%)</th>
      <th className="p-2 border-b">Total Product Price</th>
      <th className="p-2 border-b">Actions</th>
    </tr>
  </thead>
  <tbody>
    {formData.products.map((product, index) => (
      <tr key={index}>
        <td className="p-2 border-b">
          <select
            name="product_name"
            value={product.product_name}
            onChange={(e) => handleChangeSelection(e, index, 'product')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_name}>
                {p.product_name}
              </option>
            ))}
          </select>
        </td>
        <td className="p-2 border-b">
          <input
            type="number"
            name="product_price"
            value={product.product_price || ''}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Price"
          />
        </td>
        <td className="p-2 border-b">
          <input
            type="number"
            name="quantity"
            value={product.quantity || ''}
            onChange={(e) => handleChange(e, index, 'product')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Quantity"
          />
        </td>
        <td className="p-2 border-b">
          <input
            type="number"
            name="product_disc"
            value={product.product_disc || ''}
            onChange={(e) => handleChange(e, index, 'product')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Discount"
          />
        </td>
        <td className="p-2 border-b">
          {(Number(product.product_price) * Number(product.quantity) * (1 - Number(product.product_disc) / 100)).toFixed(2)}
        </td>
        <td className="p-2 border-b">
        <button
  type="button"
  onClick={() => removeItem('product', index)}
  className="text-red-500 hover:text-red-700"
>
  Remove
</button>
        </td>
      </tr>
    ))}
    <tr>
      <td colSpan="6" className="p-2 border-t text-right">
      <button
  type="button"
  onClick={() => addItem('product')}
  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
>
  Add Product
</button>
      </td>
    </tr>
  </tbody>
</table>

        {/* Total Price */}
        <div className="flex justify-end mb-6">
          <span className="text-lg font-semibold">Total Order Price:</span>
          <span className="ml-4 text-lg font-semibold">{calculateTotalOrderPrice().toFixed(2)}</span>
        </div>

        {/* Payment Method & Order Status */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={(e) => handleChange(e)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a payment method</option>
              <option value="Cash">Cash</option>
              <option value="TNG">TNG</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">Order Status</label>
            <select
              name="order_status"
              value={formData.order_status}
              onChange={(e) => handleChange(e)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select an order status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Order Remark */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Order Remark</label>
          <textarea
            name="order_remark"
            value={formData.order_remark}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <ImageUpload
          onImageUpload={handleImageUpload}
          reset={isSubmitted}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
           className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mt-8"
          >
            Add Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrderForm;
