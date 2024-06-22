import { useApp } from "@/app/context/app";
import { FormatDate } from "@/app/utils/formatDate";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Item = ({ item, index, items }: any) => {
  const { apiUrl } = useApp();
  // defines user is online or not
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const GetUserStatus = async () => {
      try {
        const response = await axios.get(
          apiUrl + "/api/v1/users/" + item?.userId + "/status"
        );
        if (response.data.status === "success") {
          setOnline(response.data.data.status);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    if (item) {
      GetUserStatus();
    }

    const intervalId = setInterval(() => {
      GetUserStatus();
    }, 300000);
  }, []);
  return (
    <div key={index} className="w-full flex items-center py-1">
      <div className={`${items[0].width}`}>{item?.index}</div>
      <div className={`${items[1].width}`}>
        <div
          className="h-3 w-3 rounded-full"
          style={{ background: online ? "green" : "gray" }}
        />
      </div>
      <div className={`${items[2].width}`}>{item?.name}</div>
      <div className={`${items[3].width}`}>{item?.totalProducts}</div>
      <div className={`${items[4].width}`}>{item?.categories}</div>
      <div className={`${items[5].width}`}>{item?.email}</div>
      <div className={`${items[6].width}`}>{item?.phone.number}</div>
      <div className={`${items[7].width}`}>{item?.subscription.type}</div>
      <div className={`${items[8].width}`}>
        {item?.addresses[0] && item?.addresses[0]?.address}
      </div>
      <div className={`${items[9].width}`}>{FormatDate(item.createdAt)}</div>
      <div className={`${items[10].width}`}>{FormatDate(item.lastLoginAt)}</div>
    </div>
  );
};

export default Item;
