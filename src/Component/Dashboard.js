import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, CardText } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import config from './config';

// Registriamo i componenti necessari di Chart.js
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const DashboardPage = () => {
    const location = useLocation();
    const { machineData } = location.state || {};
    const [newMachineData, setNewMachineData] = useState(machineData || {});
    const [motorData, setMotorData] = useState({}); // Stato per i dati dei motori (speeds PV - SP)
    const [tempData, setTempData] = useState({}); // Stato per i dati delle zone (temperatures PV - SP)

    // Funzione per aggiornare i dati delle temperature
    const fetchTemperatureData = () => {
        if (newMachineData?.serialNumber) {
            axios.get(`${config.NGROK_URL}/api/DeviceData/temperature/${newMachineData.jobNr}`)
                .then(response => {
                    setTempData(response.data); // Aggiorna i dati delle temperature
                    console.log("Dati temperature ricevuti dall'API:", response.data);
                })
                .catch(error => {
                    console.error("Errore nel recupero dei dati temperature:", error);
                });
        }
    };

    // Funzione per aggiornare i dati dei motori
    const fetchMotorData = () => {
        if (newMachineData?.serialNumber) {
            axios.get(`${config.NGROK_URL}/api/DeviceData/motor/${newMachineData.jobNr}`)
                .then(response => {
                    setMotorData(response.data); // Aggiorna i dati dei motori
                    console.log("Dati motori ricevuti dall'API:", response.data);
                })
                .catch(error => {
                    console.error("Errore nel recupero dei dati motori:", error);
                });
        }
    };

    // Recupera i dati iniziali quando il componente viene montato
    useEffect(() => {
        fetchTemperatureData();
        fetchMotorData();

        // Imposta un intervallo di 10 secondi per aggiornare i dati
        const intervalId = setInterval(() => {
            fetchTemperatureData(); // Ricarica i dati delle temperature
            fetchMotorData(); // Ricarica i dati dei motori
        }, 10000); // 10000 ms = 10 secondi

        // Pulizia dell'intervallo quando il componente viene smontato
        return () => clearInterval(intervalId);
    }, [newMachineData]); // L'effetto viene eseguito ogni volta che cambia newMachineData

    // Estrai l'ultima temperatura Z1
    const lastTempData = tempData[tempData.length - 2];  // Ultimo elemento

    // Estrai la temperatura Z1
    const lastTempZ1 = lastTempData?.Temperatures?.PV?.Z1 !== undefined ? lastTempData.Temperatures.PV.Z1 : 'N/A';
    const lastTempZ2 = lastTempData?.Temperatures?.PV?.Z2 !== undefined ? lastTempData.Temperatures.PV.Z2 : 'N/A';
    const lastTempZ3 = lastTempData?.Temperatures?.PV?.Z3 !== undefined ? lastTempData.Temperatures.PV.Z3 : 'N/A';
    const lastTempZ4 = lastTempData?.Temperatures?.PV?.Z4 !== undefined ? lastTempData.Temperatures.PV.Z4 : 'N/A';
    const lastTempZ5 = lastTempData?.Temperatures?.PV?.Z5 !== undefined ? lastTempData.Temperatures.PV.Z5 : 'N/A';
    const lastTempZ6 = lastTempData?.Temperatures?.PV?.Z6 !== undefined ? lastTempData.Temperatures.PV.Z6 : 'N/A';
    const lastTempZ7 = lastTempData?.Temperatures?.PV?.Z7 !== undefined ? lastTempData.Temperatures.PV.Z7 : 'N/A';
    const lastTempZ8 = lastTempData?.Temperatures?.PV?.Z8 !== undefined ? lastTempData.Temperatures.PV.Z8 : 'N/A';
    const lastTempZ9 = lastTempData?.Temperatures?.PV?.Z9 !== undefined ? lastTempData.Temperatures.PV.Z9 : 'N/A';

    // Estrai l'ultimo valore dei motori
    const lastMotorData = motorData[motorData.length - 1];
    const lastSpeedPV = lastMotorData?.Speeds?.PV?.Ext || 'N/A';

    // Combina i dati delle temperature e dei motori per le card e il grafico
    const extruderData = tempData && motorData ? {
        temperatureZ1: tempData.PV?.Z1,
        temperatureZ2: tempData.PV?.Z2,
        temperatureZ3: tempData.PV?.Z3,
        temperatureZ4: tempData.PV?.Z4,
        temperatureZ5: tempData.PV?.Z5,
        temperatureZ6: tempData.PV?.Z6,
        pressureScreen: motorData.SP?.Z1, // esempio di pressione
        extSpeed: motorData.SP?.Z2, // esempio di velocità
        extCurrent: motorData.SP?.Z3, // esempio di corrente
        production: newMachineData.productionRate, // dai dati della macchina
        totalPower: newMachineData.totalPower,
    } : {};

    if (!Array.isArray(motorData)) {
        return <div>I dati non sono disponibili o non sono nel formato previsto</div>;
    }

    
    // Funzione per filtrare e sincronizzare i dati
    const filterMotorData = (timestamps, motorData) => {
        const filteredData = motorData.filter((value, index) => value !== 0); // Filtra i dati che sono 0
        const filteredTimestamps = timestamps.filter((_, index) => motorData[index] !== 0); // Sincronizza le etichette
        return { filteredTimestamps, filteredData };
    };

    // Estrai i dati
    const timestamps = motorData.map(item => item.Timestamp);
    const extData = motorData.map(item => item.Speeds?.PV?.Ext || 0);
    const dicerData = motorData.map(item => item.Speeds?.PV?.Dicer || 0);
    const rollfeedData = motorData.map(item => item.Speeds?.PV?.Rollfeed || 0);
    const augerData = motorData.map(item => item.Speeds?.PV?.Auger || 0);
    const shredderData = motorData.map(item => item.Speeds?.PV?.Shredder || 0);

    // Filtra i dati per ciascun motore utilizzando la funzione generica
    const { filteredTimestamps: filteredTimestampsExt, filteredData: filteredExtData } = filterMotorData(timestamps, extData);
    const { filteredTimestamps: filteredTimestampsDicer, filteredData: filteredDicerData } = filterMotorData(timestamps, dicerData);
    const { filteredTimestamps: filteredTimestampsRollfeed, filteredData: filteredRollfeedData } = filterMotorData(timestamps, rollfeedData);
    const { filteredTimestamps: filteredTimestampsAuger, filteredData: filteredAugerData } = filterMotorData(timestamps, augerData);
    const { filteredTimestamps: filteredTimestampsShredder, filteredData: filteredShredderData } = filterMotorData(timestamps, shredderData);
    
    const chartDataExt = {
        labels: filteredTimestampsExt,
        datasets: [
            {
                label: 'Ext',
                data: filteredExtData,  // Filtra i valori 0
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
                tension: 1,
            },
        ]
    };

    const chartDataDicer = {
        labels: filteredTimestampsDicer,
        datasets: [ 
            {
                label: 'Dicer',
                data: filteredDicerData,  // Filtra i valori 0
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
            },
        ]}
    
    const chartDataRollfeed = {
        labels: filteredTimestampsRollfeed,
        datasets: [ 
            {
                label: 'Rollfeed',
                data: filteredRollfeedData,  // Filtra i valori 0
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                fill: true,
            },
        ]}

    const chartDataAuger = {
        labels: filteredTimestampsAuger,
        datasets: [ 
            {
                label: 'Auger',
                data: filteredAugerData,  // Filtra i valori 0
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                fill: true,
            },
        ]}
    
    const chartDataShredder = {
        labels: filteredTimestampsShredder,
        datasets: [ 
            {
                label: 'Shredder',
                data: filteredShredderData,  // Filtra i valori 0
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                fill: true,
            },
        ]}

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Disattiva il rapporto d’aspetto predefinito
        scales: {
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
            },
            y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
            },
        },
    };

    return (
        <div className="main-content">
            <Container fluid className="dashboard-container">
                <Row>
                    <Col md={6}>
                        <Card className="bg-dark text-info mb-3">
                            <CardHeader className='bg-primary text-white'>Product Digital Passport</CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md={6}>
                                        <Card.Title>Job Number: {newMachineData.jobNr || 'N/A'}</Card.Title>
                                        <Card.Text>Serial Number: {newMachineData.serialNumber || 'N/A'}</Card.Text>
                                        <Card.Text>Model: {newMachineData.model || 'N/A'}</Card.Text>
                                        <Card.Text>Description: {newMachineData.description || 'N/A'}</Card.Text>
                                        <Card.Text>Customer: {newMachineData.customer || 'N/A'}</Card.Text>
                                        <Card.Text>Final User: {newMachineData.finalUser || 'N/A'}</Card.Text>
                                        <Card.Text>Country: {newMachineData.country || 'N/A'}</Card.Text>
                                    </Col>
                                    <Col md={6}>
                                        <Card.Text>Material Type: {newMachineData.materialType || 'N/A'}</Card.Text>
                                        <Card.Text>Production Rate: {newMachineData.productionRate || 'N/A'} Kg/h</Card.Text>
                                        <Card.Text>Total Power: {newMachineData.totalPower || 'N/A'} kW/h</Card.Text>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6}>
                    <Card className="bg-dark text-info mb-3">
                            <CardHeader className='bg-primary text-white'>Machine Last Data {newMachineData.jobNr}</CardHeader>
                            <CardBody>
                                <CardTitle>Machine Status: Running</CardTitle>
                                <Row>
                                    <Col md={6}>
                                        <CardText>Temperature Z1: {lastTempZ1 || 'N/A'} °C</CardText>
                                        <CardText>Temperature Z2: {lastTempZ2 || 'N/A'} °C</CardText>
                                        <CardText>Temperature Z3: {lastTempZ3 || 'N/A'} °C</CardText>
                                        <CardText>Temperature Z4: {lastTempZ4 || 'N/A'} °C</CardText>
                                        <CardText>Temperature Z5: {lastTempZ5 || 'N/A'} °C</CardText>
                                        <CardText>Temperature Z6: {lastTempZ6 || 'N/A'} °C</CardText>
                                    </Col>
                                    <Col md={6}>
                                        <CardText>Pressure Screen: {extruderData.pressureScreen || 'N/A'} bar</CardText>
                                        <CardText>Extruder Speed: {lastSpeedPV || 'N/A'} rpm</CardText>
                                        <CardText>Extruder Current: {extruderData.extCurrent || 'N/A'} A</CardText>
                                        <CardText>Actual Production: {extruderData.production || 'N/A'} Kg/h</CardText>
                                        <CardText>Actual Power: {extruderData.totalPower || 'N/A'} kW</CardText>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    
                    </Col>

                </Row>
                <Row>
                    <Col md={12}>
                        <Card className='bg-dark mb-3'>
                            <CardHeader className='text-bg-info'>Extruder Motor Chart</CardHeader>
                            <CardBody>
                                <Line data={chartDataExt} chartOptions={chartOptions}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card className='bg-dark mb-3'>
                            <CardHeader className='text-bg-info'>Dicer Motor Chart</CardHeader>
                            <CardBody>
                                <Line data={chartDataDicer}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card className='bg-dark mb-3'>
                            <CardHeader className='text-bg-info'>Rollfeed Motor Chart</CardHeader>
                            <CardBody>
                                <Line data={chartDataRollfeed}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card className='bg-dark mb-3'>
                            <CardHeader className='text-bg-info'>Auger Motor Chart</CardHeader>
                            <CardBody>
                                <Line data={chartDataAuger}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card className='bg-dark mb-3'>
                            <CardHeader className='text-bg-info'>Shredder Motor Chart</CardHeader>
                            <CardBody>
                                <Line data={chartDataShredder}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card className='bg-dark mb-3'>
                            <CardHeader className='text-bg-info'>Production Chart</CardHeader>
                            <CardBody>
                                <Line data={chartDataShredder}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DashboardPage;