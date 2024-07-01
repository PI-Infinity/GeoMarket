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
      ad: "",
      img: "/banner.webp",
      link: "",
    },
    {
      ad: "",
      img: "/souvenirs.jpg",
      link: "",
    },
    {
      ad: "",
      img: "/gift.jpg",
      link: "",
    },
    {
      ad: "",
      img: "/market.jpg",
      link: "",
    },
    {
      ad: "",
      img: "/books.jpg",
      link: "",
    },
    {
      ad: "",
      img: "/woman.jpg",
      link: "",
    },

    {
      ad: "",
      img: "/tbilisi.jpeg",
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
    {
      ad: "Delivery 1",
      img: "/favicon-32x32.png",
      link: "",
      description: "ქალაქში - 6 ლარი, რეგიონში - 8.5 ლარი",
    },
    {
      ad: "Delivery 2",
      img: "/favicon-32x32.png",
      link: "",
      description: "ქალაქში - 6 ლარი, რეგიონში - 10 ლარი",
    },
    {
      ad: "Delivery 3",
      img: "/favicon-32x32.png",
      link: "",
      description: "ქალაქში - 7 ლარი, რეგიონში - 9 ლარი",
    },
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

  const [currentIndexDelivery, setCurrentAdIndexDelivery] = useState(0);
  const [shuffledDeliveries, setShuffledDeliveries] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndexDelivery(
        (prevIndex) => (prevIndex + 1) % shuffledDeliveries.length
      );
    }, 3000); // Interval time for changing ads

    return () => clearInterval(interval);
  }, [shuffledDeliveries]);

  const currentDelivery = shuffledDeliveries[currentIndexDelivery];

  const shuffleAndSetDeliveries = () => {
    setShuffledDeliveries(shuffleArrayDelivery([...deliveries]));
  };

  useEffect(() => {
    shuffleAndSetDeliveries(); // Initial shuffle on mount
  }, []);

  return (
    <AdsContext.Provider
      value={{ currentAd, shuffledAds, currentDelivery, shuffledDeliveries }}
    >
      {children}
    </AdsContext.Provider>
  );
};
