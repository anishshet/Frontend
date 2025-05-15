import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Plus, X, Loader2 } from 'lucide-react';

// Define interface for contact type
interface Contact {
  name: string;
  contactNo: string;
  jobTitle: string;
}

// Mock data for static display
const mockCountries = [
  { _id: '1', name: 'United States', value: '1', label: 'United States' },
  { _id: '2', name: 'Germany', value: '2', label: 'Germany' },
  { _id: '3', name: 'Japan', value: '3', label: 'Japan' },
  { _id: '4', name: 'Sweden', value: '4', label: 'Sweden' },
  { _id: '5', name: 'United Arab Emirates', value: '5', label: 'United Arab Emirates' },
  { _id: '6', name: 'India', value: '6', label: 'India' },
  { _id: '7', name: 'United Kingdom', value: '7', label: 'United Kingdom' },
  { _id: '8', name: 'Canada', value: '8', label: 'Canada' },
];

interface CreateClientPageProps {
  isPopup?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function CreateClientPage({ isPopup = false, onClose, onSuccess }: CreateClientPageProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: '',
    hqCountry: '',
    clientCode: '',
    clientContactNo: '',
    clientMail: '',
    chatId: '',
  });
  
  // Specify the type for alternateContacts
  const [alternateContacts, setAlternateContacts] = useState<Contact[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Alternate contacts handlers
  const addAlternateContact = () => {
    setAlternateContacts(prev => [
      ...prev,
      { name: '', contactNo: '', jobTitle: '' }
    ]);
  };

  const removeAlternateContact = (index: number) => {
    setAlternateContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleAlternateContactChange = (
    index: number, 
    field: keyof Contact, 
    value: string
  ) => {
    setAlternateContacts(prev =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // If in popup mode, call onSuccess and onClose after success
      if (isPopup) {
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 2000);
      } else {
        // Regular page mode, redirect after success
        setTimeout(() => navigate('/clients'), 2000);
      }
    }, 1500);
  };
  
  // Handle click on the backdrop to close the modal (only in popup mode)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPopup && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Form field components for reuse
  const renderFormFields = () => (
    <div className={isPopup ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-5"}>
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
          Client Name
        </label>
        <input
          type="text"
          id="clientName"
          name="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          disabled={isSubmitting}
          placeholder="Enter client name"
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="hqCountry" className="block text-sm font-medium text-gray-700 mb-1">
          HQ Country
        </label>
        <select
          id="hqCountry"
          name="hqCountry"
          value={formData.hqCountry}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors appearance-none bg-white"
          style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
        >
          <option value="">Select a country</option>
          {mockCountries.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="clientCode" className="block text-sm font-medium text-gray-700 mb-1">
          Client Code
        </label>
        <input
          type="text"
          id="clientCode"
          name="clientCode"
          value={formData.clientCode}
          onChange={handleInputChange}
          disabled={isSubmitting}
          placeholder="Enter client code"
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="clientContactNo" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number
        </label>
        <input
          type="tel"
          id="clientContactNo"
          name="clientContactNo"
          value={formData.clientContactNo}
          onChange={handleInputChange}
          disabled={isSubmitting}
          placeholder="Enter contact number"
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="clientMail" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="clientMail"
          name="clientMail"
          value={formData.clientMail}
          onChange={handleInputChange}
          disabled={isSubmitting}
          placeholder="Enter email address"
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="chatId" className="block text-sm font-medium text-gray-700 mb-1">
          Chat ID (Skype/Teams username)
        </label>
        <input
          type="text"
          id="chatId"
          name="chatId"
          value={formData.chatId}
          onChange={handleInputChange}
          disabled={isSubmitting}
          placeholder="Enter chat ID"
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        />
      </div>
    </div>
  );
  
  // Alternate contacts section component for reuse
  const renderAlternateContacts = () => (
    <div className={`${isPopup ? "mt-8 pt-6 border-t border-gray-200" : "space-y-4 mt-8 pt-6 border-t border-gray-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Alternate Contacts
        </label>
        <button
          type="button"
          onClick={addAlternateContact}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Contact
        </button>
      </div>
      
      <div className={`${isPopup ? "mt-4" : ""} space-y-4`}>
        {alternateContacts.map((contact, index) => (
          <div key={index} className="relative p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
            <button
              type="button"
              onClick={() => removeAlternateContact(index)}
              disabled={isSubmitting}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className={isPopup ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-3"}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) =>
                    handleAlternateContactChange(index, 'name', e.target.value)
                  }
                  disabled={isSubmitting}
                  placeholder="Contact name"
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={contact.contactNo}
                  onChange={(e) =>
                    handleAlternateContactChange(index, 'contactNo', e.target.value)
                  }
                  disabled={isSubmitting}
                  placeholder="Contact number"
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={contact.jobTitle}
                  onChange={(e) =>
                    handleAlternateContactChange(index, 'jobTitle', e.target.value)
                  }
                  disabled={isSubmitting}
                  placeholder="Job title"
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isPopup && alternateContacts.length === 0 && (
        <div className="text-center p-6 text-gray-500 italic text-sm mt-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          No alternate contacts added yet. Click the "Add Contact" button to add contacts.
        </div>
      )}
    </div>
  );
  
  // Submit button component for reuse
  const renderSubmitButton = (size: 'normal' | 'large' = 'normal') => (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`inline-flex items-center ${size === 'large' ? 'px-6 py-3 text-base' : 'px-5 py-2.5 text-sm'} border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm`}
    >
      {isSubmitting ? (
        <>
          <Loader2 className={`${size === 'large' ? 'w-5 h-5' : 'w-4 h-4'} mr-2 animate-spin`} />
          Creating...
        </>
      ) : (
        'Create Client'
      )}
    </button>
  );
  
  // Success message component for reuse
  const renderSuccessMessage = () => (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className={`text-green-600 ${isPopup ? 'font-medium' : ''}`}>
        Client created successfully!{!isPopup && ' Redirecting...'}
      </p>
    </div>
  );

  // When rendering as a popup
  if (isPopup) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 overflow-y-auto mt-16"
        onClick={handleBackdropClick}
      >
        <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden relative animate-scale-in my-auto">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserPlus className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-800">Create New Client</h1>
              </div>
              {onClose && (
                <button 
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-200 fixed right-4 top-4 z-30"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
          
          <div className="p-8 overflow-y-auto rounded-b-lg custom-scrollbar" style={{ maxHeight: "calc(80vh - 60px)" }}>
            {submitSuccess && renderSuccessMessage()}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}
              {renderAlternateContacts()}
              
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-8 mb-10">
                {renderSubmitButton('large')}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // When rendering as a standalone page
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl text-gray-900 font-semibold">Create New Client</h1>
      </div>
      
      {submitSuccess && renderSuccessMessage()}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFormFields()}
        {renderAlternateContacts()}
        
        <div className="flex justify-end">
          {renderSubmitButton()}
        </div>
      </form>
    </div>
  );
} 