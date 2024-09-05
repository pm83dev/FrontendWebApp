import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../images/LogoPlasmacIcon50x.png';

const LoginPage = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://localhost:7085/api/account/login', { Email, Password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate('/homepage');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
        <nav className="navbar navbar-expand-lg">
            <a href="https://syncro-group.com/plasmac/" className="navbar-brand d-flex align-items-center">
                <img src={logo} alt="Logo" width="40" height="40" className="d-inline-block align-top me-2 logoImg"></img>
                <span className="fs-4 brand-text logoName">Machine Digital Passport</span>
            </a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </nav>
        <div className="container-login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">Submit</button>
            </form>
            </div>
        </div>
    );
};

export default LoginPage;
