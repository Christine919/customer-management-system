import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import Modal from '../components/Modal';

const MySwal = withReactContent(Swal);

const ProductsList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        product_price: '',
        stock: '',
        image: []
    });
    const [editProduct, setEditProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select();

            if (error) {
                console.error("Error fetching products:", error);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch products.',
                });
            } else if (data) {
                setProducts(data);
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
    
        const { product_name, product_price, stock, image } = newProduct;
    
        // Check if image is an array; if not, wrap it in an array
        const imageArray = Array.isArray(image) ? image : [image];
    
        const { data, error, status } = await supabase
            .from('products')
            .insert([{ product_name, product_price, stock, image: imageArray }]);
    
        if (error) {
            console.log("Error:", error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: `There was an error: ${error.message || 'Please fill in all the fields correctly.'}`,
                confirmButtonText: 'Try Again'
            });
        } else if (status === 201) {
            console.log("Success:", data);
            MySwal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product added successfully!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    setProducts(prev => [...prev, ...data]);
                    setNewProduct({
                        product_name: '',
                        product_price: '',
                        stock: '',
                        image: [],
                    });
                    navigate(0); // Optional: use navigate(0) to reload if needed
                }
            });
        }
    };
    
    const handleEditProduct = async (e) => {
        e.preventDefault();
    
        if (!editProduct) return;
    
        const { product_id, product_name, product_price, stock, image } = editProduct;
    
        // Check if image is an array; if not, wrap it in an array
        const imageArray = Array.isArray(image) ? image : [image];
    
        try {
            // Update the product in Supabase
            const { error } = await supabase
                .from('products')
                .update({ product_name, product_price, stock, image: imageArray })
                .eq('product_id', product_id);
    
            if (error) {
                throw error;
            }
    
            // Update state with the new product data
            setProducts(prev =>
                prev.map(product =>
                    product.product_id === product_id
                        ? { ...product, product_name, product_price, stock, image: imageArray }
                        : product
                )
            );
    
            // Show success message and redirect
            await MySwal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product updated successfully!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to the product list page
                    navigate('/backend/products');
                }
            });
    
            // Clear the edit state
            setEditProduct(null);
    
        } catch (error) {
            console.error("Error updating product:", error);
    
            // Show error message
            await MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update product.',
            });
        }
    };
    
    const handleCancelEdit = () => {
        setEditProduct(null); // Exit edit mode without saving
        setNewProduct({ product_name: '', product_price: '', stock: '' }); // Reset form inputs
    };

    const handleDeleteProduct = async (product_id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('product_id', product_id);

                if (error) {
                    console.error("Error deleting product:", error);
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete product.',
                    });
                } else {
                    setProducts(prev => prev.filter(product => product.product_id !== product_id));
                    MySwal.fire('Deleted!', 'Product has been deleted.', 'success');
                }
            }
        });
    };

    const handleImageUpload = (uploadedImages) => {
        if (editProduct) {
            setEditProduct({ ...editProduct, image: Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages] });
        } else {
            setNewProduct({ ...newProduct, image: Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages] });
        }
    };

    const openModal = (photoUrl) => {
        setSelectedPhotoUrl(photoUrl);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPhotoUrl('');
    };
    

    return (
        <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Products List</h1>
    <div className="p-4 bg-white shadow-md rounded-lg mb-6">
    <div className='mb-4'>
    <h2 className="text-xl font-medium mb-2">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
               {editProduct ? (
                        <div className="flex space-x-4">
                            <button type="submit" className="bg-yellow-400 py-1 px-6 rounded-md hover:bg-pink-600">
                                Update
                            </button>
                            <button type="button" className="bg-gray-400 py-1 px-6 rounded-md hover:bg-gray-500" onClick={handleCancelEdit}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button type="submit" className="bg-yellow-400 py-1 px-8 rounded-md hover:bg-pink-600">
                            Add
                        </button>
                    )}
            </div>
        <form onSubmit={editProduct ? handleEditProduct : handleAddProduct}>
        <div className="mb-4">
    {/* First Row for Product Name */}
    <div className="flex items-end gap-4 mb-2">
        <div className="flex-1">
            <input
                type="text"
                placeholder="Product Name"
                value={editProduct ? editProduct.product_name : newProduct.product_name}
                onChange={(e) => {
                    const value = e.target.value;
                    if (editProduct) {
                        setEditProduct({ ...editProduct, product_name: value });
                    } else {
                        setNewProduct({ ...newProduct, product_name: value });
                    }
                }}
                className="border border-gray-300 rounded-md p-2 w-full"
            />
        </div>
    </div>
    
    {/* Second Row for Price and Stock */}
    <div className="flex items-end gap-4">
        <div className="flex-1">
            <input
                type="number"
                placeholder="Price"
                value={editProduct ? editProduct.product_price : newProduct.product_price}
                onChange={(e) => {
                    const value = e.target.value;
                    if (editProduct) {
                        setEditProduct({ ...editProduct, product_price: value });
                    } else {
                        setNewProduct({ ...newProduct, product_price: value });
                    }
                }}
                className="border border-gray-300 rounded-md p-2 w-full"
            />
        </div>
        <div className="flex-1">
            <input
                type="number"
                placeholder="Stock"
                value={editProduct ? editProduct.stock : newProduct.stock}
                onChange={(e) => {
                    const value = e.target.value;
                    if (editProduct) {
                        setEditProduct({ ...editProduct, stock: value });
                    } else {
                        setNewProduct({ ...newProduct, stock: value });
                    }
                }}
                className="border border-gray-300 rounded-md p-2 w-full"
            />
        </div>
    </div>
</div>

            <div className="mb-4">
                <ImageUpload onImageUpload={handleImageUpload} />
            </div>
          
        </form>
    </div>
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-gray-200 text-sm leading-normal rounded-lg">
                <tr className="uppercase text-left">
                    <th className="py-3 px-4 ">ID</th>
                    <th className="py-3 px-4 ">Name</th>
                    <th className="py-3 px-4 ">Price</th>
                    <th className="py-3 px-4 ">Stock</th>
                    <th className="py-3 px-4 ">Image</th>
                    <th className="py-3 px-4 ">Actions</th>
                </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
                {products.length > 0 ? (
                    products.map(product => (
                        <tr key={product.product_id} className="border-b border-gray-200">
                            <td className="py-3 px-4">{product.product_id}</td>
                            <td className="py-3 px-4">{product.product_name}</td>
                            <td className="py-3 px-4">RM {product.product_price.toFixed(2)}</td>
                            <td className="py-3 px-4">{product.stock}</td>
                            <td className="py-3 px-4">
                                {Array.isArray(product.image) && product.image.length > 0 ? (
                                    product.image.map((imgUrl, index) => (
                                        <div onClick={() => openModal(imgUrl)}>
                                            <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`${product.product_name} images ${index}`}
                                            className="w-16 h-16 object-cover"
                                        />
                                        </div>
                                        
                                    ))
                                ) : (
                                    <span>No image</span>
                                )}
                            </td>
                            <td className="py-3 px-4 flex space-x-2">
                                <button
                                    onClick={() => setEditProduct(product)}
                                    className="text-blue-500 font-semibold px-3 py-1 hover:text-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.product_id)}
                                    className="text-red-500 font-semibold px-3 py-1 hover:text-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="py-3 px-4 text-center">No products found</td>
                    </tr>
                )}
            </tbody>
        </table>
        <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    imageUrl={selectedPhotoUrl}
                />
    </div>
</div>

    );
};

export default ProductsList;
