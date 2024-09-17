import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch customers on component load
  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('customers')
        .select();

      if (error) {
        console.error("Error fetching customers:", error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch customers.',
        });
      } else if (data) {
        setCustomers(data);
      }
    };

    fetchCustomers();
  }, []);

  // View customer details and fetch their orders
  const handleView = async (user_id) => {
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select()
      .eq('user_id', user_id)
      .single();

    if (customerError) {
      console.error("Error fetching customer details:", customerError);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: `No customer found with this ID`,
      });
    } else {
      setViewCustomer(customerData);

      // Fetch orders for the customer
      setLoadingOrders(true);
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select()
        .eq('user_id', user_id);

      if (orderError) {
        console.error("Error fetching orders:", orderError);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch customer orders.',
        });
      } else {
        setOrders(orderData);
      }
      setLoadingOrders(false);
    }
  };

  // Edit customer details
  const handleEditClick = (customer) => {
    setEditCustomer(customer);
    setFormData(customer); // Populate formData with customer details for editing
  };

  const handleEditCustomer = async () => {
    if (!editCustomer) return;
  
    const { user_id } = editCustomer;
    const {
      fname, lname, date_of_birth, phone_no, email, address, city, postcode, country,
      sickness, sex, pregnant, remark, stratum_corneum, skin_type, skincare_program, micro_surgery
    } = formData;
  
    try {
      const { error } = await supabase
        .from('customers') 
        .update({
          fname, lname, date_of_birth, phone_no, email, address, city, postcode, country,
          sickness, sex, pregnant, remark, stratum_corneum, skin_type, skincare_program, micro_surgery
        })
        .eq('user_id', user_id);
  
      if (error) {
        throw error;
      }
  
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.user_id === user_id
            ? { ...customer, ...formData }
            : customer
        )
      );
  
      // Show SweetAlert with the option to stay until confirmation
      await MySwal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Customer updated successfully!',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing by clicking outside
        allowEscapeKey: false, // Prevent closing with escape key
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/backend/customers');
        }
      });
  
      setEditCustomer(null); // Clear edit state after user confirmation
    } catch (error) {
      console.error("Error updating customer:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update customer.',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  };  

  const handleDeleteCustomer = async (user_id) => {
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
          .from('customers')
          .delete()
          .eq('user_id', user_id);

        if (error) {
          console.error("Error deleting customer:", error);
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete customer.',
          });
        } else {
          setCustomers(prev => prev.filter(customer => customer.user_id !== user_id));
          MySwal.fire('Deleted!', 'Customer has been deleted.', 'success');
        }
      }
    });
};

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditCustomer(null);
    setFormData({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-white-800">Customers</h2>

      {!viewCustomer && !editCustomer && (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-purple-300 text-left text-white-500 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Phone No</th>
                <th className="py-3 px-4">Date Of Birth</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {customers.map((customer) => (
                <tr key={customer.user_id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4 text-left whitespace-nowrap">{customer.user_id}</td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">{customer.fname}</td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">{customer.phone_no}</td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">{formatDate(customer.date_of_birth)}</td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    <button
                      className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 mr-2"
                      onClick={() => handleView(customer.user_id)}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      onClick={() => handleDeleteCustomer(customer.user_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Customer Details */}
      {viewCustomer && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-md">
          <h3 className="text-xl font-bold mb-4">Customer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(viewCustomer).map(([key, value]) => (
              <div key={key}>
                <label className="block text-gray-700 capitalize">{key.replace(/_/g, ' ')}</label>
                <p className="text-gray-800">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => setViewCustomer(null)}
            >
              Close
            </button>
          </div>

          {/* Orders Section */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Customer Orders</h4>
            {loadingOrders ? (
              <p className="text-center text-gray-600">Loading orders...</p>
            ) : orders.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-300 shadow-md">
                <thead className="bg-purple-300 text-left text-white-500 uppercase text-sm leading-normal">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Total Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {orders.map((order) => (
                    <tr key={order.order_id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-4 text-left whitespace-nowrap">{order.order_id}</td>
                      <td className="py-3 px-4 text-left whitespace-nowrap">RM {order.total_order_price}</td>
                      <td className="py-3 px-4 text-left whitespace-nowrap">{order.order_status}</td>
                      <td className="py-3 px-4 text-left whitespace-nowrap">
                        <button
                          className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600"
                          onClick={() => navigate(`/backend/orders/${order.order_id}`)}
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No orders found for this customer.</p>
            )}
          </div>
        </div>
      )}

      {/* Edit Customer */}
      {editCustomer && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-md">
          <h3 className="text-xl font-bold mb-4">Edit Customer</h3>
          <form onSubmit={handleEditCustomer}>
            {/* Add form fields for editing customer details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Map over formData to generate inputs dynamically */}
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-gray-700 capitalize">{key.replace(/_/g, ' ')}</label>
                  <input
                    type="text"
                    name={key}
                    value={value || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Customers;
