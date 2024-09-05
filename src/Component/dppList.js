import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalDpp from './modalDppForm';
import { useNavigate } from 'react-router-dom'
import { Button, Table, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

function Dpplist() {
    const [dppMachine, setDppMachine] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updatedMachine, setUpdatedMachine] = useState(null);
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState({key:null, direction:'asc'});

    useEffect(() => {
        axios.get('https://localhost:7085/api/DppMachine')
            .then(response => {
                setDppMachine(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    //*********************************START Modal
    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false); 
        window.location.reload();// Ricarica la pagina
    }  
    //*********************************END Modal

    //*********************************START Sorting and filter
    const sortedMachines = [...dppMachine].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    //*********************************END Sorting and filter

    //*********************************START Actions
    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const handleDelete = (id) => {

        const confirmDelete = window.confirm("Are you sure to delete this item?");

        if (confirmDelete) {

            axios.delete(`https://localhost:7085/api/DppMachine/${id}`)
                .then(() => {
                    setDppMachine(dppMachine.filter(machine => machine.id !== id));
                })
                .catch(error => {
                    console.error(error);
                });
        }

    };

    const handleUpdate = (machine) => {
        setUpdatedMachine(machine);
        setShowModal(true);
    };

    const handleAddOrUpdateMachine = (machine) => {
        if (updatedMachine) {
            setDppMachine(dppMachine.map(m => m.id === machine.id ? machine : m));
        } else {
            setDppMachine([...dppMachine, machine]);
        }
        setShowModal(false);
        
    };
    //********************************* END Actions

    return (
    <div className="container py-5">
      <h1 className="mb-4">Machine List</h1>
      <Button variant="success" size="lg" className="mb-4" onClick={handleShow}>
        <FaPlus /> Insert New
      </Button>

        {showModal && (
            <ModalDpp
                showModalExt={showModal}
                onHide={handleClose}
                updatedMachine={updatedMachine}
                handleAddOrUpdateMachine={handleAddOrUpdateMachine}
            />
        )}

            <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th onClick={() => requestSort('jobNr')}>Job Nr</th>
            <th onClick={() => requestSort('serialNumber')}>Serial Nr</th>
            <th onClick={() => requestSort('model')}>Model</th>
            <th onClick={() => requestSort('manufacturer')}>Manufacturer</th>
            <th onClick={() => requestSort('manufactureDate')}>Manufacturer Date</th>
            <th onClick={() => requestSort('installationDate')}>Installation Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMachines.length > 0 ? (
            sortedMachines.map((machine) => (
              <tr key={machine.id}>
                <td>{machine.jobNr}</td>
                <td>{machine.serialNumber}</td>
                <td>{machine.model}</td>
                <td>{machine.manufacturer}</td>
                <td>{new Date(machine.manufactureDate).toLocaleDateString()}</td>
                <td>{new Date(machine.installationDate).toLocaleDateString()}</td>
                <td>
                  <Button variant="info" size="sm" onClick={goToDashboard}>
                    <FaEdit /> Dashboard
                  </Button>
                  <Button variant="warning" size="sm" onClick={() => handleUpdate(machine)}>
                    <FaEdit /> Update
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(machine.id)}>
                    <FaTrash /> Delete
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
    </div>
  );
}

export default Dpplist;   


