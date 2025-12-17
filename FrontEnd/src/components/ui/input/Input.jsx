import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import "./Input.scss";

const Input = React.forwardRef(
  (
    {
      type = "text",
      label,
      className = "",
      multiline = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const isPassword = type === "password";

    return (
      <TextField
        inputRef={ref}
        type={isPassword && !showPassword ? "password" : "text"}
        label={label}
        variant="outlined"
        className={`custom-input ${className}`}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        InputProps={
          isPassword
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {" "}
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}
        }
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
