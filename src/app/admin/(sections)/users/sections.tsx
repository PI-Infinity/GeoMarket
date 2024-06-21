import React from "react";

const Sections = ({ items }: any) => {
  return (
    <div className="flex items-center rounded-xl min-w-full">
      {items?.map((i: any, index: number) => {
        return (
          <div
            key={i.value}
            style={{
              borderRight:
                index !== items?.length - 1
                  ? "1px solid #b9b9b9"
                  : "0px solid #b9b9b9",
            }}
            className={`py-2 px-4 ${i.width} whitespace-nowrap shadow-md`}
          >
            {i.label}
          </div>
        );
      })}
    </div>
  );
};

export default Sections;
