"use client";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Admin state context
 */

const AdsContext = createContext<any>(null);

export const useAdsContext = () => useContext(AdsContext);

interface Ad {
  ad: string;
  path: string;
  link: string;
}

export const AdsContextWrapper = ({ children }: any) => {
  const ads: Ad[] = [
    {
      ad: "Georgian Bank",
      path: "/banner.webp",
      link: "",
    },
    {
      ad: "TBC Bank",
      path: "/tech.webp",
      link: "",
    },
    {
      ad: "ONWay Delivery",
      path: "/tbilisi.jpeg",
      link: "",
    },
    {
      ad: "Marge Shawrma",
      path: "/market.jpg",
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
  const [fade, setFade] = useState(true);
  const [shuffledAds, setShuffledAds] = useState<Ad[]>([]);

  useEffect(() => {
    setShuffledAds(shuffleArray([...ads])); // Shuffle ads once on mount
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % shuffledAds.length);
    }, 4000); // Interval time for changing ads

    return () => clearInterval(interval);
  }, [shuffledAds]);

  const currentAd = shuffledAds[currentAdIndex];

  return (
    <AdsContext.Provider value={{ currentAd }}>{children}</AdsContext.Provider>
  );
};
