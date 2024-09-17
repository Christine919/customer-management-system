// src/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from './config/supabaseClient';

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession(); // Fetch the session
            setSession(data.session); // Set the session state
            setLoading(false); // Set loading to false once session is fetched
        };

        fetchSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // You can add a spinner or loader here
    }

    if (!session) {
        // If no session, redirect to login
        return <Navigate to="/login" />;
    }

    return children; // If logged in, render the child components
};

export default ProtectedRoute;
