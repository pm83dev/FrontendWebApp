import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/LogoPlasmacIcon50x.png';
import { FaHome, FaUsers, FaUserTie, FaIndustry, FaChartBar, FaLock } from 'react-icons/fa';

function Sidebar() {
    const navigate = useNavigate();

    // Gestione logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container-sidebar">
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
                            <FaUserTie /> Users
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/dpp-list" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaIndustry /> Machine
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaChartBar /> Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/privacy" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FaLock /> Privacy
                        </NavLink>
                    </li>
                </ul>
                <hr />
                <div className="sidebar-user">
                    {/* User Info Here */}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
