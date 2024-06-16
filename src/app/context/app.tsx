"use client";
import Cookies from "js-cookie";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 } from "uuid";
import { en, ka } from "../languages/list";
import { usePathname } from "next/navigation";

/**
 * App context state
 */
const App = createContext<any>(null);

export const useApp = () => useContext(App);

interface contextProps {
  children: ReactNode;
}

export const AppContextWrapper: React.FC<contextProps> = ({ children }) => {
  /**
   * backend API url
   */
  // const apiUrl = "http://192.168.1.6:5000";
  const apiUrl = process.env.API_URL;

  // define device type
  const [isMobile, setIsMobile] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => {
      // Assuming a width less than 768px is a mobile device
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call the function to set the initial state
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Menu
   */
  const [openMenu, setOpenMenu] = useState(false);

  /**
   * Back drop state
   */
  const [openBackDrop, setOpenBackDrop] = useState(false);

  /**
   * page loader
   */
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);

  /**
   * Generate unique identificator for user and save in cookie
   */

  const generateUniqueIdentifier = () => {
    const identifier = Cookies.get("uniqueIdentifier");
    if (!identifier) {
      const newIdentifier = generateRandomIdentifier();
      Cookies.set("uniqueIdentifier", newIdentifier, { expires: 365 });
      return newIdentifier;
    }
    return identifier;
  };

  const generateRandomIdentifier = () => {
    const uuid = v4();
    return uuid;
  };

  useEffect(() => {
    generateUniqueIdentifier();
  }, []);

  /**
   * languages
   */
  const [language, setLanguage] = useState("ka");
  const [activeLanguage, setActiveLanguage] = useState<any>("");

  useEffect(() => {
    let appLang = localStorage.getItem("GeoMarket:language") || "ka";
    setLanguage(appLang);
  }, []);

  useEffect(() => {
    if (language) {
      if (language === "en") {
        setActiveLanguage(en);
      } else {
        setActiveLanguage(ka);
      }
      localStorage.setItem("GeoMarket:language", language);
    }
  }, [language]);

  /** auto reaload web */
  // auto app reload if user dont react in 2 hours
  const useAutoReload = (timeout = 7200000) => {
    // Default to 2 hours (7200000 milliseconds)
    useEffect(() => {
      let timer = setTimeout(() => {
        window.location.reload();
      }, timeout);

      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          window.location.reload();
        }, timeout);
      };

      // List of events to reset the timer
      const events = ["click", "keypress"];

      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });

      return () => {
        clearTimeout(timer);
        events.forEach((event) => {
          window.removeEventListener(event, resetTimer);
        });
      };
    }, [timeout]);
  };

  useAutoReload();

  const pathname = usePathname();
  // when menu open disable scrolling
  useEffect(() => {
    if (openMenu || pathname.includes("/chat")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openMenu, pathname]);

  return (
    <App.Provider
      value={{
        apiUrl,
        openMenu,
        setOpenMenu,
        openBackDrop,
        setOpenBackDrop,
        loading,
        setLoading,
        sectionLoading,
        setSectionLoading,
        language,
        setLanguage,
        activeLanguage,
        isMobile,
      }}
    >
      {children}
    </App.Provider>
  );
};
