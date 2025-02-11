import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage'; 
import RegisterPage from './components/Register'; 
import Dashboard from './components/Dashboard'; // Assuming this is the main page after login

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleShowRegister = () => {
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard /> // Redirects to Dashboard if user is authenticated
      ) : showLogin ? (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <RegisterPage onRegisterSuccess={handleShowLogin} />
      )}
      {!isAuthenticated && (
        <div className="button-container">
          <button onClick={handleShowLogin}>Show Login</button>
          <button onClick={handleShowRegister}>Show Register</button>
        </div>
      )}
    </div>
  );
}

export default App;
