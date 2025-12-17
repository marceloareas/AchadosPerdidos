import React from "react";
import Button from "@mui/material/Button";
import "./Button.scss";

const CustomButton = ({
  children,
  variant = "default",
  size = "default",
  asChild = false,
  className = "",
  ...props
}) => {
 
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;

  return (
    <Button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
