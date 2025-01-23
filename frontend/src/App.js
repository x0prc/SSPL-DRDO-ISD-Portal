import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/LoginPage';
import InternshipForm from './components/InternshipForm';
import PreviewPage from './components/PreviewPage';
import ResultsPage from './components/ResultsPage';
import Update from './components/Update';
import Logout from './components/Logout';
import Sidebar from './components/Sidebar';
import CertificateGenerator from './components/CertificateGenerator';
import ProtectedRoute from './components/ProtectedRoute';  // Ensure this is set to handle authentication logic
import './App.css';
import './style.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {/* Redirect root ("/") to the login page */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Login route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        {/* Sidebar and main content will only render for authenticated users */}
                        <Route path="/internship-form" 
                            element={
                                <>
                                    <Sidebar />
                                    <div className="main-content">
                                        <InternshipForm />
                                    </div>
                                </>
                            } 
                        />
                        <Route path="/preview" element={<PreviewPage />} />
                        <Route path="/results" element={<ResultsPage />} />
                        <Route path="/update" element={<Update />} />
                        <Route path="/certificate" element={<CertificateGenerator />} />
                        <Route path="/logout" element={<Logout />} />
                    </Route>

                    {/* Catch-all route for invalid paths */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
