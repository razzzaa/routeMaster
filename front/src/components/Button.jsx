import styles from "./Button.module.css";

// eslint-disable-next-line react/prop-types
function Button({ children, onClick, type }) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
