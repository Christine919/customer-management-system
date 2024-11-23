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
        <button
          onClick={() => { setIsNew(true); setEditMode(false); }}
          className=" w-8 h-8 py-2 px-2 mr-4 bg-green-400 text-white rounded-full hover:bg-green-600"
        >
          <FaPlus className="text-center " />
        </button>
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>
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

          <ul className="mt-4 space-y-4">
            {selectedAppointments
              .sort((a, b) => new Date(`${a.app_date}T${a.app_time}`) - new Date(`${b.app_date}T${b.app_time}`))
              .map((appointment) => (
                <li
                  key={appointment.app_id}
                  className={`flex flex-col gap-4 p-6 rounded-lg shadow-lg border ${appointment.app_status === "Scheduled"
                    ? "bg-green-50 border-green-200"
                    : appointment.app_status === "Completed"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200"
                    }`}
                >
                  {/* Appointment Details */}
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-gray-800">
                      {appointment.fname} {appointment.lname}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {appointment.phone_no}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(appointment.app_date).toLocaleDateString("en-MY", {
                        timeZone: "Asia/Kuala_Lumpur",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Time:</span>{" "}
                      {new Date(`${appointment.app_date}T${appointment.app_time}`).toLocaleTimeString(
                        "en-MY",
                        {
                          timeZone: "Asia/Kuala_Lumpur",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Remark:</span>{" "}
                      {appointment.remark || "N/A"}
                    </p>
                    <p
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium border ${appointment.app_status === "Scheduled"
                        ? "text-green-600 border-green-400 bg-green-100"
                        : appointment.app_status === "Completed"
                          ? "text-yellow-600 border-yellow-400 bg-yellow-100"
                          : "text-red-600 border-red-400 bg-red-100"
                        }`}
                    >
                      Status: {appointment.app_status}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="flex items-center gap-2 px-4 py-2 text-yellow-600 border border-yellow-300 rounded-md hover:bg-yellow-100 hover:shadow"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.app_id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-100 hover:shadow"
                    >
                      <FaTimes />
                      Delete
                    </button>
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
