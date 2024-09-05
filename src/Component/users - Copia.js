import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, Container, Row, Col } from 'react-bootstrap';

function RegisterUser() {
    const [Email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [UserList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('https://localhost:7085/api/Account/UserList')
            .then(response => {
                setUserList(response.data);
                console.log("Dati ricevuti:", response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleDelete = async (e) => { }

    const handleUpdate = async (e) => { }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('https://localhost:7085/api/Account/Register', {
                Email,
                password,
            });

            if (response.status === 200) {
                setSuccess('Registration successful');
                setError(null);
            } else {
                setError('Registration failed');
                setSuccess(null);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.errors || 'Registration failed');
            } else {
                setError('An error occurred: ' + error.message);
            }
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="userPage">
            <Row>
                <Col md={6}>
                    <Card variant="dark">
                        <Card.Header>
                            <h2>User Registration</h2>
                        </Card.Header>
                        <Card.Body>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {success && <p style={{ color: 'green' }}>{success}</p>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control placeholder="" type="email" value={Email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Loading...' : 'Register'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h2>User List</h2>
                        </Card.Header>
                        <Card.Body>
                            <table className="table table-dark table-striped">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {UserList.length > 0 ? (
                                        UserList.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.userName}</td>
                                                <td>
                                                    <Button variant="warning" onClick={() => handleUpdate(user)}>Update</Button>
                                                    <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterUser;