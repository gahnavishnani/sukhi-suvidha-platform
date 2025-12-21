// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  // If authenticated, render the children (protected component)
  // If not authenticated, redirect to login page
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;