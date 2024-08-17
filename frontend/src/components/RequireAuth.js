// components/RequireAuth.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader} from "lucide-react";

const RequireAuth = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  // Display a loading indicator while checking authentication
  if (isCheckingAuth) {
    return <Loader/>
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children components
  return children;
};

export default RequireAuth;
