import React from 'react';
import { Card, CardGroup, Container, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';


// Registriamo i componenti necessari di Chart.js
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const DashboardPage = () => {
    // Test data for cards
    const extruderData = {
        temperature: 220,
        pressure: 50,
        speed: 100,
    };

    const productData = {
        name: 'Product XYZ',
        batchNumber: '12345',
        productionDate: '2022-01-01',
    };

    // Chart data
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
            {
                label: 'Temperature',
                data: [200, 210, 220, 230, 240],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Pressure',
                data: [40, 50, 60, 70, 80],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    return (
        <div className="main-content">
        <Container fluid className="dashboard-container">
            <Row>
                <Col md={6}>
                    <CardGroup className="mb-4">
                        <Card className="data-card">
                            <Card.Header className="data-card-header">Extruder Machine Data</Card.Header>
                            <Card.Body>
                                <Card.Title>Temperature: {extruderData.temperature}°C</Card.Title>
                                <Card.Text>Pressure: {extruderData.pressure} bar</Card.Text>
                                <Card.Text>Speed: {extruderData.speed} rpm</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="data-card">
                            <Card.Header className="data-card-header">Product Digital Passport</Card.Header>
                            <Card.Body>
                                <Card.Title>Product Name: {productData.name}</Card.Title>
                                <Card.Text>Batch Number: {productData.batchNumber}</Card.Text>
                                <Card.Text>Production Date: {productData.productionDate}</Card.Text>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                </Col>
                <Col md={6}>
                    <Card className="chart-card">
                        <Card.Header className="chart-card-header">Extruder Machine Chart</Card.Header>
                        <Card.Body>
                            <Line data={chartData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            </Container>
        </div>
    );
};

export default DashboardPage;
