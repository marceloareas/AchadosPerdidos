import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import "./Tab.scss";
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef((props, ref) => {
  const { className = "", ...rest } = props;
  return (
    <TabsPrimitive.List
      ref={ref}
      className={`tabs-list-base ${className}`}
      {...rest}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef((props, ref) => {
  const { className = "", ...rest } = props;
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={`tabs-trigger-base ${className}`}
      {...rest}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef((props, ref) => {
  const { className = "", ...rest } = props;
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={`tabs-content-base ${className}`}
      {...rest}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
