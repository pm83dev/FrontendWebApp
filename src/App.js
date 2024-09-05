import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dpplist from './Component/dppList';
import Navbar from './Component/navbar';
import './App.css';
import LoginPage from './Component/login';
import DashboardPage from './Component/Dashboard';
import HomePage from './Component/homepage';
import RegisterUser from './Component/registerUser';

function App() {
        
    const PrivateRoute = ({ children }) => {
        const token = localStorage.getItem('token');
        return token ? children : <Navigate to="/login" />;
    };

    const MainLayout = ({ children }) => {
        const location = useLocation();
        // Mostra la Navbar su tutte le pagine eccetto quella di login
        const showNavbar = location.pathname !== '/login';

        return (
            <>
                {showNavbar && <Navbar/>}
                <div className="main-content">
                    {children}
                </div>
            </>
        );
    };


    return (
        <Router>
            <MainLayout>
                <Routes>
                    {/* Imposta la home page per reindirizzare alla pagina di login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Rotta per la pagina di login */}
                    <Route path="/login" element={<LoginPage />} />

                    
                    {/* Rotta per la lista DPP, protetta da PrivateRoute */}
                    <Route
                        path="/homepage"
                        element={
                            <PrivateRoute>
                                <HomePage/>
                            </PrivateRoute>
                        }
                    />

                    {/* Rotta per il dashboard, protetta da PrivateRoute */}
                    <Route
                        path="/users"
                        element={
                            <PrivateRoute>
                                <RegisterUser />
                            </PrivateRoute>
                        }
                    />

                    {/* Rotta per la lista DPP, protetta da PrivateRoute */}
                    <Route
                        path="/dpp-list"
                        element={
                            <PrivateRoute>
                                <Dpplist />
                            </PrivateRoute>
                        }
                    />

                    {/* Rotta per il dashboard, protetta da PrivateRoute */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />

                    {/* Puoi aggiungere altre rotte qui */}
                </Routes>
            </MainLayout>
        </Router>
    );
}


export default App;
