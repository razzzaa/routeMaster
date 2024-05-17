/* eslint-disable react/prop-types */
import styles from "./SubmitButton.module.css";

function SubmitButton({ children }) {
  return (
    <div>
      <button type="submit" className={styles.back}>
        {children}
      </button>
    </div>
  );
}

export default SubmitButton;
