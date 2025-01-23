import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    const location = useLocation();  // Get current location for redirect after login

    // If the user is not authenticated, redirect to login and preserve the attempted path
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the child components (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
