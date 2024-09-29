import React, { useState } from "react";
import supabase from '../config/supabaseClient';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import Swal from sweetalert2
import withReactContent from 'sweetalert2-react-content'; // Import SweetAlert2 with React support

const MySwal = withReactContent(Swal);

const NewCustomerForm = () => {
    const navigate = useNavigate(); // For redirection
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        date_of_birth: "",
        phone_no: "",
        email: "",
        address: "",
        city: "",
        postcode: "",
        country: "",
        sickness: "",
        sex: "",
        pregnant: "",
        remark: "",
        stratum_corneum: "",
        skin_type: "",
        skincare_program: "",
        micro_surgery: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    const { 
        fname, lname, date_of_birth, phone_no, email, address, 
        city, postcode, country, sickness, sex, pregnant, 
        remark, stratum_corneum, skin_type, skincare_program, micro_surgery 
    } = formData;

    // Insert customer data into the Supabase 'customers' table
    const { data, error, status } = await supabase
        .from('customers')
        .insert([{
            fname,
            lname,
            date_of_birth,
            phone_no,
            email,
            address,
            city,
            postcode,
            country,
            sickness,
            sex,
            pregnant,
            remark,
            stratum_corneum,
            skin_type,
            skincare_program,
            micro_surgery,
        }]);

    // Handle response based on the status and error
    if (error) {
        // Check if the error is related to unique constraint violation
        let errorMessage = 'Please fill in all the fields correctly.';
        if (error.message.includes('unique constraint')) {
            if (error.message.includes('phone_no')) {
                errorMessage = 'Duplicated phone number';
            } else if (error.message.includes('email')) {
                errorMessage = 'Duplicated email';
            }
        }
        MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'Try Again'
        });
    } else if (status === 201) { // Check if the status is a success code (201 - Created)
        console.log("Success:", data);
        MySwal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Customer added successfully!',
            confirmButtonText: 'OK'
        }).then(() => {
            // Reset form fields after success alert is closed
            setFormData({
                fname: "",
                lname: "",
                date_of_birth: "",
                phone_no: "",
                email: "",
                address: "",
                city: "",
                postcode: "",
                country: "",
                sickness: "",
                sex: "",
                pregnant: "",
                remark: "",
                stratum_corneum: "",
                skin_type: "",
                skincare_program: "",
                micro_surgery: "",
            });
            navigate('/backend/customers'); // Optional: Redirect after successful submit
        });
    } else {
        console.log("Unexpected response:", data, status);
    }
};

    return (
        <form
            onSubmit={handleSubmit}
            className="frontend flex flex-col justify-center items-center min-h-screen bg-gray-100 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        >

      <h2 className="text-3xl font-bold uppercase mb-8 text-center text-gray-800">
        General Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="mb-4">
          <label htmlFor="fname" className="block text-gray-700 font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lname" className="block text-gray-700 font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date_of_birth" className="block text-gray-700 font-medium mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone_no" className="block text-gray-700 font-medium mb-2">
            Phone No
          </label>
          <input
            type="text"
            id="phone_no"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="postcode" className="block text-gray-700 font-medium mb-2">
            Postcode
          </label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700 font-medium mb-2">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="sickness" className="block text-gray-700 font-medium mb-2">
            History Sickness
          </label>
          <input
            type="text"
            id="sickness"
            name="sickness"
            value={formData.sickness}
            onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                required
              />
              <span className="ml-2">Male</span>
            </label>
          </div>
        </fieldset>

        {/* Pregnant/Breastfeeding */}
        <fieldset className="mb-4">
          <legend className="block text-gray-700 font-medium mb-2">
            Pregnant/Breastfeeding
          </legend>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="pregnant"
                value="Yes"
                checked={formData.pregnant === "Yes"}
                onChange={handleChange}
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
                onChange={handleChange}
                required
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        <div className="mb-4 col-span-2">
          <label htmlFor="remark" className="block text-gray-700 font-medium mb-2">
            Remark
          </label>
          <textarea
            id="remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
          ></textarea>
        </div>
      </div>

      <hr className="my-8 w-full border-gray-300" />

      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        GENERAL SKIN CONDITION
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="mb-4">
          <label htmlFor="stratum_corneum" className="block text-gray-700 font-medium mb-2">
            Stratum Corneum
          </label>
          <select
            name="stratum_corneum"
            value={formData.stratum_corneum}
            onChange={handleChange}
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
          <label htmlFor="skin_type" className="block text-gray-700 font-medium mb-2">
            Skin Type
          </label>
          <select
            name="skin_type"
            value={formData.skin_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
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
          <label htmlFor="skincare_program" className="block text-gray-700 font-medium mb-2">
            Previous Skin-Care Program
          </label>
          <select
            name="skincare_program"
            value={formData.skincare_program}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Laser">Laser</option>
            <option value="Machine Treatment">Machine Treatment</option>
            <option value="Pigmentation/Acne treatment">
              Pigmentation/Acne treatment
            </option>
          </select>
        </div>

        <div className="mb-4 col-span-3">
          <label htmlFor="micro_surgery" className="block text-gray-700 font-medium mb-2">
          Have you undergone any microsurgery before? If so, please fill in the following details.
          </label>
          <input
            type="text"
            id="micro_surgery"
            name="micro_surgery"
            value={formData.micro_surgery}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mt-8"
      >
        Add Customer
      </button>
    </form>
  );
};

export default NewCustomerForm;
