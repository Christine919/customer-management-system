import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaEdit, FaTimes, FaPlus, FaRegCalendar } from 'react-icons/fa'; 

const MySwal = withReactContent(Swal);

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [value, setValue] = useState(new Date());
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isNew, setIsNew] = useState(false); 
  const [newAppointment, setNewAppointment] = useState({
    user_id: '',
    fname: '',
    lname: '',
    phone_no: '',
    app_date: '',
    app_time: '',
    remark: '',
    app_status: 'Scheduled', 
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase.from('appointments').select();
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
      appointmentDate.setHours(appointmentDate.getHours() + 8); // Adjust for GMT+8
      const valueDate = new Date(value);
      valueDate.setHours(valueDate.getHours() + 8); // Adjust for GMT+8
      return appointmentDate.toDateString() === valueDate.toDateString();
    });
    setSelectedAppointments(filteredAppointments);
  }, [value, appointments]);

  useEffect(() => {
    const malaysiaDate = new Date(value);
    malaysiaDate.setHours(malaysiaDate.getHours() + 8); // Adjust for GMT+8
    setNewAppointment((prev) => ({ ...prev, app_date: malaysiaDate.toISOString().split('T')[0] }));
  }, [value]);

  const fetchUserByPhoneNo = async (phone_no) => {
    const { data, error } = await supabase
      .from('customers')
      .select('user_id, fname, lname, phone_no')
      .eq('phone_no', phone_no)
      .single();

    if (error) {
      console.error("Error fetching customer:", error);
      return;
    }
    if (data) {
      setNewAppointment((prev) => ({
        ...prev,
        user_id: data.user_id,
        fname: data.fname,
        lname: data.lname
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'phone_no') {
      fetchUserByPhoneNo(value);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const {
      user_id, fname, lname, phone_no, app_date, app_time, remark, app_status
    } = newAppointment;

    const { error } = await supabase.from('appointments').insert({
      user_id, fname, lname, phone_no, app_date, app_time, remark, app_status
    });

    if (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: `There was an error: ${error.message || 'Please fill in all the fields correctly.'}`,
        confirmButtonText: 'Try Again'
      });
      return;
    }

    MySwal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Appointment added successfully!',
    });

    setNewAppointment({
      user_id: '',
      fname: '',
      lname: '',
      phone_no: '',
      app_date: '',
      app_time: '',
      remark: '',
      app_status: 'Scheduled',
    });

    const { data } = await supabase.from('appointments').select();
    setAppointments(data);
    setIsNew(false);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    const { app_id } = selectedAppointment;
    const { user_id, fname, lname, phone_no, app_date, app_time, remark, app_status } = newAppointment;

    const { error } = await supabase.from('appointments').update({
      user_id, fname, lname, phone_no, app_date, app_time, remark, app_status
    }).eq('app_id', app_id);

    if (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error updating appointment: ${error.message}`,
      });
      return;
    }

    MySwal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Appointment updated successfully!',
    });

    const { data } = await supabase.from('appointments').select();
    setAppointments(data);
    setEditMode(false);
    setSelectedAppointment(null);
  };

  const handleEdit = (appointment) => {
    setEditMode(true);
    setIsNew(false);
    setNewAppointment({
      user_id: appointment.user_id,
      fname: appointment.fname,
      lname: appointment.lname,
      phone_no: appointment.phone_no,
      app_time: appointment.app_time,
      app_date: appointment.app_date,
      app_status: appointment.app_status,
      remark: appointment.remark,
    });
    setSelectedAppointment(appointment);
  };

  const handleCancel = () => {
    setEditMode(false);
    setIsNew(false);
    setSelectedAppointment(null);
    setNewAppointment({
      user_id: '',
      fname: '',
      lname: '',
      phone_no: '',
      app_date: '',
      app_time: '',
      remark: '',
      app_status: 'Scheduled',
    });
  };

  const handleDelete = async (appointmentId) => {
    const { error } = await supabase.from('appointments').delete().eq('app_id', appointmentId);

    if (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete appointment.',
      });
      return;
    }

    MySwal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Appointment has been deleted.',
    });

    const { data } = await supabase.from('appointments').select();
    setAppointments(data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex flex-row">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
        <button
            onClick={() => { setIsNew(true); setEditMode(false); }}
            className="w-7 h-8 text-green-500  py-2 px-2 rounded hover:text-green-600"
          >
            <FaPlus /> 
          </button>
      </div>
       
      <div className="flex">
        <div className="w-full max-w-sm mx-auto">
          <Calendar
            onChange={setValue}
            value={value}
            tileClassName={({ date }) => {
              const malaysiaDate = new Date(date);
              malaysiaDate.setHours(malaysiaDate.getHours() + 8);
              const hasAppointment = appointments.some(
                (app) => {
                  const appDate = new Date(app.app_date);
                  appDate.setHours(appDate.getHours() + 8);
                  return appDate.toDateString() === malaysiaDate.toDateString();
                }
              );
              return hasAppointment ? 'bg-yellow-200 text-yellow-800 rounded-lg shadow-lg' : null;
            }}
            className="border rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow duration-300"
          />
        </div>
        <div className="ml-6 w-full">
          {isNew || editMode ? (
            <form onSubmit={isNew ? handleAddAppointment : handleUpdateAppointment} className="my-4">
              <input type="text" name="phone_no" placeholder="Phone No" value={newAppointment.phone_no} onChange={handleInputChange} className="border rounded-lg p-2 w-full" required />
              <input type="text" name="fname" placeholder="First Name" value={newAppointment.fname} onChange={handleInputChange} className="border rounded-lg p-2 w-full mt-2" required />
              <input type="text" name="lname" placeholder="Last Name" value={newAppointment.lname} onChange={handleInputChange} className="border rounded-lg p-2 w-full mt-2" required />
              <input type="date" name="app_date" value={newAppointment.app_date} onChange={handleInputChange} className="border rounded-lg p-2 w-full mt-2" required />
              <input type="time" name="app_time" value={newAppointment.app_time} onChange={handleInputChange} className="border rounded-lg p-2 w-full mt-2" required />
              <textarea name="remark" placeholder="Remark" value={newAppointment.remark} onChange={handleInputChange} className="border rounded-lg p-2 w-full mt-2"></textarea>
              <select name="app_status" value={newAppointment.app_status} onChange={handleInputChange} className="border rounded-lg p-2 w-full mt-2">
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  {isNew ? 'Add Appointment' : 'Update Appointment'}
                </button>
                <button type="button" onClick={handleCancel} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
         <div className="flex items-center">
      <FaRegCalendar className="mr-2" />
      <h3 className="text-xl font-semibold">{value.toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</h3>
    </div>
          <ul className="mt-4">
            {selectedAppointments.sort((a, b) => new Date(`${a.app_date}T${a.app_time}`) - new Date(`${b.app_date}T${b.app_time}`)).map((appointment) => (
              <li key={appointment.app_id} className="flex justify-between items-center p-4 border-b" style={{ backgroundColor: appointment.app_status === 'Scheduled' ? '#d4edda' : appointment.app_status === 'Completed' ? '#fff3cd' : '#f8d7da' }}>
                <div>
                  <p className="font-semibold"><strong>{appointment.fname} {appointment.lname}</strong></p>
                  <p><span className="font-semibold">Phone: </span>{appointment.phone_no}</p>
                  <p><span className="font-semibold">Date: </span>{new Date(appointment.app_date).toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</p>
                  <p><span className="font-semibold">Time: </span>{new Date(`${appointment.app_date}T${appointment.app_time}`).toLocaleTimeString('en-MY', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit' })}</p>
                  <p><span className="font-semibold">Remark: </span>{appointment.remark}</p>
                  <p><span className="font-semibold">Status: </span>{appointment.app_status}</p>
                </div>
                <div className="flex">
                  <button onClick={() => handleEdit(appointment)} className="text-yellow-500 hover:underline ml-2"><FaEdit /></button>
                  <button onClick={() => handleDelete(appointment.app_id)} className="text-red-500 hover:underline ml-2"><FaTimes /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
