import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../images/LogoPlasmacIcon50x.png';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaRecycle, FaHeart} from 'react-icons/fa';
import config from './config';  

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
            <span className="fs-4 brand-text logoName">Plasmac - <em>Recycling Passion</em>     <FaRecycle/><FaHeart/></span>
          </a>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <p>The Digital Product Passport (DPP) is a cutting-edge solution that provides detailed, standardized information about a product throughout its lifecycle. The DPP is designed to enhance product traceability, support regulatory compliance, and foster sustainable practices by capturing and storing data on the product’s materials, components, manufacturing processes, usage, and end-of-life handling.

Using secure digital technologies, the DPP enables manufacturers, consumers, and regulatory authorities to access essential product information at any point in time. It ensures full transparency across the supply chain, from raw material sourcing to disposal or recycling.

Key features:

Comprehensive product data: Stores detailed information on product origin, material composition, manufacturing standards, and certifications.
Sustainability tracking: Facilitates the tracking of environmental impact, carbon footprint, and recyclability of product components.
Regulatory compliance: Ensures products meet relevant safety, environmental, and industry-specific standards through automated verification.
IoT integration: Supports real-time monitoring of product performance, usage, and maintenance through IoT devices.
Enhanced traceability: Enables end-to-end tracking of the product’s journey, ensuring accountability across the supply chain.
Consumer empowerment: Provides easy access to product information for consumers, helping them make informed choices.
Circular economy support: Encourages product reuse, refurbishment, and recycling through detailed lifecycle data.
By adopting the Digital Product Passport, companies can improve supply chain transparency, meet sustainability goals, and optimize product lifecycle management.</p>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="offset-md-3">
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