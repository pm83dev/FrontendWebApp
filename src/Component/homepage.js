﻿// HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';

function HomePage() {
    const [dataTest, setDataTest] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get('https://localhost:7085/WeatherForecast/GetWeatherForecast')
            .then(response => {
                setDataTest(response.data);
                console.log("testdatiApi:", response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, []);

    const handleButtonClick = () => {
        // Add your function logic here
        setShowModal(true);
        console.log('Button clicked!');
    };

    return (
        <div className="container">
            <h2>Homepage</h2>
            <p>Welcome to the protected homepage page.</p>

            <Button variant="primary" onClick={handleButtonClick}>
                Click me!
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Modal body content</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Col_1</th>
                        <th>Col_2</th>
                        <th>Col_3</th>
                        <th>Col_4</th>
                        <th>Col_5</th>
                    </tr>
                </thead>
                <tbody>
                    {dataTest.length > 0 ? (
                        dataTest.map((data, index) => (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{new Date(data.date).toLocaleDateString()}</td>
                                <td>{data.temperatureC}</td>
                                <td>{data.temperatureF}</td>
                                <td>{data.summary}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default HomePage;