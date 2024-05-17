import styles from "./FullPageBlur.module.css";
import { useBurger } from "../contexts/HamburgerMenuContext";

function FullPageBlur() {
  const { isOpen } = useBurger();
  console.log(isOpen);
  return (
    <div
      className={isOpen ? styles.blur : `${styles.blur} ${styles.hidden}`}
    ></div>
  );
}

export default FullPageBlur;
