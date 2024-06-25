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
import { MdDiamond } from "react-icons/md";
import axios from "axios";

/**
 * App context state
 */
const App = createContext<any>(null);

export const useApp = () => useContext(App);

interface contextProps {
  children: ReactNode;
}

export const AppContextWrapper: React.FC<contextProps> = ({ children }) => {
  // app loading
  const [isLoading, setIsLoading] = useState(true);
  /**
   * backend API url
   */
  const apiUrl = "http://192.168.1.6:5000";

  // const apiUrl = process.env.API_URL;

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
   * Generate unique identificator for user and save in cookie
   */

  const generateUniqueIdentifier = async () => {
    const identifier = Cookies.get("GeoMarket:uniqueIdentifier");
    if (!identifier) {
      const newIdentifier = generateRandomIdentifier();
      Cookies.set("GeoMarket:uniqueIdentifier", newIdentifier);
      return newIdentifier;
    }
    try {
      await axios.post(apiUrl + "/visit", { uniqueId: identifier });
    } catch (error: any) {
      console.log(error.response.data.message);
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

  // auto reload
  useAutoReload();

  const pathname = usePathname();
  // when menu open disable scrolling
  useEffect(() => {
    if (openMenu || pathname.includes("/chat/")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openMenu, pathname]);

  // edit product for navigation from notifications to edit product when product is rejeted
  const [editProduct, setEditProduct] = useState(null);

  const productUploadingRules = [
    {
      title: activeLanguage.originProductTitle,
      description: activeLanguage?.originProductDescription,
      value: "product origin",
    },
    {
      title: activeLanguage?.contentRelevanceTitle,
      description: activeLanguage?.contentRelevanceDescription,
      value: "content relevance",
    },
    {
      title: activeLanguage?.contentQualityTitle,
      description: activeLanguage?.contentQualityDescription,
      value: "content quality",
    },
    {
      title: activeLanguage?.censorshipTitle,
      description: activeLanguage?.censorshipDescription,
      value: "censorship",
    },
    {
      title: activeLanguage?.copyrightTitle,
      description: activeLanguage?.copyrightDescription,
      value: "copyright",
    },
  ];

  return (
    <App.Provider
      value={{
        apiUrl,
        openMenu,
        setOpenMenu,
        openBackDrop,
        setOpenBackDrop,
        language,
        setLanguage,
        activeLanguage,
        isMobile,
        isLoading,
        setIsLoading,
        subscriptionItems,
        setEditProduct,
        editProduct,
        productUploadingRules,
      }}
    >
      {children}
    </App.Provider>
  );
};

// subscription items
const subscriptionItems = [
  {
    status: "active",
    value: "Free",
    options: {
      topLevelSorting: false,
      products: 10,
    },
    price: 0,
    description: ["10 Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="gray" size={28} />,
  },
  {
    status: "active",
    value: "Economy",
    time: "monthly",
    options: {
      topLevelSorting: true,
      products: 20,
    },
    price: 16,
    description: ["20 Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
  {
    status: "active",
    value: "Economy",
    time: "annually",
    options: {
      topLevelSorting: true,
      products: 20,
    },
    price: 155,
    description: ["20 Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
  {
    status: "active",
    value: "Normal",
    time: "monthly",
    options: {
      topLevelSorting: true,
      products: 30,
    },
    price: 21,
    description: ["30 Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
  {
    status: "active",
    value: "Normal",
    time: "annually",
    options: {
      topLevelSorting: true,
      products: 30,
    },
    price: 204,
    description: ["30 Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
  {
    status: "active",
    value: "Premium",
    time: "monthly",
    options: {
      topLevelSorting: true,
      products: 100,
    },
    price: 31,
    description: ["100 Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
  {
    status: "active",
    value: "Premium",
    time: "annually",
    options: {
      topLevelSorting: true,
      products: 100,
    },
    price: 301,
    description: ["100 Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
  {
    status: "active",
    value: "Premium+",
    time: "monthly",
    options: {
      topLevelSorting: true,
      products: 100000,
    },
    price: 50,
    description: ["Unlimited Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
  {
    status: "active",
    value: "Premium+",
    time: "annually",
    options: {
      topLevelSorting: true,
      products: 100000,
    },
    price: 495,
    description: ["Unlimited Products", "Top Level Sorting"],
    btn: "",
    icon: <MdDiamond color="orange" size={28} />,
  },
];
