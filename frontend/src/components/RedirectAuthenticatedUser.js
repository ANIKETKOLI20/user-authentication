import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader} from "lucide-react";

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  console.log("isCheckingAuth:", isCheckingAuth);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("User Object:", user);

  // Display a loading indicator while checking authentication
  if (isCheckingAuth) {
    return <Loader/>
  }

  if (isAuthenticated && user?.isverified) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RedirectAuthenticatedUser;
