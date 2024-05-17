import styles from "./SideBar.module.css";
import Logo from "./Logo.jsx";
import AppNav from "./AppNav.jsx";
import { Outlet } from "react-router-dom";
import SpinnerFullPage from "./SpinnerFullPage";
import { useCountries } from "../contexts/CountriesContext";

function SideBar() {
  const { isLoading } = useCountries();

  if (isLoading) return <SpinnerFullPage />;

  return (
    <div className={styles.sidebarContainer}>
      <Logo className={styles.logo} />
      <AppNav />
      <Outlet className={styles.outlet} />
    </div>
  );
}

export default SideBar;
