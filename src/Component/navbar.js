import React, { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/LogoPlasmacIcon50x.png';
import { FaHome, FaUsers, FaUserTie, FaIndustry, FaRobot, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { Modal, Button, Form, Table,Row } from 'react-bootstrap';

function Sidebar() {
    const navigate = useNavigate();

    
    // User logged 
    // Recupera l'utente loggato
    const user = JSON.parse(localStorage.getItem('user'));
    // Recupera il nome dell'utente
    const userName = user.name;
    console.log(userName);
    
    

    // Gestione logout
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure to log out?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    return (
        <div className="container-sidebar container-fluid">
            <div className="sidebar bg-dark text-white">
                <div className="sidebar-top text-center">
                    <h2 className="sidebar-title">PLASMAC</h2>
                    <Link to="/">
                        <img src={logo} alt="Logo" className="logo" />
                    </Link>
                    <span className="machine-passport">Machine Digital Passport</span>
                </div>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink to="/homepage" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaHome /> Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaUsers /> Users Manager
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/dpp-list" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaIndustry /> Machine
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="test" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaRobot /> Spare Page
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/privacy" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaLock /> Privacy
                        </NavLink>
                    </li>
                </ul>
                <hr />
                <Row className="justify-content-center">
                    <Button variant="danger" onClick={handleLogout}>
                    Log-Out <FaSignOutAlt/> 
                    </Button>
                </Row>
                <hr></hr>
                <Row >
                    <p className="text-center">User logged:</p>
                    <p className="text-center text-wrap">{userName}</p>
                </Row>
            </div>
        </div>
    );
}


export default Sidebar;
