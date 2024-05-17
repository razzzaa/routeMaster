/* eslint-disable react/prop-types */
import styles from "./LogButton.module.css";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function LogButton({ size }) {
  const { isAuthenticated, logOut } = useUser();

  const navigate = useNavigate();

  function handleLog() {
    logOut();
  }

  return (
    <div>
      {!isAuthenticated && (
        <button
          className={`${styles.loginBtn} ${styles[size]}`}
          onClick={() => navigate("/login")}
        >
          login
        </button>
      )}
      {isAuthenticated && (
        <button
          className={`${styles.logoutBtn} ${styles[size]}`}
          onClick={handleLog}
        >
          logout
        </button>
      )}
    </div>
  );
}

export default LogButton;
