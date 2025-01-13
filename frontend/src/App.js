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
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './style.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route 
                            path="/dashboard" 
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };