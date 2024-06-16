import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MapContainer = ({ address }: any) => {
  const mapRef = useRef<HTMLDivElement | null>(null); // Ref type for map container

  useEffect(() => {
    const initMap = async () => {
      console.log("run init");
      try {
        const loader = new Loader({
          apiKey: process.env.API_KEY_GOOGLE || "",
          version: "weekly",
        });

        const google = await loader.load(); // Load Google Maps API

        if (!google) {
          throw new Error("Failed to load Google Maps API");
        }

        const position = {
          lat: parseFloat(address.latitude),
          lng: parseFloat(address.longitude),
        };

        const mapOptions: google.maps.MapOptions = {
          center: position,
          zoom: 17,
          mapId: "MY_NEXTJS_MAPID",
        };

        // Ensure mapRef is available before initializing map
        if (mapRef.current && google.maps) {
          const map = new google.maps.Map(mapRef.current, mapOptions);
          new google.maps.Marker({ position, map });
        } else {
          console.error("Map container reference not available.");
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    // Check if latitude and longitude are valid numbers before initializing map
    if (address.latitude !== "" && address.longitude !== "") {
      initMap();
    }
  }, [address]);

  return (
    <div
      style={{ height: "100%", borderRadius: "10px" }}
      className="shadow-md"
      ref={(el: any) => (mapRef.current = el)}
    ></div>
  );
};

export default MapContainer;
