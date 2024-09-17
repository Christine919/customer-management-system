import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const ProductsList = () => {
    const navigate = useNavigate(); 
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        product_price: '',
        stock: '',
    });
    const [editProduct, setEditProduct] = useState(null);

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

        const { product_name, product_price, stock } = newProduct;

        const { data, error, status } = await supabase
            .from('products')
            .insert([{ product_name, product_price, stock }]);

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
                    });
                    navigate(0); // Optional: use navigate(0) to reload if needed
                }
            });
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
    
        if (!editProduct) return;
    
        const { product_id, product_name, product_price, stock } = editProduct;
    
        try {
            // Update the product in Supabase
            const { error } = await supabase
                .from('products')
                .update({ product_name, product_price, stock })
                .eq('product_id', product_id);
    
            if (error) {
                throw error;
            }
    
            // Update state with the new product data
            setProducts(prev =>
                prev.map(product =>
                    product.product_id === product_id
                        ? { ...product, product_name, product_price, stock }
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Products List</h1>
            <div className="p-4 bg-white shadow-md rounded-lg mb-6">
                <h2 className="text-xl font-medium mb-2">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <div className="flex items-end gap-4 mb-4">
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
                    <div>
                        {editProduct ? (
                            <button onClick={handleEditProduct} className="bg-purple-500 text-white py-1 px-3 rounded-md hover:bg-purple-600">
                                Update
                            </button>
                        ) : (
                            <button onClick={handleAddProduct} className="bg-purple-500 text-white py-1 px-3 rounded-md hover:bg-purple-600">
                                Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead className="bg-gray-200 text-sm leading-normal rounded-lg">
                        <tr className="bg-purple-300 text-black uppercase text-left">
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Price</th>
                            <th className="py-3 px-4 text-left">Stock</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                        {products.length > 0 ? (
                            products.map(product => (
                                product && product.product_id ? (
                                    <tr key={product.product_id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-4 text-left whitespace-nowrap">{product.product_id}</td>
                                        <td className="py-3 px-4 text-left whitespace-nowrap">{product.product_name}</td>
                                        <td className="py-3 px-4 text-left whitespace-nowrap">{product.product_price}</td>
                                        <td className="py-3 px-4 text-left whitespace-nowrap">{product.stock}</td>
                                        <td className="py-3 px-4 text-left whitespace-nowrap">
                                            <button
                                                onClick={() => setEditProduct(product)}
                                                className="text-blue-500 hover:text-blue-700 mx-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.product_id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ) : null
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-3 px-4 text-center">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsList;
