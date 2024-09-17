import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const ServicesList = () => {
  const navigate = useNavigate(); 
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ service_name: '', service_price: '' });
  const [editService, setEditService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select();

        if (error) {
            console.error("Error fetching services:", error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch services.',
            });
        } else if (data) {
            setServices(data);
        }
    };

    fetchServices();
}, []);

const handleAddService = async (e) => {
    e.preventDefault();

    const { service_name, service_price } = newService;

    const { data, error, status } = await supabase
        .from('services')
        .insert([{  service_name, service_price }]);

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
            text: 'Service added successfully!',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                setServices(prev => [...prev, ...data]);
                setNewService({
                    service_name: '',
                    service_price: '',
                });
                navigate(0); // Optional: use navigate(0) to reload if needed
            }
        });
    }
};

const handleEditService = async (e) => {
    e.preventDefault();

    if (!editService) return;

    const { service_id, service_name, service_price } = editService;

    try {
        // Update the product in Supabase
        const { error } = await supabase
            .from('services')
            .update({ service_name, service_price })
            .eq('service_id', service_id);

        if (error) {
            throw error;
        }

        // Update state with the new product data
        setServices(prev =>
            prev.map(service =>
                service.service_id === service_id
                    ? { ...service, service_name, service_price }
                    : service
            )
        );

        // Show success message and redirect
        await MySwal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Service updated successfully!',
            confirmButtonText: 'OK'
        });

        // Clear the edit state
        setEditService(null);

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

const handleDeleteService = async (service_id) => {
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
          .from('services')
          .delete()
          .eq('service_id', service_id);

        if (error) {
          console.error("Error deleting service:", error);
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete service.',
          });
        } else {
          setServices(prev => prev.filter(service => service.service_id !== service_id));
          MySwal.fire('Deleted!', 'Service has been deleted.', 'success');
        }
      }
    });
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Services List</h1>
      <div className="p-4 bg-white shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-medium mb-2">{editService ? 'Edit Service' : 'Add Service'}</h2>
       
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Service Name"
              value={editService ? editService.service_name : newService.service_name}
              onChange={(e) => {
                const value = e.target.value;
                if (editService) {
                  setEditService({ ...editService, service_name: value });
                } else {
                  setNewService({ ...newService, service_name: value });
                }
              }}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Price"
              value={editService ? editService.service_price : newService.service_price}
              onChange={(e) => {
                const value = e.target.value;
                if (editService) {
                  setEditService({ ...editService, service_price: value });
                } else {
                  setNewService({ ...newService, service_price: value });
                }
              }}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            {editService ? (
              <button onClick={handleEditService} className="bg-purple-500 text-white py-1 px-3 rounded-md hover:bg-purple-600">
                Update
              </button>
            ) : (
              <button onClick={handleAddService} className="bg-purple-500 text-white py-1 px-3 rounded-md hover:bg-purple-600">
                Add
              </button>
            )}
          </div>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead className="bg-purple-300 text-white-600 uppercase text-sm leading-normal">
          <tr className="border-b">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white-700 text-sm font-light">
          {services.length > 0 ? (
            services.map(service => (
              <tr key={service.service_id} className="border-b">
                <td className="p-2">{service.service_id}</td>
                <td className="p-2">{service.service_name}</td>
                <td className="p-2">${service.service_price}</td>
                <td className="p-2">
                  <button onClick={() => setEditService(service)} className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteService(service.service_id)} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-2 text-center">No services available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesList;
