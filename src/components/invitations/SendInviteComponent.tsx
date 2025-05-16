import React, { useState } from 'react';
import { Shield, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/authUtils';

// Define role options
const roleOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "CO_ADMIN", label: "Co Admin" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "DESIGNER", label: "Designer" },
];

interface SendInviteComponentProps {
  isPopup?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function SendInviteComponent({ isPopup = false, onClose, onSuccess }: SendInviteComponentProps) {
 
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    if ( !email || !role) {
      setSubmitError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const data = {  email, role };
    const token = getToken();

    try {
      const response = await fetch("/api/invitation", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSubmitSuccess(true);
     
      setEmail("");
      setRole("USER");
      
      // If in popup mode, call onSuccess and onClose after success
      if (isPopup) {
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 2000);
      }
    } catch (error: any) {
      setSubmitError(error.message || "Error sending invitation. Please try again.");
      console.error("Error sending invitation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click on the backdrop to close the modal (only in popup mode)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPopup && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Success message component for reuse
  const renderSuccessMessage = () => (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className={`text-green-600 ${isPopup ? 'font-medium' : ''}`}>
        Invitation sent successfully!
      </p>
    </div>
  );

  // Error message component for reuse
  const renderErrorMessage = () => (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 font-medium">
        {submitError}
      </p>
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
          Sending...
        </>
      ) : (
        'Send Invitation'
      )}
    </button>
  );

  // Form fields component for reuse
  const renderFormFields = () => (
    <div className={isPopup ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-5"}>
     
      
      
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="Enter email address"
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isSubmitting}
          className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors appearance-none bg-white"
          style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
        >
          {roleOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
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
                <Shield className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-800">Send Invitation</h1>
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
            {submitError && renderErrorMessage()}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}
              
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
        <Shield className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl text-gray-900 font-semibold">Send Invitation</h1>
      </div>
      
      {submitSuccess && renderSuccessMessage()}
      {submitError && renderErrorMessage()}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFormFields()}
        
        <div className="flex justify-end">
          {renderSubmitButton()}
        </div>
      </form>
    </div>
  );
} 