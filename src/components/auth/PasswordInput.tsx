"use client";
import Input from "@/components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {}

export default function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative group">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        {showPassword ? (
          <EyeIcon className="fill-current w-5 h-5" />
        ) : (
          <EyeCloseIcon className="fill-current w-5 h-5" />
        )}
      </button>
    </div>
  );
}
