import { Link } from "react-router-dom";
import styles from "./Welcome.module.css";
// import useBlur from "../contexts/BlurContext";

function Welcome() {
  return (
    <div className={styles.container}>
      <h1>Welcome to RouteMaster</h1>
      <h3>
        Manage your travels effortlessly. Track your trips, plan your routes,
        and explore the world at your own pace.
      </h3>
      <h4>Lets start planning your next adventure.</h4>
      <Link className="cta" to="/app">
        Start your journey
      </Link>
    </div>
  );
}

export default Welcome;
