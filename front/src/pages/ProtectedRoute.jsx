/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();

  console.log(isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isAuthenticated) navigate("/login");
    };
    checkAuthentication();
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
