import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [authState, setAuthState] = useState("LOGIN"); // LOGIN | REGISTER | DASHBOARD

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState("DASHBOARD");
    }
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('token', 'your_token'); // Replace with actual token from backend
    setAuthState("DASHBOARD");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthState("LOGIN");
  };

  return (
    <div>
      {authState === "DASHBOARD" ? (
        <Dashboard onLogout={handleLogout} />
      ) : authState === "LOGIN" ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} onSwitch={() => setAuthState("REGISTER")} />
      ) : (
        <RegisterPage onRegisterSuccess={() => setAuthState("LOGIN")} />
      )}
    </div>
  );
}

export default App;
