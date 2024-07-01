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
  padding?: any;
  returnKeyType?: any;
  inputMode?: string;
  disabled?: boolean;
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
  padding,
  id,
  returnKeyType,
  disabled,
}) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      const pattern = /[0-9]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  };
  return (
    <div className="rounded-xl w-full h-full shadow-md flex items-center bg-white">
      <input
        id={id}
        ref={ref}
        autoFocus={autoFocus}
        placeholder={label}
        value={value}
        onChange={onChange}
        type={type}
        enterKeyHint={returnKeyType}
        maxLength={maxLength || 50}
        className={`${padding ? padding : "p-4"} w-full rounded-xl ${
          disabled ? "text-gray-400" : "text-black"
        } bg-white`}
        onKeyDown={onKeyDown}
        onKeyPress={handleKeyPress}
        disabled={disabled}
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
