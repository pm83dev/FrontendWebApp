import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, CardText } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import config from '../config';

// Registrazione dei componenti Chart.js
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, zoomPlugin);

const DashboardPage = () => {
    const location = useLocation();
    const { machineData } = location.state || {};
    const [newMachineData, setNewMachineData] = useState(machineData || {});
    const [motorData, setMotorData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [pressureData, setPressureData] = useState([]);
    const [powerData, setPowerData] = useState([]);
    const [statusData, setStatusData] = useState([]);   
    const [timeRange, setTimeRange] = useState('10min');

    // Funzione per aggiornare i dati delle temperature
    const fetchTemperatureData = async () => {
        if (newMachineData?.serialNumber) {
            try {
                const response = await axios.get(`${config.NGROK_URL}/api/DeviceData/temperature/${newMachineData.jobNr}`);
                setTempData(response.data);
                //console.log(response);
            } catch (error) {
                console.error('Errore nel recupero dei dati temperature:', error);
            }
        }
    };

    // Funzione per aggiornare i dati dei motori
    const fetchMotorData = async () => {
        if (newMachineData?.serialNumber) {
            try {
                const response = await axios.get(`${config.NGROK_URL}/api/DeviceData/motor/${newMachineData.jobNr}`);
                setMotorData(response.data);
                //console.log(response);
            } catch (error) {
                console.error('Errore nel recupero dei dati motori:', error);
            }
        }
    };
    
    // Funzione per aggiornare le pressioni
    const fetchPressureData = async () => {
        if (newMachineData?.serialNumber) {
            try {
                const response = await axios.get(`${config.NGROK_URL}/api/DeviceData/pressure/${newMachineData.jobNr}`)
                setPressureData(response.data);  
                //console.log(response);
            } catch (error) {
                console.error("Errore nel recupero dei dati pressure:", error);
            }
        }
    }

    // Funzione per aggiornare i consumi
    const fetchPowerData = async () => {
        if (newMachineData?.serialNumber) {
            try {
                const response = await axios.get(`${config.NGROK_URL}/api/DeviceData/power/${newMachineData.jobNr}`)
                setPowerData(response.data);
                //console.log(response);
            } catch (error) {
                console.error("Errore nel recupero dei dati power:", error);
            }

        }
    }
    
    // Funzione per aggiornare lo stato macchina
    const fetchStatusData = async () => {
        if (newMachineData?.serialNumber) {
            try {
                const response = await axios.get(`${config.NGROK_URL}/api/DeviceData/status/${newMachineData.jobNr}`)
                setStatusData(response.data);
                console.log(response);
            } catch (error) {
                console.error("Errore nel recupero dei dati power:", error);
            }
        }
    }

    // Recupero dati all'inizio e aggiornamento periodico
    useEffect(() => {
        fetchTemperatureData();
        fetchMotorData();
        fetchPressureData();
        fetchPowerData();
        fetchStatusData();

        const intervalId = setInterval(() => {
            fetchTemperatureData();
            fetchMotorData();
            fetchPressureData();
            fetchPowerData();
            fetchStatusData();
        }, 10000); // Aggiorna ogni 10 secondi

        return () => clearInterval(intervalId);
    }, [newMachineData]);

    // Funzione per estrarre array di dati da proprietà annidate
    const createArrayOfData = (data, varName) => {
        const keys = varName.split('.');
        return data
            .map(item => keys.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), item))
            .filter(value => value !== undefined && value !== 0);
    };

    // Media mobile
    const movingAverage = (data, windowSize) => {
        return data.map((val, index, arr) => {
            const start = Math.max(0, index - windowSize + 1);
            const window = arr.slice(start, index + 1);
            return window.reduce((acc, curr) => acc + curr, 0) / window.length;
        });
    };
    
    // Dati estratti per i grafici
    
    const ExtruderPVDataSpeed = movingAverage(createArrayOfData(motorData, 'speedPv.Speed_PV_Extruder'), 5);
    const ExtruderSPDataSpeed = movingAverage(createArrayOfData(motorData, 'speedSp.Speed_SP_Extruder'), 5);
    const ExtruderPVDataCurrent = movingAverage(createArrayOfData(motorData, 'currentPv.Current_PV_Extruder'), 5);
    const ExtruderPVDataTorque = movingAverage(createArrayOfData(motorData, 'torquePv.Torque_PV_Extruder'), 5);
    
    const DicerPVDataSpeed = movingAverage(createArrayOfData(motorData, 'speedPv.Speed_PV_Dicer'), 5);
    const DicerSPDataSpeed = movingAverage(createArrayOfData(motorData, 'speedSp.Speed_SP_Dicer'), 5);
    const DicerPVDataCurrent = movingAverage(createArrayOfData(motorData, 'currentPv.Current_PV_Dicer'), 5);
    const DicerPVDataTorque = movingAverage(createArrayOfData(motorData, 'torquePv.Torque_PV_Dicer'), 5);
    
    const AugerPVDataSpeed = movingAverage(createArrayOfData(motorData, 'speedPv.Speed_PV_Auger'), 5);
    const AugerSPDataSpeed = movingAverage(createArrayOfData(motorData, 'speedSp.Speed_SP_Auger'), 5);
    const AugerPVDataCurrent = movingAverage(createArrayOfData(motorData, 'currentPv.Current_PV_Auger'), 5);
    const AugerPVDataTorque = movingAverage(createArrayOfData(motorData, 'torquePv.Torque_PV_Auger'), 5);
    
    const PressurePVDataInlet = movingAverage(createArrayOfData(pressureData, 'pressInlet.Press_PV_Inlet'), 5);
    const PressurePVDataOutlet = movingAverage(createArrayOfData(pressureData, 'pressInlet.Press_PV_Outlet'), 5);
    const PressurePVDataRampack = movingAverage(createArrayOfData(pressureData, 'pressInlet.Press_PV_Rampack'), 5);
    
    const ExtruderPVDataPower = movingAverage(createArrayOfData(powerData, 'powerPv.Power_PV_Extruder'), 5);
    const DicerPVDataPower = movingAverage(createArrayOfData(powerData, 'powerPv.Power_PV_Dicer'), 5);
    const AugerPVDataPower = movingAverage(createArrayOfData(powerData, 'powerPv.Power_PV_Auger'), 5);
    const heatingPVDataPower = movingAverage(createArrayOfData(powerData, 'powerPv.Power_PV_Heating'), 5);
    const LineActualPVDataPower = movingAverage(createArrayOfData(powerData, 'powerPv.Power_PV_Line_Actual'), 5);
    const LineKwhPVDataPower = movingAverage(createArrayOfData(powerData, 'powerPv.Power_PV_line_per_hour'), 5);
    
    const TimestampArray = createArrayOfData(motorData, 'timestamp');
    
    const TempZone1PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_1');
    const TempZone2PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_2');
    const TempZone3PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_3');
    const TempZone4PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_4');
    const TempZone5PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_5');
    const TempZone6PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_6');
    const TempZone7PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_7');
    const TempZone8PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_8');
    const TempZone9PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_9');
    const TempZone10PV = createArrayOfData(tempData, 'tempPv.Temp_PV_zone_10');
    
    const statusDataExtraction = createArrayOfData(statusData, 'codeValue.StandStill');
    
    //Find last value
    const findLastValue = (array) =>
        {
            return array.length > 0 ? array[array.length - 1] : undefined;
        }
    
    const LastvalueTempZone1PV = findLastValue(TempZone1PV);
    const LastvalueTempZone2PV = findLastValue(TempZone2PV);
    const LastvalueTempZone3PV = findLastValue(TempZone3PV);
    const LastvalueTempZone4PV = findLastValue(TempZone4PV);
    const LastvalueTempZone5PV = findLastValue(TempZone5PV);
    const LastvalueTempZone6PV = findLastValue(TempZone6PV);
    const LastvalueTempZone7PV = findLastValue(TempZone7PV);
    const LastvalueTempZone8PV = findLastValue(TempZone8PV);
    const LastvalueTempZone9PV = findLastValue(TempZone9PV);
    const LastvalueTempZone10PV = findLastValue(TempZone10PV);
    
    const LastValueExtSPSpeed = findLastValue(ExtruderSPDataSpeed);
    const LastValueExtPVSpeed = findLastValue(ExtruderPVDataSpeed);
    const LastValueExtPVCurrent = findLastValue(ExtruderPVDataCurrent);
    const LastValueExtPVTorque = findLastValue(ExtruderPVDataTorque);
    
    const LastValueExtPVPower = findLastValue(ExtruderPVDataPower);
    const LastValueHeatingPVPower = findLastValue(heatingPVDataPower);
    const LastValueLineActualPVPower = findLastValue(LineActualPVDataPower);
    const LastValueLineKwhPVPower = findLastValue(LineKwhPVDataPower);
    
    const LastValuePressPVInlet = findLastValue(PressurePVDataInlet);
    const LastValuePressPVOutlet = findLastValue(PressurePVDataOutlet);

    const LastStatusMachine = findLastValue(statusDataExtraction);
    
    // Funzione per assegnare stati a stringa
    const parsedStatus = Number(LastStatusMachine);
    let statusMachine;
        switch (parsedStatus) {
        case 0:
            statusMachine = "Stopped";
            break;
        case 1:
            statusMachine = "Heating";
            break;
        case 2:
            statusMachine = "Stopped - temperature Ok";
            break;
        case 3:
            statusMachine = "Stopped - Electrical fault";
            break;
        case 4:
            statusMachine = "Stopped - Mechanical fault";
            break;
        case 5:
            statusMachine = "Stopped - Mechanical maintenance";
            break;
        case 6:
            statusMachine = "Stopped - Electrical maintenance";
            break;
        case 7:
            statusMachine = "Stopped - shift change";
            break;
        case 8:
            statusMachine = "Purging";
            break;
        case 100:
            statusMachine = "Running";
            break;    
        default:
            statusMachine = "Offline/Unknown";
            break;
    }
    
    
    // Funzione per calcolare l'ora di partenza basata su un intervallo
    const calculateStartTime = (range) => {
        const now = Date.now(); // Timestamp attuale in millisecondi
        const ranges = {
            '10min': 10 * 60 * 1000,
            '30min': 30 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '6h': 6 * 60 * 60 * 1000,
            '12h': 12 * 60 * 60 * 1000,
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
        };

        return ranges[range] ? now - ranges[range] : 0;
    };

    // Funzione per filtrare i dati in base all'intervallo di tempo
    const filterDataByTimeRange = (timestamps, values, range) => {
        const startTime = calculateStartTime(range);
        return timestamps.map((timestamp, index) => ({
            timestamp: new Date(timestamp),
            value: values[index],
        })).filter(item => item.timestamp.getTime() >= startTime);
    };

    // Filtraggio dei dati
    const filteredValuesExtPVSpeed = filterDataByTimeRange(TimestampArray, ExtruderPVDataSpeed, timeRange);
    const filteredValuesExtSPSpeed = filterDataByTimeRange(TimestampArray, ExtruderSPDataSpeed, timeRange);
    const filteredValuesExtPVCurrent = filterDataByTimeRange(TimestampArray, ExtruderPVDataCurrent, timeRange);
    const filteredValuesExtPVPower = filterDataByTimeRange(TimestampArray, ExtruderPVDataPower, timeRange);
    const filteredValuesExtPVTorque = filterDataByTimeRange(TimestampArray, ExtruderPVDataTorque, timeRange);

    const filteredValuesDicerPVSpeed = filterDataByTimeRange(TimestampArray, DicerPVDataSpeed, timeRange);
    const filteredValuesDicerSPSpeed = filterDataByTimeRange(TimestampArray, DicerSPDataSpeed, timeRange);
    const filteredValuesDicerPVCurrent = filterDataByTimeRange(TimestampArray, DicerPVDataCurrent, timeRange);
    const filteredValuesDicerPVPower = filterDataByTimeRange(TimestampArray, DicerPVDataPower, timeRange);
    const filteredValuesDicerPVTorque = filterDataByTimeRange(TimestampArray, DicerPVDataTorque, timeRange);

    const filteredValuesAugerPVSpeed = filterDataByTimeRange(TimestampArray, AugerPVDataSpeed, timeRange);
    const filteredValuesAugerSPSpeed = filterDataByTimeRange(TimestampArray, AugerSPDataSpeed, timeRange);
    const filteredValuesAugerPVCurrent = filterDataByTimeRange(TimestampArray, AugerPVDataCurrent, timeRange);
    const filteredValuesAugerPVPower = filterDataByTimeRange(TimestampArray, AugerPVDataPower, timeRange);
    const filteredValuesAugerPVTorque = filterDataByTimeRange(TimestampArray, AugerPVDataTorque, timeRange);
    
    // Estrazione dei timestamp e dei valori
    const filteredTimeStamp = filteredValuesExtPVSpeed.map(item => item.timestamp.toLocaleString()); // Formatta il timestamp come desideri
    
    const filteredDataExtPVSpeed = filteredValuesExtPVSpeed.map(item => item.value); 
    const filteredDataExtSPSpeed = filteredValuesExtSPSpeed.map(item => item.value);
    const filteredDataExtPVCurrent = filteredValuesExtPVCurrent.map(item => item.value);
    const filteredDataExtPVPower = filteredValuesExtPVPower.map(item => item.value);
    const filteredDataExtPVTorque = filteredValuesExtPVTorque.map(item => item.value);

    const filteredDataDicerPVSpeed = filteredValuesDicerPVSpeed.map(item => item.value);
    const filteredDataDicerSPSpeed = filteredValuesDicerSPSpeed.map(item => item.value);
    const filteredDataDicerPVCurrent = filteredValuesDicerPVCurrent.map(item => item.value);
    const filteredDataDicerPVPower = filteredValuesDicerPVPower.map(item => item.value);
    const filteredDataDicerPVTorque = filteredValuesDicerPVTorque.map(item => item.value);

    const filteredDataAugerPVSpeed = filteredValuesAugerPVSpeed.map(item => item.value);
    const filteredDataAugerSPSpeed = filteredValuesAugerSPSpeed.map(item => item.value);
    const filteredDataAugerPVCurrent = filteredValuesAugerPVCurrent.map(item => item.value);
    const filteredDataAugerPVPower = filteredValuesAugerPVPower.map(item => item.value);
    const filteredDataAugerPVTorque = filteredValuesAugerPVTorque.map(item => item.value);

    const chartDataExt = {
        labels: filteredTimeStamp,
        datasets: [
            {
                label: 'ExtPVSpeed',
                data: filteredDataExtPVSpeed,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'ExtSPSpeed',
                data: filteredDataExtSPSpeed,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(225, 167, 21, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'ExtPVCurrent',
                data: filteredDataExtPVCurrent,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(242, 61, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },
            
            {
                label: 'ExtPVPower',
                data: filteredDataExtPVPower,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(37, 242, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'ExtPVTorque',
                data: filteredDataExtPVTorque,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(239, 242, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },
        ]
    };

    const chartDataDicer = {
        labels: filteredTimeStamp,
        datasets: [
            {
                label: 'DicerPVSpeed',
                data: filteredDataDicerPVSpeed,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'DicerSPSpeed',
                data: filteredDataDicerSPSpeed,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(225, 167, 21, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'DicerPVCurrent',
                data: filteredDataDicerPVCurrent,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(242, 61, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'DicerPVPower',
                data: filteredDataDicerPVPower,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(37, 242, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'DicerPVTorque',
                data: filteredDataDicerPVTorque,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(239, 242, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },
        ]
    };

    const chartDataAuger = {
        labels: filteredTimeStamp,
        datasets: [
            {
                label: 'AugerPVSpeed',
                data: filteredDataAugerPVSpeed,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'AugerSPSpeed',
                data: filteredDataAugerSPSpeed,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(225, 167, 21, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'AugerPVCurrent',
                data: filteredDataAugerPVCurrent,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(242, 61, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'AugerPVPower',
                data: filteredDataAugerPVPower,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(37, 242, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },

            {
                label: 'AugerPVTorque',
                data: filteredDataAugerPVTorque,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(239, 242, 10, 0.8)',
                borderWidth: 2,
                fill: true,
                tension: 0.8, // Linea fluida
                pointRadius: 2, // Dimensione punti
                pointHoverRadius: 4, // Dimensione punti al passaggio del mouse

            },
        ]
    };


    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Disattiva il rapporto d’aspetto predefinito
        scales: {
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(232,228,228,0.1)' },
            },
            y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(232,228,228,0.1)' },
            },
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                },
            },
        },
        
    };

    return (
        <div className="main-content">
            <Container fluid={"xl"} className="dashboard-container">
                <Row className="gy-4">
                    <Col md={8}>
                        <Card className="bg-dark text-light mb-3 border-0 shadow-lg rounded">
                            <CardHeader className="bg-gradient text-white rounded-top">
                                <h5 className="mb-0">
                                    <i className="bi bi-passport-fill me-2"></i>Product Digital Passport
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md={6}>
                                        <Card.Title className="fw-bold">
                                            <i className="bi bi-gear-fill me-2"></i>Job Number: {newMachineData.jobNr || 'N/A'}
                                        </Card.Title>
                                        <Card.Text>
                                            <i className="bi bi-upc-scan me-2"></i>Serial Number: {newMachineData.serialNumber || 'N/A'}
                                        </Card.Text>
                                        <Card.Text>
                                            <i className="bi bi-cpu-fill me-2"></i>Model: {newMachineData.model || 'N/A'}
                                        </Card.Text>
                                        <Card.Text>
                                            <i className="bi bi-card-text me-2"></i>Description: {newMachineData.description || 'N/A'}
                                        </Card.Text>
                                    </Col>
                                    <Col md={6}>
                                        <Card.Text>
                                            <i className="bi bi-speedometer2 me-2"></i>Production Rate: {newMachineData.productionRate || 'N/A'} Kg/h
                                        </Card.Text>
                                        <Card.Text>
                                            <i className="bi bi-battery-charging me-2"></i>Total Power: {newMachineData.totalPower || 'N/A'} kW/h
                                        </Card.Text>
                                        <Card.Text>
                                            <i className="bi bi-archive-fill me-2"></i>Material Type: {newMachineData.materialType || 'N/A'}
                                        </Card.Text>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="bg-dark text-light mb-3 border-0 shadow-lg rounded">
                            <CardHeader className="bg-gradient text-white rounded-top">
                                <h5 className="mb-0">
                                    <i className="bi bi-person-fill me-2"></i>Customer Info
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <Card.Text>
                                    <i className="bi bi-people-fill me-2"></i>Customer: {newMachineData.customer || 'N/A'}
                                </Card.Text>
                                <Card.Text>
                                    <i className="bi bi-person-check-fill me-2"></i>Final User: {newMachineData.finalUser || 'N/A'}
                                </Card.Text>
                                <Card.Text>
                                    <i className="bi bi-geo-alt-fill me-2"></i>Country: {newMachineData.country || 'N/A'}
                                </Card.Text>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>




                <Card className="bg-dark text-light mb-3 border-0 shadow-lg rounded">
                    <CardHeader className="bg-gradient text-white rounded-top">
                        <h5 className="mb-0">
                            <i className="bi bi-speedometer2 me-2"></i>Machine Last Data - {newMachineData.jobNr || 'N/A'}
                        </h5>
                    </CardHeader>
                    <CardBody>
                        <CardTitle className="fw-bold">
                            <i className="bi bi-info-circle me-2"></i>Machine Status: {statusMachine || 'N/A'}
                        </CardTitle>
                        <Row className="gy-3">
                            {/* Colonna 1 */}
                            <Col md={4}>
                                <ul className="list-unstyled">
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z1: {LastvalueTempZone1PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z2: {LastvalueTempZone2PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z3: {LastvalueTempZone3PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z4: {LastvalueTempZone4PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z5: {LastvalueTempZone5PV || 'N/A'} °C
                                    </li>
                                </ul>
                            </Col>
                            {/* Colonna 2 */}
                            <Col md={4}>
                                <ul className="list-unstyled">
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z6: {LastvalueTempZone6PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z7: {LastvalueTempZone7PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z8: {LastvalueTempZone8PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z9: {LastvalueTempZone9PV || 'N/A'} °C
                                    </li>
                                    <li>
                                        <i className="bi bi-thermometer-half me-2"></i>
                                        Temperature Z10: {LastvalueTempZone10PV || 'N/A'} °C
                                    </li>
                                </ul>
                            </Col>
                            {/* Colonna 3 */}
                            <Col md={4}>
                                <ul className="list-unstyled">
                                    <li>
                                        <i className="bi bi-gauge me-2"></i>
                                        Pressure Screen: {LastValuePressPVInlet || 'N/A'} bar
                                    </li>
                                    <li>
                                        <i className="bi bi-box-seam me-2"></i>
                                        Actual Production: {'N/A'} Kg/h
                                    </li>
                                    <li>
                                        <i className="bi bi-lightning me-2"></i>
                                        Actual Power Heating: {LastValueHeatingPVPower || 'N/A'} kW
                                    </li>
                                    <li>
                                        <i className="bi bi-plug-fill me-2"></i>
                                        Actual Power: {LastValueLineActualPVPower || 'N/A'} kW
                                    </li>
                                    <li>
                                        <i className="bi bi-clock-history me-2"></i>
                                        Power per Hour: {LastValueLineKwhPVPower || 'N/A'} kWh
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>




                <Row>
                    <Col lg={4}>
                        <Card className="bg-dark text-light mb-3 border-0 shadow-sm rounded">
                            <CardHeader className="bg-gradient text-light rounded-top">
                                <h5 className="mb-0">
                                    <i className="bi bi-calendar-range me-2"></i>Time Range Filter
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <CardText className="mb-0">
                                    <select
                                        className="form-select bg-secondary text-light border-0"
                                        value={timeRange}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                    >
                                        <option value="10min">Last 10 min</option>
                                        <option value="30min">Last 30 min</option>
                                        <option value="1h">Last 1 Hour</option>
                                        <option value="6h">Last 6 Hours</option>
                                        <option value="12h">Last 12 Hours</option>
                                        <option value="24h">Last 24 Hours</option>
                                        <option value="7d">Last 7 Days</option>
                                    </select>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                <Col md={12}>
                    <Card className="bg-dark text-light mb-3 border-0 shadow-sm rounded">
                        <CardHeader className="bg-gradient text-light rounded-top d-flex align-items-center">
                            <i className="bi bi-bar-chart-fill me-2"></i>
                            <h5 className="mb-0">Extruder Motor Chart</h5>
                        </CardHeader>
                        <CardBody>
                            <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
                                <Line data={chartDataExt} options={chartOptions} />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                    <Col md={12}>
                        <Card className="bg-dark text-light mb-3 border-0 shadow-sm rounded">
                            <CardHeader className="bg-gradient text-light rounded-top d-flex align-items-center">
                                <i className="bi bi-bar-chart-fill me-2"></i>
                                <h5 className="mb-0">Dicer Motor Chart</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
                                    <Line data={chartDataDicer} options={chartOptions} />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={12}>
                        <Card className="bg-dark text-light mb-3 border-0 shadow-sm rounded">
                            <CardHeader className="bg-gradient text-light rounded-top d-flex align-items-center">
                                <i className="bi bi-bar-chart-fill me-2"></i>
                                <h5 className="mb-0">Auger Motor Chart</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
                                    <Line data={chartDataAuger} options={chartOptions} />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
            </Container>
        </div>
    );
};
export default DashboardPage;