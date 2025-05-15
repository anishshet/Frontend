import React, { useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";

// Types
interface Invitation {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

// Mock data
const mockInvitations = [
  { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'USER', status: 'PENDING' },
  { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'ADMIN', status: 'APPROVED' },
  { _id: '3', firstName: 'Michael', lastName: 'Johnson', email: 'michael@example.com', role: 'DESIGNER', status: 'PENDING' },
  { _id: '4', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', role: 'CO_ADMIN', status: 'EXPIRED' },
];

// Role options for dropdown
const roleOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "CO_ADMIN", label: "Co Admin" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "DESIGNER", label: "Designer" },
];

export default function InvitationStatus() {
  // Main page state
  const [filters, setFilters] = useState({ firstName: "", lastName: "", email: "", status: "", role: "" });
  const [showModal, setShowModal] = useState(false);
  const [invitations, setInvitations] = useState(mockInvitations);
  const [loading, setLoading] = useState(false);

  // Form state for the invitation modal
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER",
    isSubmitting: false,
    submitSuccess: false,
    error: ""
  });

  // Filter invitations based on search criteria
  const filteredInvitations = invitations.filter(invitation => {
    return (
      (!filters.firstName || invitation.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) &&
      (!filters.lastName || invitation.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) &&
      (!filters.email || invitation.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.role || invitation.role === filters.role) &&
      (!filters.status || invitation.status === filters.status)
    );
  });

  // Update filter state
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Update form state
  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Handle invitation form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { firstName, lastName, email, role } = formState;
    
    if (!firstName || !lastName || !email) {
      setFormState(prev => ({ ...prev, error: "Please fill in all required fields" }));
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, error: "" }));
    
    // Simulate API call
    setTimeout(() => {
      // Add new invitation to the list
      const newInvitation = {
        _id: Date.now().toString(),
        firstName,
        lastName,
        email,
        role,
        status: 'PENDING'
      };
      
      setInvitations([newInvitation, ...invitations]);
      
      // Reset form with success message
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        role: "USER",
        isSubmitting: false,
        submitSuccess: true,
        error: ""
      });
      
      // Close modal after delay
      setTimeout(() => {
        setShowModal(false);
        setFormState(prev => ({ ...prev, submitSuccess: false }));
      }, 1500);
    }, 800);
  };

  // Render invitation modal
  const renderInviteModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 overflow-y-auto"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && setShowModal(false)}
    >
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden relative animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
              <h1 className="text-xl font-semibold text-gray-800">Send Invitation</h1>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-200 fixed right-4 top-4 z-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Form content */}
        <div className="p-8 overflow-y-auto rounded-b-lg custom-scrollbar" style={{ maxHeight: "calc(80vh - 60px)" }}>
          {formState.submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 font-medium">Invitation sent successfully!</p>
            </div>
          )}
          
          {formState.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium">{formState.error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleFormChange}
                  disabled={formState.isSubmitting}
                  placeholder="Enter first name"
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleFormChange}
                  disabled={formState.isSubmitting}
                  placeholder="Enter last name"
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleFormChange}
                  disabled={formState.isSubmitting}
                  placeholder="Enter email address"
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formState.role}
                  onChange={handleFormChange}
                  disabled={formState.isSubmitting}
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 appearance-none bg-white"
                  style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-8 mb-4">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {formState.isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Invitation Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition transform active:scale-95"
        >
          Send Invite
        </button>
      </header>

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
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="p-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={() => setLoading(prev => !prev)} // Toggle loading for demonstration
            className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-md font-semibold shadow hover:from-gray-700 hover:to-gray-600 transition transform active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Invitations Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-4 text-left text-white uppercase text-sm">First Name</th>
              <th className="px-6 py-4 text-left text-white uppercase text-sm">Last Name</th>
              <th className="px-6 py-4 text-left text-white uppercase text-sm">Email</th>
              <th className="px-6 py-4 text-left text-white uppercase text-sm">Role</th>
              <th className="px-6 py-4 text-left text-white uppercase text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvitations.length > 0 ? (
              filteredInvitations.map((invitation) => (
                <tr key={invitation._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800">{invitation.firstName}</td>
                  <td className="px-6 py-4 text-gray-800">{invitation.lastName}</td>
                  <td className="px-6 py-4 text-gray-600">{invitation.email}</td>
                  <td className="px-6 py-4 text-gray-600">{invitation.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invitation.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-400"
                          : invitation.status === "APPROVED"
                          ? "bg-green-100 text-green-800 border border-green-400"
                          : "bg-red-100 text-red-800 border border-red-400"
                      }`}
                    >
                      {invitation.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No invitations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invitation Modal */}
      {showModal && renderInviteModal()}
    </div>
  );
} 