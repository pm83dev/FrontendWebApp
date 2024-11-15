import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dpplist from './Component/dppList';
import Navbar from './Component/navbar';
import './App.css';
import LoginPage from './Component/login';
import DashboardPage from './Component/Dashboard';
import HomePage from './Component/homepage';
import RegisterUser from './Component/registerUser';

// PrivateRoute che controlla la presenza del token
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

// MainLayout con Navbar condizionata e layout
const MainLayout = ({ children }) => {
    const location = useLocation();
    const showNavbar = location.pathname !== '/login';

    return (
        <>
            {showNavbar && <Navbar />}
            <div className="main-content">
                {children}
            </div>
        </>
    );
};

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    {/* Imposta la home page per reindirizzare alla pagina di login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Rotta per la pagina di login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Rotte protette */}
                    <Route path="/homepage" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                    <Route path="/users" element={<PrivateRoute><RegisterUser /></PrivateRoute>} />
                    <Route path="/dpp-list" element={<PrivateRoute><Dpplist /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

                    {/* Aggiungi altre rotte qui */}
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
