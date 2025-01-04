import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import InternshipForm from './components/InternshipForm';
import ReviewPage from './components/ReviewPage';
import ResultsPage from './components/ResultsPage';
import Update from './components/Update';
import Logout from './components/Logout';
import Sidebar from './components/Sidebar'; 
import './App.css'; 

function App() {
   return (
      <Router>
         <Sidebar />
         <div style={{ marginLeft:'260px', padding:'20px' }}> {}
            <Route path="/" exact component={Login} />
            <Route path="/form" component={InternshipForm} />
            <Route path="/review" component={ReviewPage} />
            <Route path="/results" component={ResultsPage} />
            <Route path="/update" component={Update} />
            <Route path="/logout" component={Logout} />
         </div>
      </Router>
   );
}

export default App;

