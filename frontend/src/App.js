import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/LoginPage';
import InternshipForm from './components/InternshipForm';
import ReviewPage from './components/ReviewPage';
import ResultsPage from './components/ResultsPage';
import Update from './components/Update';
import Logout from './components/Logout';
import Sidebar from './components/Sidebar'; 
import CertificateGenerator from './components/CertificateGenerator'; 
import './App.css'; 
import './style.css';

function App() {
    return (
        <Router>
            <Sidebar />
            <div style={{ marginLeft: '260px', padding: '20px' }}>
                <Route path="/" exact component={Login} />
                <Route path="/Preview" exact component={PreviewPage} />
                <Route path="/form" component={InternshipForm} />
                <Route path="/review" component={ReviewPage} />
                <Route path="/results" component={ResultsPage} />
                <Route path="/update" component={Update} />
                <Route path="/logout" component={Logout} />
                <Route path="/generate-certificate" component={CertificateGenerator} /> {/* New route */}
            </div>
        </Router>
    );
}

export default App;
