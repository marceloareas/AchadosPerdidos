import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import "./DropdownMenu.scss";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef((props, ref) => {
  const { inset, children, className = "", ...rest } = props;
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={`dm-subtrigger ${inset ? "dm-inset" : ""} ${className}`}
      {...rest}
    >
      {children}
      <ChevronRight className="dm-chevron" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef((props, ref) => {
  const { className = "", ...rest } = props;
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={`dm-subcontent ${className}`}
      {...rest}
    />
  );
});
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuContent = React.forwardRef((props, ref) => {
  const { className = "", sideOffset = 4, ...rest } = props;
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={`dm-content ${className}`}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef((props, ref) => {
  const { inset, className = "", ...rest } = props;
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={`dm-item ${inset ? "dm-inset" : ""} ${className}`}
      {...rest}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef((props, ref) => {
  const { className = "", children, checked, ...rest } = props;
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={`dm-checkbox-item ${className}`}
      {...rest}
    >
      <span className="dm-check-container">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="dm-check-icon" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef((props, ref) => {
  const { className = "", children, ...rest } = props;
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={`dm-radio-item ${className}`}
      {...rest}
    >
      <span className="dm-check-container">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="dm-radio-icon" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef((props, ref) => {
  const { inset, className = "", ...rest } = props;
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={`dm-label ${inset ? "dm-inset" : ""} ${className}`}
      {...rest}
    />
  );
});
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef((props, ref) => {
  const { className = "", ...rest } = props;
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={`dm-separator ${className}`}
      {...rest}
    />
  );
});
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({ className = "", ...props }) => (
  <span className={`dm-shortcut ${className}`} {...props} />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
