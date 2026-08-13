"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useActionState } from "react";
import PasswordInput from "./PasswordInput";
import ClientCheckbox from "./ClientCheckbox";
import SubmitButton from "@/components/ui/button/SubmitButton";
import { loginUser, AuthState } from "@/actions/auth";

const initialState: AuthState = { success: false };

export default function SignInForm() {
  const [state, formAction] = useActionState(loginUser, initialState);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full px-4 sm:px-8">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-all hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            <ChevronLeftIcon />
          </span>
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="mb-8">
            <h1 className="mb-2 font-bold tracking-tight text-gray-900 text-title-sm dark:text-white sm:text-title-md">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in.
            </p>
          </div>
          <div>
            {/* Social logins omitted for brevity as they are not wired up yet, but we can keep them for UI layout */}
            
            <form action={formAction}>
              <input type="hidden" name="redirectTo" value="/home" />
              {state.message && (
                <div className={`mb-4 p-3 text-sm rounded-lg ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {state.message}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <Label className="mb-2 block font-medium text-sm text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative group">
                    <Input 
                      name="email"
                      placeholder="Enter your email" 
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
                    Password
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
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <ClientCheckbox name="remember" />
                    <span className="block font-medium text-gray-600 text-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm font-medium text-black hover:underline dark:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="pt-2">
                  <SubmitButton className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-medium text-sm transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/5 dark:shadow-white/5">
                    Sign in
                  </SubmitButton>
                </div>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Don&apos;t have an account? {" "}
                <Link
                  href="/signup"
                  className="text-black hover:underline dark:text-white"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
