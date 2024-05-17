import { useEffect, useState } from "react";
import Logo from "./Logo";
import styles from "./NavBar.module.css";
import NavBarNormal from "./NavBarNormal";
import NavBarBurger from "./NavBarBurger";
import useScreenWidth from "../hooks/useScreenWidth";

function NavBar() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const screenSize = useScreenWidth();

  useEffect(() => {
    if (screenSize.width < 769) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, [screenSize.width]);

  return (
    <nav className={styles.navbar}>
      <Logo />
      {!isSmallScreen && <NavBarNormal />}
      {isSmallScreen && <NavBarBurger />}
    </nav>
  );
}

export default NavBar;
