import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};

export default useWindowDimensions;