import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
// import { AnonymousLayout } from './layouts/AnonymousLayout'; 
import { LoginPage } from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { ClientsPage } from './pages/ClientsPage';
import Dashboard from './pages/Dashboard';
import InvitationStatus from './pages/InvitationStatus';
import { AuthProvider } from './contexts/AuthContext';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* <Route element={<AnonymousLayout />}> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
        {/* </Route> */}
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/invitations" element={<InvitationStatus />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
