import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const sessionExpiry = localStorage.getItem('sessionExpiry');

  if (isLoggedIn && sessionExpiry && new Date().getTime() > sessionExpiry) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionExpiry');
    return <Navigate to="/" />;
  }

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
