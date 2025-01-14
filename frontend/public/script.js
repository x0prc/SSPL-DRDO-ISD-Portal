import React from 'react';
import LoginPage from '/components/LoginPage.js'; 
import RegisterPage from '/components/Register.js'; 

function App() {
  const [showLogin, setShowLogin] = React.useState(true);

  const handleShowRegister = () => {
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  return (
    <div>
      {showLogin ? (
        <LoginPage />
      ) : (
        <RegisterPage />
      )}
      <div className="button-container">
        <button onClick={handleShowLogin}>Show Login</button>
        <button onClick={handleShowRegister}>Show Register</button>
      </div>
    </div>
  );
}

export default script;
