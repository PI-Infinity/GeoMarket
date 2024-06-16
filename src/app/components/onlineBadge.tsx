import { Badge, BadgeProps } from "@mui/material";
import styled from "styled-components";

interface OnlineBadgeProps extends BadgeProps {
  isonline: string;
}

export const OnlineBadge = styled(Badge)<OnlineBadgeProps>(({ isonline }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: isonline === "online" ? "#44b700" : "#d3d3d3", // green if online, gray if offline
    color: isonline === "online" ? "#44b700" : "#d3d3d3",
    boxShadow: `0 0 0 2px rgba(255,255,255,0.8)`,
    "&::after":
      isonline === "online"
        ? {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
          }
        : {},
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
