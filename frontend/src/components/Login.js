import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = (e) => {
      e.preventDefault();
      // Handle login logic here
   };

   return (
      <div className="container">
         <div className="form-container">
            <h2>SIT Portal Login</h2>
            <form onSubmit={handleSubmit}>
               <label>Username</label>
               <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
               <label>Password</label>
               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
               <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/create-account">Create Account</Link></p>
         </div>
      </div>
   );
};

export default Login;

