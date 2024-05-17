/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";

function PublicRoute({ children }) {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? null : children;
}

export default PublicRoute;
