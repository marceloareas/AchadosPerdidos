import React, { useState } from "react";
import Input from "../input/Input.jsx";
import { FaRegEdit } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import "./InputUpdate.scss";

const InputUpdate = React.forwardRef(
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
    const [readOnly, setReadOnly] = useState(true);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const isPassword = type === "password";

    return (
      <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
        <TextField
          inputRef={ref}
          type={isPassword && !showPassword ? "password" : "text"}
          label={label}
          variant="outlined"
          className={`custom-inputUpdate ${className}`}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          disabled={readOnly}
          InputProps={
            isPassword
              ? {
                  endAdornment: (
                    <InputAdornment className="icon_password" position="end">
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
        <FaRegEdit
          style={{ cursor: "pointer" }}
          size={35}
          onClick={() => setReadOnly(!readOnly)}
        />
      </div>
    );
  }
);
//   { label, className = "", multiline = false, rows = 4, ...props },
//   ref
// ) => {
//   const [readOnly, setReadOnly] = useState(true);
//   return (
//     <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
//       <Input
//         {...props}
//         slotProps={{
//           input: {
//             readOnly: readOnly,
//           },
//         }}
//         type={props.type}
//         required
//       />
//       <FaRegEdit
//         style={{ cursor: "pointer" }}
//         size={35}
//         onClick={() => setReadOnly(!readOnly)}
//       />
//     </div>
//   );
InputUpdate.displayName = "InputUpdate";
export default InputUpdate;
