import styles from "./NavBarBurger.module.css";
import { IoMenu } from "react-icons/io5";
import { IconContext } from "react-icons";
import Hamburger from "./Hamburger";
import { IoClose } from "react-icons/io5";
import { useBurger } from "../contexts/HamburgerMenuContext";
import FullPageBlur from "./FullPageBlur";

function NavBarBurger() {
  const { dispatch, isOpen } = useBurger();
  console.log(isOpen);

  function handleOpen() {
    dispatch({ type: "open" });
  }
  function handleClose() {
    dispatch({ type: "close" });
  }

  return (
    <>
      <div className={styles.container}>
        <button className={styles.hamburgerBtn}>
          <IconContext.Provider
            value={{
              className: !isOpen
                ? `${styles.openBurger}`
                : `${styles.closeBurger}`,
            }}
          >
            {!isOpen ? (
              <>
                <IoMenu onClick={handleOpen} />
              </>
            ) : (
              <>
                <IoClose onClick={handleClose} />
                <Hamburger />
              </>
            )}
          </IconContext.Provider>
        </button>
      </div>
      <FullPageBlur className />
    </>
  );
}

export default NavBarBurger;
