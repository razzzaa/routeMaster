import styles from "./Layout.module.css";
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import UserWindow from "../components/UserWindow";

function Layout() {
  return (
    <div className={styles.layoutContaienr}>
      <SideBar />
      <Map />
      <UserWindow />
    </div>
  );
}

export default Layout;
