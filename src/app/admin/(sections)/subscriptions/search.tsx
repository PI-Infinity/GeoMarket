"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

const Search = ({ search, setSearch }: any) => {
  const { activeLanguage } = useApp();

  return (
    <div className="w-full flex flex-col text-gray-400">
      <div className="w-full h-11 rounded-xl flex items-center overflow-hidden shadow-sm">
        <div className="min-w-14 flex items-center justify-center bg-gray-300 h-full">
          <MdSearch size={30} color="white" />
        </div>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder={
            activeLanguage && typeof activeLanguage.search === "string"
              ? activeLanguage.search
              : "Search user by name..."
          }
          className="h-full w-full p-4 text-black"
        />
        {search?.length > 0 && (
          <div
            onClick={() => setSearch("")}
            className="bg-white h-full cursor-pointer hover:brightness-95 px-2 flex items-center justify-center"
          >
            <MdClose size={24} color="red" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
