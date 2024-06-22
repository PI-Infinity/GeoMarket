import React from "react";
import { TiArrowSortedDown } from "react-icons/ti";

const Sections = ({ items, sort, setSort }: any) => {
  return (
    <div className="flex items-center rounded-xl min-w-full">
      {items?.map((i: any, index: number) => {
        return (
          <div
            onClick={() =>
              setSort({
                sortOrder: sort.sortOrder === "asc" ? "desc" : "asc",
                sortField: i.value,
              })
            }
            key={i.value}
            style={{
              borderRight:
                index !== items?.length - 1
                  ? "1px solid #b9b9b9"
                  : "0px solid #b9b9b9",
            }}
            className={`py-2 px-4 ${i.width} whitespace-nowrap shadow-md ${
              i.sort && "cursor-pointer hover:brightness-95"
            }`}
          >
            {i.label}
            {i.sort && (
              <TiArrowSortedDown
                style={{
                  transform:
                    sort.sortOrder === "desc" && sort.sortField === i.value
                      ? "rotate(0)"
                      : "rotate(180deg)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Sections;
