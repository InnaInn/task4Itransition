import React, { useState } from 'react';
import {
  Button,
  Form,
  Table,
} from 'react-bootstrap';
import lockClosed from '../images/lockClosed.png';
import lockOpened from '../images/lockOpened.png';
import basket from '../images/basket.png';
import broom from '../images/broom.png';
import arrow from '../images/arrow.png';

const AdminPanel = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Clare, Alex', email: 'a_clare42@gmail.com', status: 'Active', lastSeen: '5 minutes ago', position: 'N/A' },
    { id: 2, name: 'Morrison, Jim', email: 'dmtimer9@dealyaari.com', status: 'Active', lastSeen: 'less than a minute ago', position: 'CFO, Meta Platforms, Inc.' },
    { id: 3, name: 'Simone, Nina', email: 'marishabelin@giftcode-ao.com', status: 'Blocked', lastSeen: '3 weeks ago', position: 'Regional Manager, Amazon.com, Inc.' },
    { id: 4, name: 'Zappa, Frank', email: 'zappa_f@citybank.com', status: 'Unverified', lastSeen: 'less than a minute ago', position: 'Architect, Meta Platforms, Inc.' },
  ]);

  const [filterText, setFilterText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <div>
      <div className="bg-light p-3 mb-3 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              className="px-3 py-2 d-flex align-items-center gap-2"
              disabled={selectedUsers.length === 0}
              onClick={() => alert(`Blocking ${selectedUsers.length} users`)}
              title="Block selected users"
            >
              <img
                src={lockClosed}
                alt="Block"
                width="20"
                height="20"
              />
              Block
            </Button>
            <Button
              variant="outline-primary"
              className="px-2 py-1"
              disabled={selectedUsers.length === 0}
              onClick={() => alert(`Unlocking ${selectedUsers.length} users`)}
              title="Unlock selected users"
            >
              <img
                src={lockOpened}
                alt="Unlock"
                width="20"
                height="20"
              />
            </Button>
            <Button
              variant="outline-danger"
              className="px-2 py-1"
              disabled={selectedUsers.length === 0}
              onClick={() => {
                setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
              }}
              title="Delete selected users"
            >
              <img
                src={basket}
                alt="Delete"
                width="20"
                height="20"
              />
            </Button>
            <Button
              variant="outline-danger"
              className="px-2 py-1"
              disabled={selectedUsers.length !== 1}
              onClick={() => {
                const userToEdit = users.find(user => user.id === selectedUsers[0]);
                alert(`Editing: ${userToEdit.name}`);
              }}
              title="Edit selected user"
            >
              <img
                src={broom}
                alt="Edit"
                width="20"
                height="20"
              />
            </Button>
          </div>

          <Form className="d-inline-flex">
            <Form.Control
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter"
              className="border border-secondary rounded px-3 py-1 bg-white text-dark"
              style={{ width: '200px' }}
            />
          </Form>
        </div>
      </div>

      <Table
        hover
        className="bg-white"
        style={{ borderCollapse: 'separate', borderSpacing: '0 1px' }}
      >
        <thead>
          <tr className="bg-white">
            <th>
              <Form.Check
                type="checkbox"
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th className="d-flex align-items-center gap-1">
              Email
              <img
                src={arrow}
                alt="Arrow"
                width="16"
                height="16"
              />
            </th>
            <th>Status</th>
            <th>Last seen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-bottom">
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                />
              </td>
              <td>
                <strong>{user.name}</strong>
                <small className="text-muted d-block mt-1">{user.position}</small>
              </td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;
