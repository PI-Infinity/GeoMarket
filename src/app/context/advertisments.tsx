"use client";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Admin state context
 */

const AdsContext = createContext<any>(null);

export const useAdsContext = () => useContext(AdsContext);

interface Ad {
  ad: string;
  img: string;
  link: string;
}

export const AdsContextWrapper = ({ children }: any) => {
  const ads: Ad[] = [
    {
      ad: "Georgian Bank",
      img: "/banner.webp",
      link: "",
    },
    {
      ad: "TBC Bank",
      img: "/tech.webp",
      link: "",
    },
    {
      ad: "ONWay Delivery",
      img: "/tbilisi.jpeg",
      link: "",
    },
    {
      ad: "Marge Shawrma",
      img: "/market.jpg",
      link: "",
    },
  ];

  // Function to shuffle array
  const shuffleArray = (array: Ad[]): Ad[] => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [shuffledAds, setShuffledAds] = useState<Ad[]>([]);

  useEffect(() => {
    setShuffledAds(shuffleArray([...ads])); // Shuffle ads once on mount
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % shuffledAds.length);
    }, 3000); // Interval time for changing ads

    return () => clearInterval(interval);
  }, [shuffledAds]);

  const currentAd = shuffledAds[currentAdIndex];

  // delivery
  const deliveries = [
    { ad: "Uni Box", img: "/favicon-32x32.png", link: "" },
    { ad: "Onway", img: "/favicon-32x32.png", link: "" },
    { ad: "Easyway", img: "/favicon-32x32.png", link: "" },
    { ad: "Geo-express", img: "/favicon-32x32.png", link: "" },
    { ad: "Glovo", img: "/favicon-32x32.png", link: "" },
    { ad: "Walt", img: "/favicon-32x32.png", link: "" },
    { ad: "Georgian-Post", img: "/favicon-32x32.png", link: "" },
  ];

  // Function to shuffle array
  const shuffleArrayDelivery = (array: any[]): any[] => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const [shuffledDeliveries, setShuffledDeliveries] = useState<any[]>([]);

  const shuffleAndSetDeliveries = () => {
    setShuffledDeliveries(shuffleArrayDelivery([...deliveries]));
  };

  useEffect(() => {
    shuffleAndSetDeliveries(); // Initial shuffle on mount
  }, []);

  return (
    <AdsContext.Provider value={{ currentAd, shuffledAds, shuffledDeliveries }}>
      {children}
    </AdsContext.Provider>
  );
};
