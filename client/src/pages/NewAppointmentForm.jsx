import React, { useEffect, useState } from "react";
import supabase from '../config/supabaseClient';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; 
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const NewAppointmentForm = () => {
  const navigate = useNavigate(); // For redirection
  const [formData, setFormData] = useState({
    user_id: '',
    fname: '',
    lname: '',
    phone_no: '',
    app_date: '',
    app_time: '',
    remark: '',
    app_status: '',
  });

  // Fetch customer details by phone number
  useEffect(() => {
    const fetchCustDetailsByPhoneNo = async () => {
      if (formData.phone_no.length > 0) { // Trigger only if phone number is entered
        const { data, error } = await supabase
          .from('customers')
          .select('user_id, fname, lname, phone_no')
          .eq('phone_no', formData.phone_no)
          .single();
        
        if (error) {
          console.log("Error fetching customer details:", error);
        }
        if (data) {
          console.log("Customer found:", data);
          // Update form fields with customer data
          setFormData(prevState => ({
            ...prevState,
            user_id: data.user_id,
            fname: data.fname,
            lname: data.lname,
          }));
        }
      }
    };
    fetchCustDetailsByPhoneNo();
  }, [formData.phone_no]); // Watch for changes in phone number

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      user_id, fname, lname, phone_no, app_date, app_time, remark, app_status
    } = formData;

    const { data, error, status } = await supabase
      .from('appointments')
      .insert([{
        user_id, fname, lname, phone_no, app_date, app_time, remark, app_status
      }]);

    if (error) {
      console.log("Error:", error);

      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: `There was an error: ${error.message || 'Please fill in all the fields correctly.'}`,
        confirmButtonText: 'Try Again'
      });
    }
    if (status === 201) {
      console.log("Success:", data);
      MySwal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Appointment added successfully!',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reset form fields after success
        setFormData({
          user_id: '',
          fname: '',
          lname: '',
          phone_no: '',
          app_date: '',
          app_time: '',
          remark: '',
          app_status: '',
        });
        navigate('/new-appointment');
      });
    }
  };

  return (
    <div className="frontend flex flex-col items-center bg-gray-100 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg form-container">

      <form 
      onSubmit={handleSubmit}
      className="space-y-4 w-full"
      >

      <h2 className="text-3xl font-bold uppercase mb-8 text-center text-gray-800">
        New Appointment Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Customer ID</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Appointment Date</label>
            <input
              type="date"
              name="app_date"
              value={formData.app_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Appointment Time</label>
            <input
              type="time"
              name="app_time"
              value={formData.app_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Remarks</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Appointment Status</label>
            <select
              name="app_status"
              value={formData.app_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mt-8"
        >
          Add Appointment
        </button>
      </form>
    </div>
  );
};

export default NewAppointmentForm;
