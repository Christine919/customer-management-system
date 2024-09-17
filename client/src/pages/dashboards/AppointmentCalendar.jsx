import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaEye, FaEdit, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [value, setValue] = useState(new Date());
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select();

      if (error) {
        console.error("Error fetching appointments:", error);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch appointments.',
        });
      }

      if (data) {
        setAppointments(data);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const filteredAppointments = appointments.filter((app) => {
      const appointmentDate = new Date(app.app_date);
      return appointmentDate.toDateString() === value.toDateString();
    });
    setSelectedAppointments(filteredAppointments);
  }, [value, appointments]);

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setEditMode(false);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { app_date, app_time, remark, app_status, app_id } = selectedAppointment;

    const { data, error } = await supabase
      .from('appointments')
      .update({ app_date, app_time, remark, app_status })
      .eq('app_id', app_id);

    if (error) {
      console.error("Error updating appointment:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update appointment.',
      });
      return;
    }
    if(data){
        setAppointments(data);
        MySwal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Appointment updated successfully!',
        });
    }

    setEditMode(false);
    setSelectedAppointment(null);
    setAppointments((prev) =>
      prev.map((app) => (app.app_id === app_id ? { ...app, app_date, app_time, remark, app_status } : app))
    );
  };

  const handleDelete = async (appointmentId) => {
    // Validate that appointmentId is provided
    if (!appointmentId) {
        console.error('No appointmentId provided');
        return;
    }

    // Confirm deletion with user
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
            try {
                // Attempt to delete the appointment
                const { error } = await supabase
                    .from('appointments')
                    .delete()
                    .eq('app_id', appointmentId);

                if (error) {
                    throw error;
                }

                // Notify user of success
                MySwal.fire('Deleted!', 'Appointment has been deleted.', 'success');

                // Update local state
                setAppointments((prev) => prev.filter((app) => app.app_id !== appointmentId));
                setSelectedAppointment(null);
            } catch (error) {
                // Handle errors
                console.error("Error deleting appointment:", error);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete appointment.',
                });
            }
        }
    });
};
  
    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Appointment Calendar</h2>
          <div className="flex">
            <div className="w-full max-w-sm mx-auto">
              <Calendar
                onChange={setValue}
                value={value}
                tileClassName={({ date }) => {
                  const hasAppointment = appointments.some(
                    (app) => new Date(app.app_date).toDateString() === date.toDateString()
                  );
                  return hasAppointment ? 'bg-pink-200 text-pink-800 rounded-lg shadow-lg' : null;
                }}
                className="border rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow duration-300"
              />
            </div>
            <div className="ml-6 w-full">
              <h3 className="text-xl font-semibold mb-2">Appointments for {value.toDateString()}</h3>
              {selectedAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {selectedAppointments.map((app) => (
                    <li key={app.app_id} className="p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow duration-300">
                      <p><strong className="font-medium">Customer:</strong> {app.fname} {app.lname}</p>
                      <p><strong className="font-medium">Phone No:</strong> {app.phone_no}</p>
                      <p><strong className="font-medium">Date:</strong> {new Date(app.app_date).toLocaleDateString()}</p>
                      <p><strong className="font-medium">Time:</strong> {app.app_time}</p>
                      <p className="flex items-center">
                        <strong className="font-medium">Status:</strong> 
                        {app.app_status === 'Scheduled' && <FaClock className="text-yellow-500 ml-2" />}
                        {app.app_status === 'Completed' && <FaCheck className="text-green-500 ml-2" />}
                        {app.app_status === 'Cancelled' && <FaTimes className="text-red-500 ml-2" />}
                        <span className="ml-2">{app.app_status}</span>
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <button onClick={() => handleView(app)} className="bg-pink-500 text-white py-1 px-3 rounded-md hover:bg-pink-600 transition-colors duration-300">
                          <FaEye className="inline-block mr-1" /> View
                        </button>
                        <button onClick={() => handleEdit(app)} className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition-colors duration-300">
                          <FaEdit className="inline-block mr-1" /> Edit
                        </button>
                        <button onClick={() => handleDelete(app.app_id)} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors duration-300">
                          <FaTimes className="inline-block mr-1" /> Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No appointments for this day.</p>
              )}
            </div>
          </div>
      
          {selectedAppointment && (
            <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">{editMode ? 'Edit Appointment' : 'View Appointment'}</h3>
              <div>
                <p><strong className="font-medium">Customer:</strong> {selectedAppointment.fname} {selectedAppointment.lname}</p>
                <p><strong className="font-medium">Phone No:</strong> {selectedAppointment.phone_no}</p>
                <p><strong className="font-medium">Date:</strong> <input type="date" name="app_date" value={selectedAppointment.app_date.split('T')[0]} onChange={handleChange} disabled={!editMode} className="border rounded-md p-1" /></p>
                <p><strong className="font-medium">Time:</strong> <input type="time" name="app_time" value={selectedAppointment.app_time} onChange={handleChange} disabled={!editMode} className="border rounded-md p-1" /></p>
                <p><strong className="font-medium">Status:</strong> <select name="app_status" value={selectedAppointment.app_status} onChange={handleChange} disabled={!editMode} className="border rounded-md p-1">
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select></p>
                <p><strong className="font-medium">Remark:</strong> <textarea name="remark" value={selectedAppointment.remark} onChange={handleChange} disabled={!editMode} className="w-full p-2 border rounded-md mt-2" /></p>
                {editMode && (
                  <button onClick={handleSave} className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 mt-4 transition-colors duration-300">
                    Save
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      );      
};

export default AppointmentCalendar;
