import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Table,
  Alert,
  Modal,
} from 'react-bootstrap';
import lockClosed from '../images/lockClosed.png';
import lockOpened from '../images/lockOpened.png';
import basket from '../images/basket.png';
import broom from '../images/broom.png';
import arrow from '../images/arrow.png';
import { getUsers } from '../api/client';
import { config } from "../config.js";

const beURL = config.beURL;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortField, setSortField] = useState('email');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState([]);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blockAction, setBlockAction] = useState('');
  const [showEditDeleteConfirm, setShowEditDeleteConfirm] = useState(false);
  const [usersToEditDelete, setUsersToEditDelete] = useState([]);

  const getDisplayStatus = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'UNVERIFIED':
        return 'Unverified';
      case 'BLOCKED_VERIFIED':
      case 'BLOCKED_UNVERIFIED':
        return 'Blocked';
      default:
        return status;
    }
  };

  function redirectUnauthorized(error) {
    if (error.name === 'NotAuthorized') {
      navigate('/login');
    }
  }

  function checkUnauthorized(response) {
    if (response.status === 401) {
      navigate('/login');
    };
  }

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
        redirectUnauthorized(err);
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

  const getSortIcon = (field) => {
    const isActive = sortField === field;

    return (
      <img
        src={arrow}
        alt="sort"
        width="12"
        height="12"
        style={{
          marginLeft: '5px',
          transform: isActive && sortOrder === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)',
          filter: isActive ? 'brightness(0) saturate(100%)' : 'none',
          opacity: isActive ? 1 : 0.4,
          transition: 'transform 0.3s, filter 0.3s'
        }}
      />
    );
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

  const handleBlockClick = (action) => {
    if (selectedUsers.length === 0) return;
    setBlockAction(action);
    setShowBlockConfirm(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${beURL}/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const confirmBlock = async () => {
    setShowBlockConfirm(false);
    setUpdating(true);
    setError(null);
    setSuccess(null);

    let newStatus;
    let actionText;

    if (blockAction === 'block') {
      const usersToBlock = users.filter(user => selectedUsers.includes(user.id));
      const allUnverified = usersToBlock.every(user =>
        user.status === 'UNVERIFIED' || user.status === 'BLOCKED_UNVERIFIED'
      );
      newStatus = allUnverified ? 'BLOCKED_UNVERIFIED' : 'BLOCKED_VERIFIED';
      actionText = 'Blocked';
    } else {
      newStatus = 'ACTIVE';
      actionText = 'Unblocked';
    }

    try {
      const updatePromises = selectedUsers.map(userId =>
        fetch(`${beURL}/api/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: 'include',
        }).then(response => {
          checkUnauthorized(response);
          return response;
        })
      );

      const responses = await Promise.all(updatePromises);
      const allOk = responses.every(res => res.ok);

      if (allOk) {
        setUsers(users.map(user =>
          selectedUsers.includes(user.id)
            ? { ...user, status: newStatus }
            : user
        ));
        setSelectedUsers([]);
        setSuccess(`${selectedUsers.length} user(s) ${actionText}`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(`Failed to ${blockAction} some users`);
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError(`Error ${blockAction}ing users`);
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    if (selectedUsers.length === 0) return;
    setUsersToDelete([...selectedUsers]);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const deletePromises = usersToDelete.map(userId =>
        fetch(`${beURL}/api/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
        }).then(response => {
          checkUnauthorized(response);
          return response;
        })
      );

      const responses = await Promise.all(deletePromises);
      const allOk = responses.every(res => res.ok);

      if (allOk) {
        setUsers(users.filter(user => !usersToDelete.includes(user.id)));
        setSelectedUsers([]);
        setSuccess(usersToDelete.length === 1
          ? 'User deleted successfully'
          : `${usersToDelete.length} users deleted successfully`
        );
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete some users');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      setError('Error deleting users');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleting(false);
      setUsersToDelete([]);
    }
  };

  const handleEditDeleteClick = () => {
    const usersToDelete = users.filter(user =>
      user.status === 'UNVERIFIED' || user.status === 'BLOCKED_UNVERIFIED'
    );

    if (usersToDelete.length === 0) {
      setError('No users with UNVERIFIED or BLOCKED_UNVERIFIED status found');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setUsersToEditDelete(usersToDelete);
    setShowEditDeleteConfirm(true);
  };

  const confirmEditDelete = async () => {
    setShowEditDeleteConfirm(false);
    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const deletePromises = usersToEditDelete.map(user =>
        fetch(`${beURL}/api/users/${user.id}`, {
          method: 'DELETE',
          credentials: 'include',
        }).then(response => {
          checkUnauthorized(response);
          return response;
        })
      );

      const responses = await Promise.all(deletePromises);
      const allOk = responses.every(res => res.ok);

      if (allOk) {
        setUsers(users.filter(user =>
          user.status !== 'UNVERIFIED' && user.status !== 'BLOCKED_UNVERIFIED'
        ));
        setSelectedUsers([]);
        setSuccess(`${usersToEditDelete.length} user(s) with UNVERIFIED/BLOCKED_UNVERIFIED status deleted successfully`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete some users');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      setError('Error deleting users');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleting(false);
      setUsersToEditDelete([]);
    }
  };

  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

  if (loading) {
    return <div className="text-center p-5">Загрузка пользователей...</div>;
  }

  return (
    <div>
      <Modal show={showEditDeleteConfirm} onHide={() => setShowEditDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete {usersToEditDelete.length} user(s) with status:</p>
          <ul>
            <li><strong>UNVERIFIED</strong></li>
            <li><strong>BLOCKED_UNVERIFIED</strong></li>
          </ul>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmEditDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBlockConfirm} onHide={() => setShowBlockConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {blockAction === 'block' ? 'Block' : 'Unblock'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {blockAction} {selectedUsers.length} user(s)?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockConfirm(false)}>
            Cancel
          </Button>
          <Button variant={blockAction === 'block' ? 'danger' : 'primary'} onClick={confirmBlock} disabled={updating}>
            {updating ? 'Updating...' : blockAction === 'block' ? 'Block' : 'Unblock'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usersToDelete.length === 1 ? (
            <p>Are you sure you want to delete this user?</p>
          ) : (
            <p>Are you sure you want to delete {usersToDelete.length} users?</p>
          )}
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="bg-light p-3 mb-3 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              className="px-3 py-2 d-flex align-items-center gap-2"
              disabled={selectedUsers.length === 0 || updating}
              onClick={() => handleBlockClick('block')}
              title="Block selected users"
            >
              <img src={lockClosed} alt="Block" width="20" height="20" />
              Block
            </Button>
            <Button
              variant="outline-primary"
              className="px-2 py-1"
              disabled={selectedUsers.length === 0 || updating}
              onClick={() => handleBlockClick('unblock')}
              title="Unlock selected users"
            >
              <img src={lockOpened} alt="Unlock" width="20" height="20" />
            </Button>
            <Button
              variant="outline-danger"
              className="px-2 py-1"
              disabled={selectedUsers.length === 0 || deleting}
              onClick={handleDeleteClick}
              title="Delete selected users"
            >
              <img src={basket} alt="Delete" width="20" height="20" />
            </Button>
            <Button
              variant="outline-danger"
              className="px-2 py-1"
              disabled={deleting}
              onClick={handleEditDeleteClick}
              title="Delete users with UNVERIFIED or BLOCKED_UNVERIFIED status"
            >
              <img src={broom} alt="Edit" width="20" height="20" />
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
              onClick={handleLogout}
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

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-3">
          {success}
        </Alert>
      )}

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
            <th onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>
              Name {getSortIcon('username')}
            </th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
              Email {getSortIcon('email')}
            </th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
              Status {getSortIcon('status')}
            </th>
            <th onClick={() => handleSort('last_login')} style={{ cursor: 'pointer' }}>
              Last seen {getSortIcon('last_login')}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isBlocked = user.status === 'BLOCKED_VERIFIED' || user.status === 'BLOCKED_UNVERIFIED';

            return (
              <tr key={user.id} className="border-bottom">
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>
                  <strong style={{
                    textDecoration: isBlocked ? 'line-through' : 'none',
                    color: isBlocked ? '#6c757d' : 'inherit'
                  }}>
                    {user.username}
                  </strong>
                  <small className="text-muted d-block mt-1">{user.position || 'N/A'}</small>
                </td>
                <td style={{ color: isBlocked ? '#6c757d' : 'inherit' }}>
                  {user.email}
                </td>
                <td style={{ color: isBlocked ? '#6c757d' : 'inherit' }}>
                  {getDisplayStatus(user.status)}
                </td>
                <td style={{ color: isBlocked ? '#6c757d' : 'inherit' }}>
                  {user.last_login || 'unknown'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;