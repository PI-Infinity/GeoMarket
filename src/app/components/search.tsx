"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { useApp } from "../context/app";
import "../globals.css";

interface propsTypes {
  search: string;
  setSearch: any;
  userId?: string;
  disableSuggestions?: boolean;
}

const Search: React.FC<propsTypes> = ({
  search,
  setSearch,
  userId,
  disableSuggestions,
}) => {
  const { apiUrl, activeLanguage } = useApp();

  const [suggestions, setSuggesions] = useState([]);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const GetSuggesations = async () => {
      try {
        const response = await axios.get(
          apiUrl +
            `/api/v1/products/suggestions?search=${search}&userId=${userId}`
        );
        setSuggesions(response.data.data);
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    if (search?.length > 0 && hide) {
      GetSuggesations();
    } else {
      setSuggesions([]);
    }
  }, [search]);

  return (
    <div className="w-full">
      <div className="w-full h-11 rounded-xl flex items-center overflow-hidden shadow-sm">
        <div className="min-w-14 flex items-center justify-center bg-gray-300 h-full">
          <MdSearch size={30} color="white" />
        </div>
        <input
          value={search}
          onChange={(e) => {
            setHide(true);
            setSearch(e.target.value);
          }}
          placeholder={
            activeLanguage && typeof activeLanguage.search === "string"
              ? activeLanguage.search
              : "Search..."
          }
          className="no-outline h-full w-full p-4 text-black"
        />
        {search?.length > 0 && (
          <div
            onClick={() => setSearch("")}
            className="max-w-14 bg-white h-full cursor-pointer hover:brightness-95 px-2 flex items-center justify-center"
          >
            <MdClose size={24} color="red" />
          </div>
        )}
      </div>
      {!disableSuggestions && (
        <div
          className={`bg-white w-full mt-${
            suggestions?.length > 0 ? 2 : 0
          } rounded-xl shadow-sm flex flex-col gap-1 p-${
            suggestions?.length > 0 ? 4 : 0
          } mt-${suggestions?.length > 0 ? 1 : 0}`}
        >
          {suggestions?.map((item: any, index: number) => {
            return (
              <span
                className="text-black text-sm font-semibold pl-12 cursor-pointer hover:brightness-110"
                key={index}
                onClick={() => {
                  setSearch(item);
                  setSuggesions([]);
                  setHide(false);
                }}
              >
                {item}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
