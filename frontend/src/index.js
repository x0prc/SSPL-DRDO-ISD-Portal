import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './frontend/public/index.html'
import '/frontend/public/style.css'; 

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


ReactDOM.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>,
   document.getElementById('root')
);
