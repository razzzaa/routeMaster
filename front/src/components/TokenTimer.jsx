import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

function TokenTimer() {
  const { logOut } = useUser();
  const timeoutDuration = 300000; //5min;
  let logoutTimer;

  function handleLogout() {
    logOut();
  }

  function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      handleLogout();
    }, timeoutDuration);
  }

  useEffect(() => {
    resetLogoutTimer();

    const handleInteraction = () => {
      resetLogoutTimer();
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      clearTimeout(logoutTimer);
    };
  }, []);
}

export default TokenTimer;
