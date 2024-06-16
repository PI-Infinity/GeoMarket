import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

interface PropsType {
  label: string;
  value: any;
  onChange: (e: any) => void;
  type: string;
  warning?: boolean;
  onKeyDown?: (prev: any) => void;
  textarea?: boolean;
  id?: string;
  maxLength?: number;
  showPassword?: boolean;
  handleClickShowPassword?: any;
  handleMouseDownPassword?: any;
  password?: boolean;
  ref?: any;
  autoFocus?: any;
}

export const Input: React.FC<PropsType> = ({
  label,
  value,
  onChange,
  type,
  maxLength,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  password,
  onKeyDown,
  ref,
  autoFocus,
}) => {
  return (
    <div className="rounded-xl w-full h-full shadow-md flex items-center bg-white">
      <input
        ref={ref}
        autoFocus={autoFocus}
        placeholder={label}
        value={value}
        onChange={onChange}
        type={type}
        maxLength={maxLength || 50}
        className="p-4 w-full rounded-xl text-black bg-white"
        onKeyDown={onKeyDown}
      />
      {password && (
        <InputAdornment position="end" className="pr-2 bg-white">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
          >
            {showPassword ? (
              <MdVisibility color={"gray"} size={22} />
            ) : (
              <MdVisibilityOff color={"gray"} size={22} />
            )}
          </IconButton>
        </InputAdornment>
      )}
    </div>
  );
};
