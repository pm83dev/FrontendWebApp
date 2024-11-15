import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ModalDpp from './modalDppForm';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Container, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaChartBar } from 'react-icons/fa';

function Dpplist() {
    const [dppMachine, setDppMachine] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updatedMachine, setUpdatedMachine] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'serialNumber', direction: 'desc' });
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    //locale 
    // Funzione per recuperare le macchine
    const fetchMachines = async () => {
        try {
            const response = await axios.get('https://9eca-31-171-141-197.ngrok-free.app/api/DppMachine');
            setDppMachine(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    // Funzione per ordinare e filtrare le macchine
    const sortedFilteredMachines = useMemo(() => {
        const sortedMachines = [...dppMachine].sort((a, b) => {
            const aValue = parseValue(a[sortConfig.key]);
            const bValue = parseValue(b[sortConfig.key]);

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sortedMachines.filter(machine =>
            ['serialNumber', 'model', 'customer', 'finalUser'].some(key =>
                machine[key]?.toString().toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [dppMachine, sortConfig, filter]);

    // Funzione di supporto per il parsing dei valori
    function parseValue(value) {
        if (value == null) return '';
        if (typeof value === 'number') return value;
        const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        return isNaN(numericValue) ? value : numericValue;
    }

    // Richiedi il sorting per una determinata chiave
    const requestSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Gestisci il filtro
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Gestisci l'eliminazione della macchina
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure to delete this item?")) {
            try {
                await axios.delete(`https://9eca-31-171-141-197.ngrok-free.app/api/DppMachine/${id}`);
                setDppMachine((prev) => prev.filter(machine => machine.id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Altri gestori
    const goToDashboard = (machine) => navigate('/dashboard', { state: { machineData: machine } });
    const handleShow = () => {
        setUpdatedMachine(null)
        setShowModal(true)
    };

    const handleClose = () => setShowModal(false);
    const handleUpdate = (machine) => { setUpdatedMachine(machine); setShowModal(true); };
    const handleAddOrUpdateMachine = (machine) => {
        if (updatedMachine) {
            setDppMachine((prev) => prev.map(m => m.id === machine.id ? machine : m));
        } else {
            setDppMachine((prev) => [...prev, machine]);
        }
        setShowModal(false);
    };

    return (
        <div className="main-content">
            <Container fluid className="dppList-container">
                <h1>Machine List</h1>

                <Row className="align-items-center">
                    <Col xs={12} md={3}>
                        <Button variant="success" size="lg" onClick={handleShow} className="w-100">
                            <FaPlus /> Insert New
                        </Button>
                    </Col>
                    <Col xs={12} md={6} className="ms-auto">
                        <Form.Control
                            type="text"
                            placeholder="Find Machine..."
                            value={filter}
                            onChange={handleFilterChange}
                            id="machine-filter"
                            size="lg"
                        />
                    </Col>
                </Row>

                {showModal && (
                    <ModalDpp
                        showModalExt={showModal}
                        onHide={handleClose}
                        updatedMachine={updatedMachine}
                        handleAddOrUpdateMachine={handleAddOrUpdateMachine}
                    />
                )}

                <Table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th className="col-1" onClick={() => requestSort('jobNr')}>Job Nr</th>
                            <th className="col-1" onClick={() => requestSort('serialNumber')}>Serial Nr</th>
                            <th className="col-1" onClick={() => requestSort('model')}>Model</th>
                            <th className="col-1" onClick={() => requestSort('customer')}>Customer</th>
                            <th className="col-1" onClick={() => requestSort('finalUser')}>Final User</th>
                            <th className="col-1" onClick={() => requestSort('manufactureDate')}>Manufacturer Date</th>
                            <th className="col-1" onClick={() => requestSort('installationDate')}>Installation Date</th>
                            <th className="col-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFilteredMachines.length > 0 ? (
                            sortedFilteredMachines.map((machine) => (
                                <tr key={machine.id}>
                                    <td>{machine.jobNr}</td>
                                    <td>{machine.serialNumber}</td>
                                    <td>{machine.model}</td>
                                    <td>{machine.customer}</td>
                                    <td>{machine.finalUser}</td>
                                    <td>{machine.manufactureDate}</td>
                                    <td>{machine.installationDate}</td>
                                    <td>
                                        <Button variant="info" size="sm" className="m-1" onClick={() => goToDashboard(machine)}>
                                            <FaChartBar aria-label="Dashboard" /> Dashboard
                                        </Button>
                                        <Button variant="warning" size="sm" className="m-1" onClick={() => handleUpdate(machine)}>
                                            <FaEdit aria-label="Edit" /> Details
                                        </Button>
                                        <Button variant="danger" size="sm" className="m-1" onClick={() => handleDelete(machine.id)}>
                                            <FaTrash aria-label="Delete" /> Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Dpplist;
