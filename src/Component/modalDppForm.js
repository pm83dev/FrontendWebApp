import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ModalDpp = ({ showModalExt, onHide, updatedMachine, handleAddOrUpdateMachine }) => {
    const [newMachine, setNewMachine] = useState(updatedMachine || {
        jobNr: '',
        serialNumber: '',
        model: '',
        manufacturer: '',
        manufactureDate: '',
        installationDate: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (updatedMachine) {
            axios.put(`https://localhost:7085/api/DppMachine/${newMachine.id}`, newMachine)
                .then(response => {
                    handleAddOrUpdateMachine(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.post('https://localhost:7085/api/DppMachine', newMachine)
                .then(response => {
                    handleAddOrUpdateMachine(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMachine(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <Modal show={showModalExt} onHide={onHide}>
            <Modal.Header className="modalDpp-header" closeButton>
                <Modal.Title>{updatedMachine ? 'Update Machine' : 'Create New Machine'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalDpp-body">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formJobNr">
                        <Form.Label>Job Nr</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Job Nr"
                            name="jobNr"
                            value={newMachine.jobNr}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formSerialNumber">
                        <Form.Label>Serial Nr</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Serial Nr"
                            name="serialNumber"
                            value={newMachine.serialNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formModel">
                        <Form.Label>Model</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Model"
                            name="model"
                            value={newMachine.model}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formManufacturer">
                        <Form.Label>Manufacturer</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Manufacturer"
                            name="manufacturer"
                            value={newMachine.manufacturer}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formManufactureDate">
                        <Form.Label>Manufacturer Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="manufactureDate"
                            value={newMachine.manufactureDate}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formInstallationDate">
                        <Form.Label>Installation Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="installationDate"
                            value={newMachine.installationDate}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {updatedMachine ? 'Update' : 'Submit'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalDpp;
