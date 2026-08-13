"use client";
import Checkbox from "@/components/form/input/Checkbox";
import React, { useState } from "react";

interface ClientCheckboxProps extends Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onChange"> {
  defaultChecked?: boolean;
}

export default function ClientCheckbox({ defaultChecked = false, ...props }: ClientCheckboxProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <Checkbox
      {...props}
      checked={isChecked}
      onChange={setIsChecked}
    />
  );
}
