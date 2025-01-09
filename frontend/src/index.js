import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './frontend/public/index.html'
import '/frontend/public/style.css'; 

ReactDOM.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>,
   document.getElementById('root')
);
