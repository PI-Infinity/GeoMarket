import Tooltip from "@mui/material/Tooltip";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdClose, MdFileCopy } from "react-icons/md";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useApp } from "../context/app";

interface PropsType {
  setOpenShareOptions: any;
  path: string;
}

const ShareComponent: React.FC<PropsType> = ({ setOpenShareOptions, path }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const { activeLanguage } = useApp();

  const textToCopy = "https://geomarket.shop" + path;

  const handleCopyClick = () => {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Prevent scrolling to bottom of page in MS Edge.
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setIsTooltipOpen(true);
        setTimeout(() => {
          setIsTooltipOpen(false);
        }, 2000);
      } else {
        console.error("Failed to copy text.");
      }
    } catch (err) {
      console.error("Could not copy text: ", err);
    }

    document.body.removeChild(textArea);
  };

  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  return (
    <div
      style={{
        height: transition ? 0 : "50px",
        opacity: transition ? 0 : "1",
        transform: `scale(${transition ? 0 : "1"})`,
        transition: "ease 200ms",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: `${transition ? "0" : "10px 0 0 0"}`,
        gap: "10px",
      }}
    >
      {/* Fallback social media share buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FacebookShareButton url={textToCopy}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TelegramShareButton url={textToCopy}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton url={textToCopy}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
      <Tooltip title={activeLanguage?.copied} open={isTooltipOpen}>
        <button
          onClick={handleCopyClick}
          style={{
            padding: "4px 8px",
            borderRadius: "10px",
            background: "#f1f1f1",
            outline: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            border: "none",
            color: "black",
            cursor: "pointer",
          }}
        >
          <MdFileCopy size={22} className="text-gray-400" />
        </button>
      </Tooltip>
      <div
        onClick={() => setOpenShareOptions(false)}
        className="cursor-pointer hover:brightness-95"
      >
        <MdClose size={24} color="red" />
      </div>
    </div>
  );
};

export default ShareComponent;
