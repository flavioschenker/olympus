'use client'

import React, { useState, useEffect } from 'react'
import UsersList from '@/components/users/UsersList'

interface User {
  public_id: string
  first_name: string
  last_name: string
  email: string
}

const API_URL = 'http://localhost:8000/users/'

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([])
  // State to hold temporary data for the user currently being edited
  const [editingUser, setEditingUser] = useState<User | null>(null)
  // State to track which row's public_id is currently being edited
  const [isEditingId, setIsEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      console.log(API_URL)
      const res = await fetch(API_URL)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: User[] = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  // Helper function to handle input changes for the currently editing user
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [e.target.name]: e.target.value,
      })
    }
  }

  // START EDITING (Button in the table)
  const handleStartEdit = (user: User) => {
    // Set the user data to the temporary state
    setEditingUser(user)
    // Set the ID of the user that is currently being edited
    setIsEditingId(user.public_id)
  }

  // SAVE/UPDATE (Button in the table)
  const handleSaveEdit = async () => {
    if (!editingUser) return

    const { public_id, first_name, last_name, email } = editingUser
    
    // Check if any required field is empty before saving
    if (!first_name || !last_name || !email) {
      alert("All fields are required!");
      return;
    }

    const updatedUser = { first_name, last_name, email }

    try {
      await fetch(`${API_URL}${public_id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      // Reset state and fetch updated list
      setIsEditingId(null)
      setEditingUser(null)
      fetchUsers()
    }
  }

  // CANCEL EDIT (Button in the table)
  const handleCancelEdit = () => {
    setIsEditingId(null)
    setEditingUser(null)
  }

  // DELETE
  const handleDelete = async (public_id: string) => {
    try {
      await fetch(`${API_URL}${public_id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      fetchUsers()
    }
  }


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg"> 
      <h1 className="text-3xl mb-6 border-b pb-2">
        Users
      </h1>

      <InlineCreateForm fetchUsers={fetchUsers} API_URL={API_URL} />

      <UsersList/>
      
      {/* READ LIST */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 mt-6">User List</h2>
      
      {/* THE BEAUTIFUL TABLE STRUCTURE */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr 
                key={user.public_id} 
                className={`transition duration-150 ${isEditingId === user.public_id ? 'bg-yellow-100' : 'hover:bg-blue-50'}`} 
              >
                {/* --- FIRST NAME CELL --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {isEditingId === user.public_id ? (
                    <input
                      type="text"
                      name="first_name"
                      value={editingUser?.first_name || ''}
                      onChange={handleInputChange}
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    user.first_name
                  )}
                </td>

                {/* --- LAST NAME CELL --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {isEditingId === user.public_id ? (
                    <input
                      type="text"
                      name="last_name"
                      value={editingUser?.last_name || ''}
                      onChange={handleInputChange}
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    user.last_name
                  )}
                </td>

                {/* --- EMAIL CELL --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {isEditingId === user.public_id ? (
                    <input
                      type="email"
                      name="email"
                      value={editingUser?.email || ''}
                      onChange={handleInputChange}
                      className="p-1 border rounded w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>

                {/* --- ACTION CELL --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                  {isEditingId === user.public_id ? (
                    <>
                      <button 
                        onClick={handleSaveEdit}
                        className="text-white bg-green-500 hover:bg-green-600 transition duration-150 p-1.5 rounded-md font-semibold"
                      >
                        ✅ Save
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="text-gray-700 bg-gray-300 hover:bg-gray-400 transition duration-150 p-1.5 rounded-md font-semibold"
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleStartEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150 p-1.5 rounded-md border border-indigo-600 hover:bg-indigo-50 font-semibold"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(user.public_id)}
                        className="text-red-600 hover:text-red-900 transition duration-150 p-1.5 rounded-md border border-red-600 hover:bg-red-50 font-semibold"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// Separate component for adding a new user (replaces the old Create form)
// This is added to keep the focus on table interaction.
const InlineCreateForm = ({ fetchUsers, API_URL }: { fetchUsers: () => void, API_URL: string }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const newUser = { first_name: firstName, last_name: lastName, email: email };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      clearForm();
      fetchUsers();
    }
  };

  return (
    <form 
      onSubmit={handleCreate}
      className="flex flex-col sm:flex-row gap-3 mb-8 p-4 border rounded-lg bg-gray-50"
    >
      <input 
        type="text" 
        placeholder="First Name" 
        value={firstName} 
        onChange={(e) => setFirstName(e.target.value)} 
        required 
        className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow"
      />
      <input 
        type="text" 
        placeholder="Last Name" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)} 
        required 
        className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow"
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow"
      />
      <button 
        type="submit"
        className="p-2 rounded-md font-semibold text-white transition duration-150 bg-blue-600 hover:bg-blue-700"
      >
        ➕ Addef User
      </button>
    </form>
  );
};