import styles from "./Logo.module.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className={styles.container}>
      <Link to="/">
        <img className={styles.logo_img} src="/logo.png" alt="logo" />
      </Link>
    </div>
  );
}

export default Logo;
