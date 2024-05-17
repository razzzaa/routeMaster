import { useEffect, useState } from "react";

function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setScreenWidth({
        width: window.innerWidth,
      });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return screenWidth;
}

export default useScreenWidth;
