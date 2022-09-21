import { useEffect, useState } from "react";
import { debounce } from "lodash";

function useWindow() {
  const [width, setWidth] = useState(window.innerWidth);

  const resizeHandler = debounce(() => {
    setWidth(window.innerWidth);
  }, 100);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [resizeHandler]);

  return width;
}

export default useWindow;
