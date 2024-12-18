import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import Modal from '../components/Modal';
import SignaturePad from './SignaturePad';
import Swal from 'sweetalert2'; 
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

export default function ViewOrder() {
    const { order_id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState({
        order_id: '',
        user_id: '',
        fname: '',
        email: '',
        phone_no: '',
        total_order_price: 0,
        payment_method: '',
        paid_date: '',
        order_status: '',
        order_remark: '',
        services: [],
        products: [],
        photos: [],
        signature: null,
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    order_id, user_id, fname, email, phone_no, total_order_price, payment_method,
                    paid_date, order_status, order_remark, photos, signature,
                    orderservices(service_name, service_price, total_service_price),
                    orderproducts(product_name, product_price, quantity, total_product_price)
                `)
                .eq('order_id', order_id)
                .single();

            if (error) {
                console.log(error);
                setLoading(false);
                return;
            }

            if (data.signature) {
                // Generate a signed URL for the signature
                const { data: signedUrlData, error: signedUrlError } = await supabase
                    .storage
                    .from('signatures') // Update this to the correct storage bucket name
                    .createSignedUrl(data.signature.replace('signatures/', ''), 3600); // 3600 seconds = 1 hour

                if (signedUrlError) {
                    console.error('Error generating signed URL:', signedUrlError);
                } else {
                    data.signature = signedUrlData.signedUrl; // Replace the signature URL with the signed URL
                }
            }

            setOrderDetails(data);
            setLoading(false);
        };

        fetchOrder();
    }, [order_id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const handleSignatureUpload = async (signatureUrl) => {
        try {
            // Save signature URL in the database
            const { error } = await supabase
                .from("orders")
                .update({ signature: signatureUrl })
                .eq("order_id", order_id);

                if (error) {
                    console.error("Error saving signature URL:", error);
                    await MySwal.fire({
                        title: "Error!",
                        text: "Failed to save the signature. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                } else {
                    setOrderDetails((prev) => ({ ...prev, signature: signatureUrl }));
                    await MySwal.fire({
                        title: "Success!",
                        text: "Signature saved with the order successfully!",
                        icon: "success",
                        confirmButtonText: "Great!",
                    });
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                await MySwal.fire({
                    title: "Error!",
                    text: "An unexpected error occurred. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        };

    if (loading) {
        return <div>Loading...</div>;
    }

    const openModal = (photoUrl) => {
        setSelectedPhotoUrl(photoUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPhotoUrl('');
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-lg">
                <h2 className="text-3xl font-bold my-10 text-center text-gray-800">Order Details</h2>

                <div className="space-y-4">
                    <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
                    <p><strong>Customer Name:</strong> {orderDetails.fname}</p>
                    <p><strong>Email:</strong> {orderDetails.email}</p>
                    <p><strong>Phone No:</strong> {orderDetails.phone_no}</p>
                    <p><strong>Total Order Price:</strong> RM {orderDetails.total_order_price}</p>
                    <p><strong>Payment Method:</strong> {orderDetails.payment_method}</p>
                    <p><strong>Paid Date:</strong> {orderDetails.paid_date}</p>
                    <p><strong>Order Status:</strong> {orderDetails.order_status}</p>
                    <p><strong>Order Remark:</strong> {orderDetails.order_remark}</p>
                </div>

                {/* Display services */}
                <h3 className="text-2xl font-semibold mt-6 text-gray-700">Services</h3>
                {orderDetails.orderservices?.length > 0 ? (
                    <table className="min-w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-pink-500 text-white text-left uppercase text-sm">
                            <tr>
                                <th className="p-4">Service Name</th>
                                <th className="p-4">Service Price</th>
                                <th className="p-4">Discount (%)</th>
                                <th className="p-4">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {orderDetails.orderservices.map((service, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="p-4">{service.service_name}</td>
                                    <td className="p-4">RM {service.service_price}</td>
                                    <td className="p-4">{service.service_disc || 0}</td>
                                    <td className="p-4">RM {service.total_service_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No services for this order.</p>
                )}

                {/* Display products */}
                <h3 className="text-2xl font-semibold mt-6 text-gray-700">Products</h3>
                {orderDetails.orderproducts?.length > 0 ? (
                    <table className="min-w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-pink-500 text-white text-left uppercase text-sm">
                            <tr>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Product Price</th>
                                <th className="p-4">Discount (%)</th>
                                <th className="p-4">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {orderDetails.orderproducts.map((product, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="p-4">{product.product_name}</td>
                                    <td className="p-4">{product.quantity}</td>
                                    <td className="p-4">RM {product.product_price}</td>
                                    <td className="p-4">{product.product_disc || 0}</td>
                                    <td className="p-4">RM {product.total_product_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No products for this order.</p>
                )}

                {/* Display photos if available */}
                {orderDetails.photos.length > 0 && (
                    <div className="mt-6">
                        <div className="w-full my-light-pink p-4 border border-pink-300 shadow-lg rounded-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Photos</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {orderDetails.photos.map((photo, index) => (
                                    <div key={index} className="relative group cursor-pointer" onClick={() => openModal(photo)}>
                                        <img
                                            src={photo}
                                            alt={`Order photos ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-lg">
                                            <p className="text-white text-lg">Photo {index + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    imageUrl={selectedPhotoUrl}
                />

                {/* Display signature if available */}
                {orderDetails.signature ? (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold">Customer Signature:</h3>
                        <img
                            src={orderDetails.signature}
                            alt="Customer Signature"
                            className="w-64 h-auto border rounded mt-4"
                        />
                    </div>
                ) : (
                    <SignaturePad
                        order_id={orderDetails.order_id}
                        onSignatureUpload={handleSignatureUpload}
                    />
                )}

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(-1)} // Navigate back to the previous page
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}