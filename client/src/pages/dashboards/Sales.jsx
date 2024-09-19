import React, { useEffect, useState, useCallback } from 'react';
import supabase from '../../config/supabaseClient';

const Dashboard = () => {
  const [orders, setOrders] = useState([]); // orders state is used
  const [appointments, setAppointments] = useState([]); // appointments state is used
  const [totalSales, setTotalSales] = useState(0);
  const [orderStatusCounts, setOrderStatusCounts] = useState({ pending: 0, completed: 0, cancelled: 0 });
  const [appointmentStatusCounts, setAppointmentStatusCounts] = useState({ pending: 0, completed: 0, cancelled: 0 });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch orders with a date filter
  const fetchOrders = useCallback(async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate || '1970-01-01') // Ensure there's a default date
      .lte('created_at', endDate || new Date().toISOString().split('T')[0]);

    if (error) console.error('Error fetching orders:', error);
    else {
      setOrders(orders);
      
      // Calculate total sales
      const totalSales = orders.reduce((sum, order) => sum + order.total_order_sales, 0);
      setTotalSales(totalSales);

      // Count order statuses
      const statusCounts = { pending: 0, completed: 0, cancelled: 0 };
      orders.forEach(order => {
        statusCounts[order.order_status] = (statusCounts[order.order_status] || 0) + 1;
      });
      setOrderStatusCounts(statusCounts);
    }
  }, [startDate, endDate]); // Add the dependencies

  // Fetch appointments with a date filter
  const fetchAppointments = useCallback(async () => {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('app_date', startDate || '1970-01-01') // Ensure there's a default date
      .lte('app_date', endDate || new Date().toISOString().split('T')[0]);

    if (error) console.error('Error fetching appointments:', error);
    else {
      setAppointments(appointments);

      // Count appointment statuses
      const statusCounts = { pending: 0, completed: 0, cancelled: 0 };
      appointments.forEach(appointment => {
        statusCounts[appointment.app_status] = (statusCounts[appointment.app_status] || 0) + 1;
      });
      setAppointmentStatusCounts(statusCounts);
    }
  }, [startDate, endDate]); // Add the dependencies

  // Fetch orders and appointments on component load
  useEffect(() => {
    fetchOrders();
    fetchAppointments();
  }, [fetchOrders, fetchAppointments]); // Use fetchOrders and fetchAppointments as dependencies

  // Date filter
  const filterDataByDate = useCallback(() => {
    fetchOrders();
    fetchAppointments();
  }, [fetchOrders, fetchAppointments]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Date Filter Bar */}
      <div className="mb-6 flex space-x-4">
        <div>
          <label className="block text-gray-700">Start Date:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="border rounded-lg p-2" 
          />
        </div>
        <div>
          <label className="block text-gray-700">End Date:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border rounded-lg p-2" 
          />
        </div>
        <button 
          onClick={filterDataByDate} 
          className="bg-blue-500 text-white p-2 rounded-lg mt-6">
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 - Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600">Total Sales</h2>
          <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
        </div>

        {/* Card 2 - Order Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600">Order Status</h2>
          <p className="text-md">Pending: {orderStatusCounts.pending}</p>
          <p className="text-md">Completed: {orderStatusCounts.completed}</p>
          <p className="text-md">Cancelled: {orderStatusCounts.cancelled}</p>
        </div>

        {/* Card 3 - Appointment Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600">Appointment Status</h2>
          <p className="text-md">Pending: {appointmentStatusCounts.pending}</p>
          <p className="text-md">Completed: {appointmentStatusCounts.completed}</p>
          <p className="text-md">Cancelled: {appointmentStatusCounts.cancelled}</p>
        </div>

        {/* Card 4 - Total Revenue */}
        <div className="bg-white p-6 col-span-2 rounded-lg shadow-md">
          <h2 className="text-gray-600">Total Revenue</h2>
          <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
          <p className="text-green-500">↑ 5% than last month</p>
        </div>

        {/* Card 5 - Most Sold Items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600">Most Sold Items</h2>
          {/* ... Most sold items logic here ... */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
