import { NavLink } from "react-router-dom";
import styles from "./Hamburger.module.css";
import { useBurger } from "../contexts/HamburgerMenuContext";

function Hamburger() {
  const { dispatch } = useBurger();

  function handleClose() {
    dispatch({ type: "close" });
  }

  return (
    <div className={styles.container}>
      <ul className={styles.nav_li}>
        <li>
          <NavLink onClick={handleClose} to="/about">
            {" "}
            About Us{" "}
          </NavLink>
        </li>
        <li>
          <NavLink onClick={handleClose} to="/Pricing">
            {" "}
            Pricing{" "}
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={handleClose}
            className={styles.loginBtn}
            to="/login"
          >
            Login
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Hamburger;
