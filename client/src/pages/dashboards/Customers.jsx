import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  const formatDate = (date) => {
    if (!date) return ''; // Return empty string if date is null/undefined
    
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    if (isNaN(date.getTime())) {
      return ''; // Return empty string for invalid dates
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };    

  return (
    <div className="container mx-auto p-4">
     <div className='flex flex-col pb-4'>
     <h2 className="flex-none w-20 text-2xl font-bold mb-4 text-white-800">Clients</h2>
     <Link to={'new-customer'} className="flex-none w-20 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
     Add
     </Link>
     </div>

      {!viewCustomer && !editCustomer && (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-gray-200 text-left text-white-500 uppercase text-sm leading-normal">
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
                      className="text-blue-500 font-semibold px-3 py-1 hover:text-blue-700"
                      onClick={() => handleView(customer.user_id)}
                    >
                      View
                    </button>
                    <button
                      className="text-yellow-500 font-semibold px-3 py- hover:text-yellow-700"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 font-semibold px-3 py-1 hover:text-red-600"
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
  <div className="mt-6 p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
    <h3 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">Details</h3>
    
    {/* Customer Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {Object.entries(viewCustomer).map(([key, value]) => (
        <div key={key} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <label className="block text-gray-700 font-medium capitalize mb-1">
            {key.replace(/_/g, ' ')}
          </label>
          <p className="text-gray-800 font-semibold">{value}</p>
        </div>
      ))}
    </div>

    {/* Close Button */}
    <div className="mb-6 text-center">
      <button
        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
        onClick={() => setViewCustomer(null)}
      >
        Close
      </button>
    </div>

    {/* Orders Section */}
    <div>
      <h4 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Customer Orders</h4>
      {loadingOrders ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-purple-500 text-white uppercase text-sm">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Paid Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {orders.map((order) => (
                <tr key={order.order_id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{order.order_id}</td>
                  <td className="py-3 px-4">RM {order.total_order_price}</td>
                  <td className="py-3 px-4">{order.payment_method}</td>
                  <td className="py-3 px-4">{formatDate(order.paid_date)}</td>
                  <td className="py-3 px-4">{order.order_status}</td>
                  <td className="py-3 px-4">
                                <Link to={`/orders/${order.order_id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View Order
                                </Link>
                            </td>
                </tr>
              ))}
            </tbody>  
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No orders found for this customer.</p>
      )}
    </div>
  </div>
)}


      {/* Edit Customer */}
      {editCustomer && (
  <div className="mt-6 p-4 bg-white shadow-md rounded-md max-w-3xl mx-auto">
    <form onSubmit={handleEditCustomer}>
      {/* General Information */}
      <h2 className="text-3xl font-bold uppercase mb-8 text-center text-gray-800 mt-4">General Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-8">
        <div className="mb-4">
          <label htmlFor="fname" className="block text-gray-700 font-medium mb-2">First Name</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lname" className="block text-gray-700 font-medium mb-2">Last Name</label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date_of_birth" className="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone_no" className="block text-gray-700 font-medium mb-2">Phone No</label>
          <input
            type="text"
            id="phone_no"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="postcode" className="block text-gray-700 font-medium mb-2">Postcode</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="sickness" className="block text-gray-700 font-medium mb-2">History of Sickness</label>
          <input
            type="text"
            id="sickness"
            name="sickness"
            value={formData.sickness}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Sex */}
        <fieldset className="mb-4">
          <legend className="block text-gray-700 font-medium mb-2">Sex</legend>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sex"
                value="Female"
                checked={formData.sex === "Female"}
                onChange={handleInputChange}
                required
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="sex"
                value="Male"
                checked={formData.sex === "Male"}
                onChange={handleInputChange}
                required
              />
              <span className="ml-2">Male</span>
            </label>
          </div>
        </fieldset>

        {/* Pregnant/Breastfeeding */}
        <fieldset className="mb-4">
          <legend className="block text-gray-700 font-medium mb-2">Pregnant/Breastfeeding</legend>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="pregnant"
                value="Yes"
                checked={formData.pregnant === "Yes"}
                onChange={handleInputChange}
                required
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="pregnant"
                value="No"
                checked={formData.pregnant === "No"}
                onChange={handleInputChange}
                required
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        <div className="mb-4 col-span-2">
          <label htmlFor="remark" className="block text-gray-700 font-medium mb-2">Remark</label>
          <textarea
            id="remark"
            name="remark"
            value={formData.remark}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
          ></textarea>
        </div>
      </div>

      <hr className="my-8 w-full border-gray-300" />

      {/* Skin Condition */}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">General Skin Condition</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-6">
        <div className="mb-4">
          <label htmlFor="stratum_corneum" className="block text-gray-700 font-medium mb-2">Stratum Corneum</label>
          <select
            name="stratum_corneum"
            value={formData.stratum_corneum}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="Normal">Normal</option>
            <option value="Thin">Thin</option>
            <option value="Thick">Thick</option>
            <option value="Moderate">Moderate</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="skin_type" className="block text-gray-700 font-medium mb-2">Skin Type</label>
          <select
            name="skin_type"
            value={formData.skin_type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="Normal">Normal</option>
            <option value="Dry">Dry</option>
            <option value="Oily">Oily</option>
            <option value="Sensitive">Sensitive</option>
            <option value="Combination">Combination</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="skincare_program" className="block text-gray-700 font-medium mb-2">Previous Skin-Care Program</label>
          <select
            name="skincare_program"
            value={formData.skincare_program}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Laser">Laser</option>
            <option value="Machine Treatment">Machine Treatment</option>
            <option value="Pigmentation/Acne treatment">Pigmentation/Acne treatment</option>
          </select>
        </div>
      </div>

      <div className="text-center my-4">
      <button
        type="submit"
        className="bg-pink-500 text-white px-8 py-2 rounded-md hover:bg-pink-600"
      >
        Save
      </button>

      <button
                type="button"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 ml-2"
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
