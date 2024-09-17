import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function OrderDashboard() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        order_id: '',
        user_id:'',
        fname: '',
        email: '',
        phone_no: '',
        total_order_price: 0,
        payment_method: '',
        paid_date: '',
        order_status: '',
        order_remark: '',
        services: [],
        products: []
    });
    const [servicesList, setServicesList] = useState([]);
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [ordersData, servicesData, productsData] = await Promise.all([
                    fetchOrders(),
                    fetchServices(),
                    fetchProducts()
                ]);
                setOrders(ordersData);
                setServicesList(servicesData);
                setProductsList(productsData);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };

        loadInitialData();
    }, []);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*');
        if (error) throw error;
        return data;
    };

    const fetchOrderById = async (orderId) => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .single();
        if (error) throw error;

        // Fetch services and products for the order
        const { data: services } = await supabase
            .from('orderservices')
            .select('*')
            .eq('order_id', orderId);
        const { data: products } = await supabase
            .from('orderproducts')
            .select('*')
            .eq('order_id', orderId);

        return { ...data, services, products };
    };

    const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*');
        if (error) throw error;
        return data;
    };

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        if (error) throw error;
        return data;
    };

    const updateOrder = async (orderId, details) => {
        const { error } = await supabase
            .from('orders')
            .update(details)
            .eq('order_id', orderId);
        if (error) throw error;
    };

    const deleteOrder = async (orderId) => {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('order_id', orderId);
        if (error) throw error;
    };

    const deleteOrderService = async (orderId, serviceId) => {
        const { error } = await supabase
            .from('orderservices')
            .delete()
            .eq('order_service_id', serviceId)
            .eq('order_id', orderId);
        if (error) throw error;
    };

    const deleteOrderProduct = async (orderId, productId) => {
        const { error } = await supabase
            .from('orderproducts')
            .delete()
            .eq('order_product_id', productId)
            .eq('order_id', orderId);
        if (error) throw error;
    };

    const handleDeleteOrderService = async (orderId, serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteOrderService(orderId, serviceId);
                // Remove the deleted service from the state
                setOrderDetails(prevState => ({
                    ...prevState,
                    services: prevState.services.filter(service => service.order_service_id !== serviceId)
                }));
                MySwal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Service deleted successfully!',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error('Error deleting service:', error);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete service. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };
    
    const handleDeleteOrderProduct = async (orderId, productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteOrderProduct(orderId, productId);
                // Remove the deleted product from the state
                setOrderDetails(prevState => ({
                    ...prevState,
                    products: prevState.products.filter(product => product.order_product_id !== productId)
                }));
                MySwal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Product deleted successfully!',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error('Error deleting product:', error);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete product. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

   // Function to save a new service to the database
const saveService = async (service) => {
    try {
        const { error } = await supabase
            .from('orderservices')
            .insert([service]);
        if (error) throw error;
        console.log('Service added successfully');
    } catch (error) {
        console.error('Error adding service:', error);
    }
};

// Function to save a new product to the database
const saveProduct = async (product) => {
    try {
        const { error } = await supabase
            .from('orderproducts')
            .insert([product]);
        if (error) throw error;
        console.log('Product added successfully');
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

    const handleViewOrder = async (orderId) => {
        try {
            const order = await fetchOrderById(orderId);
            setSelectedOrder(order);
            setOrderDetails({
                ...order,
                services: order.services || [],
                products: order.products || []
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleEditOrder = () => {
        setEditMode(true);
    };

    const handleServiceChange = (index, e) => {

        console.log('Service Change Event:', e); // Add this line to inspect the event object

        if (!e.target) {
            console.error('e.target is undefined');
            return;
        }

        const { name, value } = e.target; // Extract name and value from the event target
    
        const updatedServices = [...orderDetails.services];
        const service = updatedServices[index] || {};
    
        switch (name) {
            case 'service_name':
                const selectedService = servicesList.find(p => p.service_name === value);
                if (selectedService) {
                    service.service_id = selectedService.service_id;
                    service.service_name = value;
                    service.service_price = selectedService.service_price;
                } else {
                    service.service_id = null;
                    service.service_price = 0;
                }
                break;
            case 'service_disc':
                service.service_disc = Number(value);
                break;
            default:
                break;
        }
    
        service.total_service_price = service.service_price * (1 - (service.service_disc / 100));
    
        updatedServices[index] = service;
    
        setOrderDetails(prevState => ({
            ...prevState,
            services: updatedServices
        }));
    };
    
    
    const handleProductChange = (index, e) => {
        console.log('Product Change Event:', e); // Add this line to inspect the event object

        if (!e.target) {
            console.error('e.target is undefined');
            return;
        }

        const { name, value } = e.target; // Extract name and value from the event target
    
        const updatedProducts = [...orderDetails.products];
        const product = updatedProducts[index] || {};
    
        switch (name) {
            case 'product_name':
                const selectedProduct = productsList.find(p => p.product_name === value);
                if (selectedProduct) {
                    product.product_id = selectedProduct.product_id;
                    product.product_name = value;
                    product.product_price = selectedProduct.product_price;
                } else {
                    product.product_id = null;
                    product.product_price = 0;
                }
                break;
            case 'quantity':
                product.quantity = Number(value);
                break;
            case 'product_disc':
                product.product_disc = Number(value);
                break;
            default:
                break;
        }
    
        product.total_product_price = product.product_price * product.quantity * (1 - (product.product_disc / 100));
    
        updatedProducts[index] = product;
    
        setOrderDetails(prevState => ({
            ...prevState,
            products: updatedProducts
        }));
    };
    

    const handleSaveOrder = async (e) => {
        e.preventDefault();
        const totalOrderPrice = calculateTotalOrderPrice();
    
        const newOrderDetails = {
            ...orderDetails,
            total_order_price: totalOrderPrice,
        };
    
        try {
            // Separate services and products into new and existing
            const servicesToUpdate = orderDetails.services.filter(service => service.order_service_id);
            const servicesToAdd = orderDetails.services.filter(service => !service.order_service_id);
        
            const productsToUpdate = orderDetails.products.filter(product => product.order_product_id);
            const productsToAdd = orderDetails.products.filter(product => !product.order_product_id);
        
            // Save new services and products to get their IDs
            const savedServices = await Promise.all(servicesToAdd.map(service => saveService(service)));
            const savedProducts = await Promise.all(productsToAdd.map(product => saveProduct(product)));
        
            // Combine updated services and products with the newly added ones
            const allServices = [
                ...servicesToUpdate,
                ...savedServices
            ];
        
            const allProducts = [
                ...productsToUpdate,
                ...savedProducts
            ];
        
            // Update order with new details and IDs
            await updateOrder(selectedOrder.order_id, {
                ...newOrderDetails,
                services: allServices,
                products: allProducts
            });
        
            // Update the local state to reflect changes immediately
            setOrders(orders.map(orderItem =>
                orderItem.order_id === selectedOrder.order_id ? { ...orderItem, ...newOrderDetails, services: allServices, products: allProducts } : orderItem
            ));
        
            // Update the selectedOrder state to reflect the changes
            setSelectedOrder({ ...selectedOrder, ...newOrderDetails, services: allServices, products: allProducts });
        
            setEditMode(false);
            MySwal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Order updated successfully!',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error saving order:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update order. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };
    

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteOrder(orderId);
                // Remove the deleted order from the state
                setOrders(orders.filter(order => order.order_id !== orderId));
                setSelectedOrder(null);
                MySwal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Order deleted successfully!',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error('Error deleting order:', error);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete order. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };


    const calculateTotalOrderPrice = () => {
        const servicesTotal = orderDetails.services.reduce((total, service) => total + service.service_price, 0);
        const productsTotal = orderDetails.products.reduce((total, product) => total + (product.product_price * product.quantity), 0);
        return servicesTotal + productsTotal;
    };

    const handleChange = (e) => {
        setOrderDetails({
            ...orderDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleAddService = async () => {
        const newService = { 
            order_id: selectedOrder.order_id, 
            service_id: '', 
            service_name: '', 
            service_price: 0, 
            service_disc: 0 
        };
    
        setOrderDetails(prevDetails => ({
            ...prevDetails,
            services: [
                ...prevDetails.services,
                newService
            ]
        }));
    
        await saveService(newService);
    };
    
    const handleAddProduct = async () => {
        const newProduct = { 
            order_id: selectedOrder.order_id, 
            product_id: '', 
            product_name: '', 
            product_price: 0, 
            quantity: 1, 
            product_disc: 0 
        };
    
        setOrderDetails(prevDetails => ({
            ...prevDetails,
            products: [
                ...prevDetails.products,
                newProduct
            ]
        }));
    
        await saveProduct(newProduct);
    };
      
    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            // Convert string to Date object if necessary
            date = new Date(date);
        }
        
        if (isNaN(date.getTime())) {
            // Handle invalid Date
            return '';
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };    

    return (
        <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Order Dashboard</h1>
    
    {!selectedOrder ? (
          <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-purple-300 text-balck text-left uppercase text-sm leading-normal">
                <tr >
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Phone No</th>
                    <th className="py-3 px-4">Total Price</th>
                    <th className="py-3 px-4">Paid Date</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4">Actions</th>
                </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
                {orders.map(order => (
                    <tr key={order.order_id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-4 text-left whitespace-nowrap">{order.order_id}</td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">{formatDate(order.order_created_date)}</td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">{order.fname}</td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">{order.phone_no}</td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">{order.total_order_price}</td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">{formatDate(order.paid_date)}</td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">{order.order_status}</td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">
                            <button
                                className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 mr-2"
                                onClick={() => handleViewOrder(order.order_id)}
                            >
                                View
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                onClick={() => handleDeleteOrder(order.order_id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    ) : (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <div>
                    <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2"
                        onClick={handleEditOrder}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-gray-500 text-white px-3 py-1 rounded  hover:bg-gray-600 mr-2"
                        onClick={() => setSelectedOrder(null)}
                    >
                        Back to Order List
                    </button>
                </div>
            </div>

            <form onSubmit={handleSaveOrder}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 font-medium">Customer Name</label>
                        <input
                            type="text"
                            name="fname"
                            value={orderDetails.fname}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            disabled={!editMode}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={orderDetails.email}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            disabled={!editMode}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Phone No</label>
                        <input
                            type="text"
                            name="phone_no"
                            value={orderDetails.phone_no}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            disabled={!editMode}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Total Order Price</label>
                        <input
                            type="number"
                            name="total_order_price"
                            value={orderDetails.total_order_price}
                            className="border border-gray-300 p-2 rounded w-full"
                            disabled
                        />
                    </div>
                    <div>
    <label className="block mb-1 font-medium">Payment Method</label>
    {editMode ? (
        <select
            name="payment_method"
            value={orderDetails.payment_method}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
        >
            <option value="Cash">Cash</option>
            <option value="TNG">TNG</option>
            <option value="Credit Card">Credit Card</option>
        </select>
    ) : (
        <input
            type="text"
            name="payment_method"
            value={orderDetails.payment_method}
            className="border border-gray-300 p-2 rounded w-full"
            disabled
        />
    )}
</div>
                    <div>
                        <label className="block mb-1 font-medium">Paid Date</label>
                        <input
                            type="date"
                            name="paid_date"
                            value={orderDetails.paid_date}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            disabled={!editMode}
                        />
                    </div>
                    <div>
    <label className="block mb-1 font-medium">Order Status</label>
    {editMode ? (
        <select
            name="order_status"
            value={orderDetails.order_status}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
        >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
        </select>
    ) : (
        <input
            type="text"
            name="order_status"
            value={orderDetails.order_status}
            className="border border-gray-300 p-2 rounded w-full"
            disabled
        />
    )}
</div>
                    <div>
                        <label className="block mb-1 font-medium">Order Remark</label>
                        <textarea
                            name="order_remark"
                            value={orderDetails.order_remark}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            rows="3"
                            disabled={!editMode}
                        ></textarea>
                    </div>
                </div>

       {/* Order Services Table */}
       <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Order Services</h3>
                    {editMode && (
                        <button
                            type="button"
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                            onClick={handleAddService}
                        >
                            Add Service
                        </button>
                    )}
                    <table className="min-w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-pink-500 text-white text-left uppercase">
                                <th className="p-4">Service Name</th>
                                <th className="p-4">Service Price</th>
                                <th className="p-4">Discount (%)</th>
                                <th className="p-4">Total Price</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.services.map((service, index) => (
                                <tr key={service.order_service_id} className="border-t">
                                    <td className="p-4">
                                        {editMode ? (
                                            <select
                                                name="service_name"
                                                value={service.service_name}
                                                onChange={(e) => handleServiceChange(index, e)}
                                                className="border border-gray-300 p-2 rounded w-full"
                                            >
                                                <option value="">Select Service</option>
                                                {servicesList.map(service => (
                                                    <option key={service.service_name} value={service.service_name}>
                                                        {service.service_name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            service.service_name
                                        )}
                                    </td>
                                    <td className="p-4">{service.service_price}</td>
                                    <td className="p-4">
                                        {editMode ? (
                                            <input
                                                type="number"
                                                name="service_disc"
                                                value={service.service_disc}
                                                onChange={(e) => handleServiceChange(index, e)}
                                                className="border border-gray-300 p-2 rounded w-full"
                                            />
                                        ) : (
                                            service.service_disc
                                        )}
                                    </td>
                                    <td className="p-4">{service.total_service_price}</td>
                                    <td className="p-4">
                                        {editMode && (
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteOrderService(selectedOrder.order_id, service.order_service_id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Products Table */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Order Products</h3>
                    {editMode && (
                        <button
                            type="button"
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                            onClick={handleAddProduct}
                        >
                            Add Product
                        </button>
                    )}
                    <table className="min-w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-pink-500 text-white text-left">
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Product Price</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Discount (%)</th>
                                <th className="p-4">Total Price</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.products.map((product, index) => (
                                <tr key={product.order_product_id} className="border-t">
                                    <td className="p-4">
                                        {editMode ? (
                                            <select
                                                name="product_name"
                                                value={product.product_name}
                                                onChange={(e) => handleProductChange(index, e)}
                                                className="border border-gray-300 p-2 rounded w-full"
                                            >
                                                <option value="">Select Product</option>
                                                {productsList.map(product => (
                                                    <option key={product.product_name} value={product.product_name}>
                                                        {product.product_name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            product.product_name
                                        )}
                                    </td>
                                    <td className="p-4">{product.product_price}</td>
                                    <td className="p-4">
                                        {editMode ? (
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={product.quantity}
                                                onChange={(e) => handleProductChange(index, e)}
                                                className="border border-gray-300 p-2 rounded w-full"
                                            />
                                        ) : (
                                            product.quantity
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editMode ? (
                                            <input
                                                type="number"
                                                name="product_disc"
                                                value={product.product_disc}
                                                onChange={(e) => handleProductChange(index, e)}
                                                className="border border-gray-300 p-2 rounded w-full"
                                            />
                                        ) : (
                                            product.product_disc
                                        )}
                                    </td>
                                    <td className="p-4">{product.total_product_price}</td>
                                    <td className="p-4">
                                        {editMode && (
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteOrderProduct(selectedOrder.order_id, product.order_product_id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editMode && (
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="bg-purple-500 text-white px-3 py-1 rounded"
                        >
                            Save Order
                        </button>
                    </div>
                )}
            </form>
        </div>
    )}
</div>
    );
}

export default OrderDashboard;
    