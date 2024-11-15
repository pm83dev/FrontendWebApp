import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const initialMachineState = {
    jobNr: '',
    serialNumber: '',
    model: '',
    manufactureDate: '',
    installationDate: '',
    description: '',
    customer: '',
    finalUser: '',
    country: '',
    materialType: '',
    productionRate: '',
    totalPower: '',
    totalWater: '',
    certification: '',
};

const FormGroup = ({ label, name, value, onChange, required }) => {
    const dateValue = value ? new Date(value) : null;

    return (
        <Form.Group controlId={`form${name}`}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="text"
                placeholder={`Enter ${label}`}
                name={name}
                value={name === 'manufactureDate' || name === 'installationDate' ?
                    dateValue ? `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}` : ''
                    : value}
                onChange={onChange}
                required={required}
            />
        </Form.Group>
    );
};

const ModalDpp = ({ showModalExt, onHide, updatedMachine, handleAddOrUpdateMachine }) => {
    const [newMachine, setNewMachine] = useState(updatedMachine || initialMachineState);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (updatedMachine) {
            axios.put(`https://9eca-31-171-141-197.ngrok-free.app/api/DppMachine/${newMachine.id}`, newMachine)
                .then(response => {
                    handleAddOrUpdateMachine(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.post('https://9eca-31-171-141-197.ngrok-free.app/api/DppMachine', newMachine)
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
        setNewMachine(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <Modal show={showModalExt} onHide={onHide}>
            <Modal.Header className="modalDpp-header" closeButton>
                <Modal.Title>{updatedMachine ? 'Update Machine' : 'Create New Machine'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalDpp-body">
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup label="Job Nr" name="jobNr" value={newMachine.jobNr} onChange={handleInputChange} required />
                            <FormGroup label="Serial Nr" name="serialNumber" value={newMachine.serialNumber} onChange={handleInputChange} required />
                            <FormGroup label="Model" name="model" value={newMachine.model} onChange={handleInputChange} required />
                            <FormGroup label="Description" name="description" value={newMachine.description} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <FormGroup label="Manufacturer Date" name="manufactureDate" value={newMachine.manufactureDate} onChange={handleInputChange} required />
                            <FormGroup label="Installation Date" name="installationDate" value={newMachine.installationDate} onChange={handleInputChange} required />
                            <FormGroup label="Customer" name="customer" value={newMachine.customer} onChange={handleInputChange} required />
                            <FormGroup label="Final User" name="finalUser" value={newMachine.finalUser} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup label="Country" name="country" value={newMachine.country} onChange={handleInputChange}  />
                            <FormGroup label="Material Type" name="materialType" value={newMachine.materialType} onChange={handleInputChange}  />
                            <FormGroup label="Production Rate" name="productionRate" value={newMachine.productionRate} onChange={handleInputChange}  />
                        </div>
                        <div className="col-md-6">
                            <FormGroup label="Total Power" name="totalPower" value={newMachine.totalPower} onChange={handleInputChange}  />
                            <FormGroup label="Total Water" name="totalWater" value={newMachine.totalWater} onChange={handleInputChange}  />
                            <FormGroup label="Certification" name="certification" value={newMachine.certification} onChange={handleInputChange}  />
                        </div>
                    </div>

                    <Button variant="primary" type="submit">
                        {updatedMachine ? 'Update' : 'Submit'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalDpp;