import styles from "./Layout.module.css";
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import UserWindow from "../components/UserWindow";
import SpinnerFullPage from "../components/SpinnerFullPage";
import { useUser } from "../contexts/UserContext";

function Layout() {
  const { isLoading } = useUser();

  if (isLoading) return <SpinnerFullPage />;

  return (
    <div className={styles.layoutContaienr}>
      <SideBar />
      <Map />
      <UserWindow />
    </div>
  );
}

export default Layout;
