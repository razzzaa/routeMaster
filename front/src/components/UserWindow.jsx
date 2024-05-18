import styles from "./UserWindow.module.css";
import { useUser } from "../contexts/UserContext";
import LogButton from "./LogButton";

function UserWindow() {
  const { currentUser } = useUser();
  return (
    <div className={styles.userContainer}>
      <ul className={styles.userWin}>
        <li>
          <img
            src={`https://source.boringavatars.com/beam/3em/${currentUser.name}?colors=fffff,8E8E8E,00c46a`}
            alt=""
          />
        </li>
        <li>Hello, {currentUser.name}!</li>
        <li>
          <LogButton size={"small"} />
        </li>
      </ul>
    </div>
  );
}

export default UserWindow;
