import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Container } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ModalUser from './modalUserForm';
import config from './config';

function RegisterUser() {
    const [userList, setUserList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState(null);

    // Fetch the user list on component mount
    useEffect(() => {
        axios.get(`${config.NGROK_URL}/api/Account/UserList`)
            .then(response => {
                setUserList(response.data);
                console.log("Dati ricevuti:", response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // Handle showing the modal for creating a new user
    const handleShow = () => {
        setUpdatedUser(null);  // Clear the current user when creating a new one
        setShowModal(true);
    };

    // Handle closing the modal
    const handleClose = () => {
        setShowModal(false);
        setUpdatedUser(null);  // Reset the current user
    };

    // Handle deleting a user
    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure to delete this user?");
        try {

            if (confirmDelete) {
                await axios.delete(`${config.NGROK_URL}/api/Account/${id}`);
                setUserList(userList.filter(user => user.id !== id));
            }
            
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Handle adding or updating a user
    const handleAddOrUpdateUser = (user) => {
        if (updatedUser) {
            setUserList(prevList => prevList.map(u => u.id === user.id ? user : u));
        } else {
            setUserList(prevList => [...prevList, user]);
        }
        console.log('Updated userList:', userList);
        setShowModal(false);
    };

    // Handle updating a user
    const handleUpdate = (user) => {
        setUpdatedUser(user);
        setShowModal(true);
    };

    return (
        <div className="main-content">
            <Container fluid className="dppList-container">
            <h1 className="mb-4">User List</h1>
            <Button variant="success" size="lg" className="mb-4" onClick={handleShow}>
                <FaPlus /> Insert New
            </Button>
            {showModal && (
                <ModalUser
                    showModalExt={showModal}
                    onHide={handleClose}
                    currentUser={updatedUser}
                    handleAddOrUpdateUser={handleAddOrUpdateUser}
                />
            )}

            <Table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th>User/E-mail</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Company</th>
                        <th>Phone Nr (Opt.)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 ? (
                        userList.map((user) => (
                            <tr key={user.id}>
                                <td>{user.userName}</td>
                                <td>{user.name}</td>
                                <td>{user.surname}</td>
                                <td>{user.company}</td>
                                <td>{user.phoneNumber}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleUpdate(user)}>
                                        <FaEdit /> Update
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
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
            </Container>
        </div>
    );
}

export default RegisterUser;
