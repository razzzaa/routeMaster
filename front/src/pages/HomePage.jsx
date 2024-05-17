import styles from "./HomePage.module.css";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

// import Welcome from "./Welcome";

function HomePage() {
  return (
    <main className={styles.homepage}>
      <NavBar />
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
      </div>{" "}
    </main>
  );
}

export default HomePage;
