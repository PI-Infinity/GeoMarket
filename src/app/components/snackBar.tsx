import { Alert, Stack } from "@mui/material";
import { useEffect } from "react";

const SimpleSnackbar = ({ alert, setAlert }: any) => {
  useEffect(() => {
    if (alert.active) {
      setTimeout(() => {
        setAlert({ active: false, type: "", text: "" });
      }, 3000);
    }
  }, [alert]);
  return (
    <>
      {alert.active && (
        <div
          onClick={() => setAlert({ active: false, type: "", text: "" })}
          className="z-30 absolute"
        >
          <Stack
            sx={{
              width: "auto",
              position: "fixed",
              bottom: "24px",
              left: "24px",
            }}
            spacing={2}
          >
            <Alert
              severity={alert.type}
              variant="filled"
              onClick={() => setAlert({ active: false, type: "", text: "" })}
            >
              {alert.text}
            </Alert>
          </Stack>
        </div>
      )}
    </>
  );
};

export default SimpleSnackbar;
