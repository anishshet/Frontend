import React, { useEffect, useState } from 'react';
import { Edit, X } from 'lucide-react';
import { type User } from '../types/auth';
import { ManageUserService } from '../services/manageUserService';
import { useAuth } from '../contexts/AuthContext';

const manageUserService = new ManageUserService();

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "CO_ADMIN", label: "Co Admin" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "DESIGNER", label: "Designer" },
];

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave({
        ...user,
        ...formData,
      });
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 overflow-y-auto mt-16"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden relative animate-scale-in my-auto">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Edit className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">Edit User</h1>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-200 fixed right-4 top-4 z-30"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto rounded-b-lg custom-scrollbar" style={{ maxHeight: "calc(80vh - 60px)" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors appearance-none bg-white"
                  style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                  required
                >
                  {roleOptions.filter(option => option.value !== "").map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this user?')) {
                    // Handle delete
                    onClose();
                  }
                }}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Delete User
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to deactivate this user?')) {
                    // Handle deactivate
                    onClose();
                  }
                }}
                className="px-4 py-2 text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
              >
                Deactivate User
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-base border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      // Here you would typically make an API call to update the user
      // For now, we'll just update the local state
      const updatedUsers = users.map(u => 
        u._id === updatedUser._id ? updatedUser : u
      );
      setUsers(updatedUsers);
      setAllUsers(updatedUsers);
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    
    // If role filter changes, apply it immediately
    if (name === 'role') {
      applyFilters({ ...filters, role: value });
    }
  };

  // Apply filters to the allUsers array
  const applyFilters = (currentFilters = filters) => {
    // Apply filters to allUsers
    let filteredUsers = [...allUsers];
    
    if (currentFilters.firstName) {
      filteredUsers = filteredUsers.filter(u => 
        u.firstName.toLowerCase().includes(currentFilters.firstName.toLowerCase())
      );
    }
    
    if (currentFilters.lastName) {
      filteredUsers = filteredUsers.filter(u => 
        u.lastName.toLowerCase().includes(currentFilters.lastName.toLowerCase())
      );
    }
    
    if (currentFilters.email) {
      filteredUsers = filteredUsers.filter(u => 
        u.email.toLowerCase().includes(currentFilters.email.toLowerCase())
      );
    }
    
    if (currentFilters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === currentFilters.role);
    }
    
    setUsers(filteredUsers);
    
    // Handle pagination
    const itemsPerPage = 10;
    setTotalPages(Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage)));
    setCurrentPage(1);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Mocking the response for frontend development
      const mockResponse: User[] = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'ADMIN',
          token: 'mock-token-1',
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'USER',
          token: 'mock-token-2',
        },
        {
          _id: '3',
          firstName: 'Alice',
          lastName: 'Brown',
          email: 'alice@example.com',
          role: 'CO_ADMIN',
          token: 'mock-token-3',
        },
        {
          _id: '4',
          firstName: 'Bob',
          lastName: 'Williams',
          email: 'bob@example.com',
          role: 'SUPERVISOR',
          token: 'mock-token-4',
        },
        {
          _id: '5',
          firstName: 'Charlie',
          lastName: 'Johnson',
          email: 'charlie@example.com',
          role: 'DESIGNER',
          token: 'mock-token-5',
        },
      ];
  
      // Simulate a network delay for better UI testing
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      console.log("Received response:", mockResponse);
  
      // Store all users directly from the mock response (already an array)
      setAllUsers(mockResponse);
      setUsers(mockResponse);
  
      // Apply existing filters
      if (filters.firstName || filters.lastName || filters.email || filters.role) {
        applyFilters();
      }
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle pagination
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return users.slice(startIndex, endIndex);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await manageUserService.deleteUser(userId);
      // Remove from both arrays
      const updatedUsers = users.filter(u => u._id !== userId);
      const updatedAllUsers = allUsers.filter(u => u._id !== userId);
      setUsers(updatedUsers);
      setAllUsers(updatedAllUsers);
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  const handleRoleFilter = (role: string) => {
    setFilters({ ...filters, role });
    applyFilters({ ...filters, role });
  };

  const handleSearchClick = () => {
    applyFilters();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          User Management
        </h1>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={filters.firstName}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={filters.lastName}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={filters.email}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearchClick}
            className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-full font-semibold shadow hover:from-gray-700 hover:to-gray-600 transition transform active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      {/* Role Filter Buttons */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filter by Role:</h3>
        <div className="flex flex-wrap gap-2">
          {roleOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleRoleFilter(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                filters.role === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        /* Users Table */
        <div className="flex-1 overflow-auto bg-white rounded-lg shadow">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      First Name
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      Last Name
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-white uppercase text-sm">
                      Role
                    </th>
                    <th className="px-6 py-4 text-right text-white uppercase text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageUsers().length === 0 ? (
                    <tr>
                      <td 
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No users found matching your filters
                      </td>
                    </tr>
                  ) : (
                    getCurrentPageUsers().map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-500">{u._id}</td>
                        <td className="px-6 py-4 text-gray-800">{u.firstName}</td>
                        <td className="px-6 py-4 text-gray-800">{u.lastName}</td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-400'
                              : u.role === 'CO_ADMIN'
                              ? 'bg-blue-100 text-blue-800 border border-blue-400'
                              : u.role === 'SUPERVISOR'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-400'
                              : u.role === 'DESIGNER'
                              ? 'bg-pink-100 text-pink-800 border border-pink-400'
                              : 'bg-green-100 text-green-800 border border-green-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEditUser(u._id)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &larr; Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-md border text-sm font-medium transition ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* Add the EditUserModal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}