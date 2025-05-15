import { LoginPage } from './pages/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ForgotPasswordPage from './pages/ForgotPasswordPage';


function App() {
  return (
    <div className="w-full h-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
