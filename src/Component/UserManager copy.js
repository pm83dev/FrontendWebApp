import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Dropdown, Button } from 'react-bootstrap';

function UserManager() {
    const [machineList, setMachineList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    // Fetch the machine list on component mount
    useEffect(() => {
        axios.get('https://localhost:7085/api/DppMachine')
            .then(response => {
                setMachineList(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // Fetch the user list on component mount
    useEffect(() => {
        axios.get('https://localhost:7085/api/Account/UserList')
            .then(response => {
                setUserList(response.data);
                console.log("Dati ricevuti:", response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    //Save association
    const handleSaveAssociation = () => {
        axios.post('https://localhost:7085/api/AssociateUserMachine', {
            userId: selectedUser,
            machineId: selectedMachine
        })
            .then(response => {
                console.log('Associazione salvata con successo!');
            })
            .catch(error => {
                console.error(error);
            });
    };


    return(
        <Container>
            <Form>
            <Form.Group controlId="machineList">
                    <Dropdown
                        value={selectedMachine}
                        onChange={(e) => setSelectedMachine(e.target.value)}
                    >
                        <option value="">Seleziona una macchina</option>
                        {machineList.map((machine) => (
                            <option key={machine.id} value={machine.id}>
                                {machine.name}
                            </option>
                        ))}
                    </Dropdown>
                </Form.Group>
                <Form.Group controlId="userList">
                    <Dropdown
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Seleziona un utente</option>
                        {userList.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </Dropdown>
                </Form.Group>
                <Button onClick={handleSaveAssociation}>Salva associazione</Button>
            </Form>
        </Container>
    );


}
export default UserManager;