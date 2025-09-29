import React from "react";
import style from "./Badge.module.scss";

const Badge = ({ badgeType, type, label }) => {
  let badgeClass = "";
  if(badgeType === "item") {
    if(type === "lost") { 
      badgeClass = style.lost;
    } else if(type === "found") {
      badgeClass = style.found;
    } else if(type === "returned") {
      badgeClass = style.returned;
    } else {
      return;
    }
  } else if (badgeType === "category") {
    badgeClass = style.category;
  } else {
    return;
  }

  return (
    <div className={`${style.badge} ${badgeClass}`}>
      {label}
    </div>
  )
  
};

export default Badge;
