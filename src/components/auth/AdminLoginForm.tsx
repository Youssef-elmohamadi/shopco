"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import React, { useActionState } from "react";
import PasswordInput from "./PasswordInput";
import SubmitButton from "@/components/ui/button/SubmitButton";
import { loginUser, AuthState } from "@/actions/auth";

const initialState: AuthState = { success: false };

export default function AdminLoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div className="backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-black dark:bg-white rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white dark:text-black"
            >
              <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.92V12H5V6.3L12 3.84V11.99Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="mb-2 font-bold tracking-tight text-gray-900 text-title-sm dark:text-white sm:text-title-md">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Authorized Personnel Only
          </p>
        </div>
        
        <div>
          <form action={formAction}>
            <input type="hidden" name="redirectTo" value="/dashboard" />
            <input type="hidden" name="isAdmin" value="true" />
            
            {state.message && (
              <div className={`mb-4 p-3 text-sm rounded-lg ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {state.message}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <Label className="mb-2 block font-medium text-sm text-gray-700 dark:text-gray-300">
                  Administrator Email
                </Label>
                <div className="relative group">
                  <Input 
                    name="email"
                    placeholder="admin@shop.co" 
                    type="email" 
                    className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                  />
                </div>
                {state.errors?.email && (
                  <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
                )}
                {state.errors?.Email && (
                  <p className="mt-1 text-xs text-red-500">{state.errors.Email[0]}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block font-medium text-sm text-gray-700 dark:text-gray-300">
                  Master Password
                </Label>
                <PasswordInput
                  name="password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                />
                {state.errors?.password && (
                  <p className="mt-1 text-xs text-red-500">{state.errors.password[0]}</p>
                )}
                {state.errors?.Password && (
                  <p className="mt-1 text-xs text-red-500">{state.errors.Password[0]}</p>
                )}
              </div>
              
              <div className="pt-4">
                <SubmitButton className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-medium text-sm transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/5 dark:shadow-white/5">
                  Authenticate
                </SubmitButton>
              </div>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Secure System Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
