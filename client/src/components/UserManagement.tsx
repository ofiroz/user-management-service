import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './UserManagement.css';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      first_name
      last_name
      birth_date
      city
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      first_name
      last_name
      birth_date
      city
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      first_name
      last_name
      birth_date
      city
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

interface User {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  city: string;
}

const UserManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    city: 'MAALE_ADUMIM'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (editingId) {
        await updateUser({
          variables: {
            id: editingId,
            input: formData
          }
        });
        setEditingId(null);
      } else {
        await createUser({
          variables: {
            input: formData
          }
        });
      }
      setFormData({
        first_name: '',
        last_name: '',
        birth_date: '',
        city: 'MAALE_ADUMIM'
      });
      refetch();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      birth_date: user.birth_date.split('T')[0],
      city: user.city
    });
    setEditingId(user.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    setIsDeleting(id);
    setErrorMessage(null);
    try {
      await deleteUser({
        variables: { id }
      });
      refetch();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="user-management">
      <h1>User Management</h1>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
          required
          minLength={2}
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
          required
          minLength={2}
          disabled={isSubmitting}
        />
        <input
          type="date"
          value={formData.birth_date}
          onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
          required
          min="1900-01-01"
          max="2024-12-31"
          disabled={isSubmitting}
        />
        <select
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          required
          disabled={isSubmitting}
        >
          <option value="MAALE_ADUMIM">Maale Adumim</option>
          <option value="NEW_YORK">New York</option>
          <option value="LONDON">London</option>
          <option value="PARIS">Paris</option>
          <option value="TOKYO">Tokyo</option>
          <option value="BERLIN">Berlin</option>
        </select>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : editingId ? 'Update User' : 'Add User'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setEditingId(null);
              setFormData({
                first_name: '',
                last_name: '',
                birth_date: '',
                city: 'MAALE_ADUMIM'
              });
            }}
            disabled={isSubmitting}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="users-list">
        <h2>Users</h2>
        {data?.users.map((user: User) => (
          <div key={user.id} className="user-card">
            <h3>{user.first_name} {user.last_name}</h3>
            <p>Birth Date: {new Date(user.birth_date).toLocaleDateString()}</p>
            <p>City: {user.city}</p>
            <div className="user-actions">
              <button 
                onClick={() => handleEdit(user)}
                disabled={isSubmitting || isDeleting === user.id}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                disabled={isSubmitting || isDeleting === user.id}
              >
                {isDeleting === user.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement; 