import React from "react";
import TextField from "@mui/material/TextField";
import "./Input.scss";

const Input = React.forwardRef(
  ({ type = "text", label, className = "", multiline = false, rows = 4, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        type={type}
        label={label}
        variant="outlined"
        className={`custom-input ${className}`}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
