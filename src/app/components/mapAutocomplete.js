import { useRef, useState } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import styled, { createGlobalStyle } from "styled-components";
import { TextField } from "@mui/material";
import { useApp } from "../context/app";

const apiKey = process.env.API_KEY_GOOGLE;

const libraries = ["places"];

export const MapAutoComplete = ({ setAddress }) => {
  const { activeLanguage } = useApp();

  const autocompleteRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    language: "en",
  });

  if (!isLoaded) return "Loading...";

  if (window.google === undefined) {
    return <div>Loading Google Maps API...</div>;
  }

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const components = {};

    for (const component of place.address_components) {
      if (component.types.includes("country")) {
        components.country = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        components.region = component.long_name;
      } else if (component.types.includes("locality")) {
        components.city = component.long_name;
      } else if (component.types.includes("sublocality_level_1")) {
        components.district = component.long_name;
      } else if (component.types.includes("route")) {
        components.street = component.long_name;
      } else if (component.types.includes("street_number")) {
        components.streetNumber = component.long_name;
      }
    }

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    setAddress({
      country: components.country,
      region: components.region,
      city: components.city,
      district: components.district,
      street: components.street,
      streetNumber: components.streetNumber,
      latitude: latitude,
      longitude: longitude,
      address: place.formatted_address,
    });
  };

  return (
    <>
      <GlobalStyles />
      <Container className="w-full rounded-xl">
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
          query={{
            key: "AIzaSyBxx8CORlQQBBkbGc-F0yu95DMZaiJkMmo", // Consider storing sensitive keys in environment variables
            language: "en",
          }}
          className="w-full shadow-md rounded-xl"
        >
          <TextField
            id="outlined-basic"
            label={activeLanguage.enterAddress}
            variant="outlined"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                height: "53px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "red",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "red",
                },
              },
              "& .MuiOutlinedInput-input": {
                borderRadius: "16px",
                color: "black",
              },
              "& label": {
                color: "#111",
                fontSize: "14px",
                letterSpacing: "0.5px",
              },
              "& label.Mui-focused": {
                color: "#111",
                fontSize: "14px",
                letterSpacing: "0.5px",
              },
            }}
          />
        </Autocomplete>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%%;
  height: 100%;
  display: flex;
  border-radius: 5px;

  .input {
    width: 100%;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    font-size: 16px;
    color: black;
    transition: ease-in 200ms;
    padding: 0 5px;

    &::placeholder {
      color: black;
      font-size: 14px;
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:hover {
      outline: none;
      border: 1.5px solid #ccc;
    }
  }
`;

const GlobalStyles = createGlobalStyle`
  .pac-container {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    border-radius: 5px;
    margin-top: 8px;
    background: white;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: absolute;
    z-index: 10000;
  }

  .pac-item {
    padding: 5px 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: black;
    font-weight: bold;
    border: none;
    letter-spacing: 0.5px;
  }

  .pac-item:hover {
    font-size: 14px;
    letter-spacing: 0.5px;
    background: none;
    opacity: 0.8;
  }

  .pac-item-query {
    font-weight: bold;
    color: red;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .pac-matched {
    font-weight: bold;
    color: red;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .pac-icon {
    width: 14px;
    height: 20px;
    /* You might adjust the icon styling here */
  }
`;
