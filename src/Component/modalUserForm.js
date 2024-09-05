import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ModalUser = ({ showModalExt, onHide, currentUser, handleAddOrUpdateUser }) => {
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        company: '',
        phonenumber: '',
    });

    useEffect(() => {
        if (currentUser) {
            // Se c'è un utente corrente, popola il form con i suoi dati
            setNewUser(currentUser);
        } else {
            // Altrimenti, reimposta i campi del form a valori vuoti
            setNewUser({
                email: '',
                password: '',
                name: '',
                surname: '',
                company: '',
                phonenumber: '',
            });
        }
    }, [currentUser]); // Questo effetto viene eseguito ogni volta che `currentUser` cambia

    const handleSubmit = (event) => {
        event.preventDefault();

        if (currentUser) {
            // Aggiornamento utente esistente
            axios.put(`https://localhost:7085/api/Account/${newUser.id}`, newUser)
                .then(response => {
                    handleAddOrUpdateUser(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            // Creazione nuovo utente
            axios.post('https://localhost:7085/api/Account/Register', newUser)
                .then(response => {
                    handleAddOrUpdateUser(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Modal show={showModalExt} onHide={onHide}>
            <Modal.Header className="modalUser-header" closeButton>
                <Modal.Title>{currentUser ? 'Update User' : 'Create New User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalUser-body">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email(Username)</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email address..."
                            name="email"
                            value={newUser.email}
                            autoComplete="off"
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            value={newUser.password}
                            autoComplete="new-password"
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formSurname">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Surname"
                            name="surname"
                            value={newUser.surname}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Company"
                            name="company"
                            value={newUser.company}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="number"
                            name="phonenumber"
                            value={newUser.phonenumber}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {currentUser ? 'Update' : 'Submit'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalUser;
