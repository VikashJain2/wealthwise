import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

const PrivateRoute = ({ roles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  console.log("PrivateRoute user:", user, "roles:", roles);
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // or some "403" page
  }

  return <Outlet />;
};

export default PrivateRoute;
