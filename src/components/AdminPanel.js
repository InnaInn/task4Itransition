import React, { useState, useEffect } from 'react';
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
import { getUsers } from '../api/client';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortField, setSortField] = useState('email');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers(
          filterText ? `%${filterText}%` : '',
          sortField,    
          sortOrder    
        );
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить пользователей');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [filterText, sortField, sortOrder]); 

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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


  if (loading) {
    return <div className="text-center p-5">Загрузка пользователей...</div>;
  }


  if (error) {
    return <div className="text-center p-5 text-danger">{error}</div>;
  }

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
                alert(`Editing: ${userToEdit.username}`);
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

          <div className="d-flex align-items-center gap-3">
            <Form className="d-inline-flex">
              <Form.Control
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter"
                className="border border-secondary rounded px-3 py-1 bg-white text-dark"
                style={{ width: '200px' }}
                autoFocus
              />
            </Form>
            <Button
              variant="outline-danger"
              className="px-3 py-2 d-flex align-items-center gap-2"
              onClick={() => console.log('Log Out clicked')}
              title="Log Out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </Button>
          </div>
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
            <th>Name <img
              src={arrow}
              alt="Arrow"
              width="16"
              height="16"
              onClick={() => handleSort('username')}
              style={{
                cursor: 'pointer',
                transform: sortField === 'email' && sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
              }}
            /></th>
            <th className="d-flex align-items-center gap-1">
              Email
              <img
                src={arrow}
                alt="Arrow"
                width="16"
                height="16"
                onClick={() => handleSort('email')} 
                style={{
                  cursor: 'pointer',
                  transform: sortField === 'email' && sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                }}
              />
            </th>
            <th>Status
              <img
                src={arrow}
                alt="Arrow"
                width="16"
                height="16"
                onClick={() => handleSort('status')} 
                style={{
                  cursor: 'pointer',
                  transform: sortField === 'email' && sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                }}
              />
            </th>
            <th>Last seen
              <img
                src={arrow}
                alt="Arrow"
                width="16"
                height="16"
                onClick={() => handleSort('last_login')} 
                style={{
                  cursor: 'pointer',
                  transform: sortField === 'email' && sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                }}

              />
            </th>
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
                <strong>{user.username}</strong>
                <small className="text-muted d-block mt-1">{user.position || 'N/A'}</small>
              </td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.last_login || 'unknown'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;