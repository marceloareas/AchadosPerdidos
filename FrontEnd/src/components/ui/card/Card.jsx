import React from "react";
import MuiCard from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";

export const Card = ({ children, ...props }) => {
  return <MuiCard {...props}>{children}</MuiCard>;
};

export const CardTitle = ({ children, ...props }) => {
  return (
    <Typography variant="h6" component="h3" {...props}>
      {children}
    </Typography>
  );
};

export const CardDescription = ({ children, ...props }) => {
  return (
    <Typography variant="body2" color="text.secondary" {...props}>
      {children}
    </Typography>
  );
};

export const CardContentWrapper = ({ children, ...props }) => {
  return <CardContent {...props}>{children}</CardContent>;
};

export const CardHeaderWrapper = ({ title, subheader, ...props }) => {
  return <CardHeader title={title} subheader={subheader} {...props} />;
};

export const CardFooter = ({ children, ...props }) => {
  return <CardActions {...props}>{children}</CardActions>;
};
