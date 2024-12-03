import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../images/LogoPlasmacIcon50x.png';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaRecycle, FaHeart} from 'react-icons/fa';
import config from '../config';  

const LoginPage = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${config.NGROK_URL}/api/Account/login`, { Email, Password });
      const token = response.data.token;
      const userName = response.data.username;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name: Email }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setSuccess(`Welcome, ${userName}! You are logged in!`);
      navigate('/homepage');
    } catch (error) {
      setError('Login failed: ' + error.message);
      } 
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12} className="mb-3">
          <a href="https://syncro-group.com/plasmac/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Logo" width="40" height="40" className="d-inline-block align-top me-2 logoImg" />
            <span className="fs-4 brand-text logoName"><em>Plasmac - Digital Product Passport (DPP)</em></span>
          </a>
        </Col>
      </Row>
      <Row>
        <Col md={6} mb={3} mt={10} className="offset-md-3">
          <h2>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;