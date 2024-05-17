import styles from "./NavBarNormal.module.css";
import { NavLink } from "react-router-dom";
import LogButton from "./LogButton";

function NavBarNormal() {
  return (
    <ul className={styles.nav_li}>
      <li>
        <NavLink to="/about"> About Us </NavLink>
      </li>
      <li>
        <NavLink to="/Pricing"> Pricing </NavLink>
      </li>
      <li>
        <LogButton />
      </li>
    </ul>
  );
}

export default NavBarNormal;
