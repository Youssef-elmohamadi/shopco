"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import React, { useActionState } from "react";
import PasswordInput from "./PasswordInput";
import ClientCheckbox from "./ClientCheckbox";
import SubmitButton from "@/components/ui/button/SubmitButton";
import { registerUser, AuthState } from "@/actions/auth";

const initialState: AuthState = { success: false };

export default function SignUpForm() {
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full px-4 sm:px-8 overflow-y-auto no-scrollbar justify-center py-6 sm:py-10">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto my-auto pb-10">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="mb-8">
            <h1 className="mb-2 font-bold tracking-tight text-gray-900 text-title-sm dark:text-white sm:text-title-md">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details below to sign up.
            </p>
          </div>
          <div>
            {/* Social logins omitted for brevity as they are not wired up yet, but we can keep them for UI layout */}
            
            <form action={formAction}>
              {state.message && (
                <div className={`mb-4 p-3 text-sm rounded-lg ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {state.message}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-2 block font-medium text-sm text-gray-700 dark:text-gray-300">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="John"
                      className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                    />
                    {state.errors?.firstName && (
                      <p className="mt-1 text-xs text-red-500">{state.errors.firstName[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2 block font-medium text-sm text-gray-700 dark:text-gray-300">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Doe"
                      className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                    />
                    {state.errors?.lastName && (
                      <p className="mt-1 text-xs text-red-500">{state.errors.lastName[0]}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block font-medium text-sm text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                  />
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
                      placeholder="Create a password"
                      className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                  />
                  {state.errors?.password && (
                    <p className="mt-1 text-xs text-red-500">{state.errors.password[0]}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-2 block font-medium text-sm text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </Label>
                  <PasswordInput
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                  />
                  {state.errors?.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{state.errors.confirmPassword[0]}</p>
                  )}
                  {state.errors?.ConfirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{state.errors.ConfirmPassword[0]}</p>
                  )}
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <div className="mt-0.5">
                    <ClientCheckbox
                      className="w-5 h-5"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    I agree to the{" "}
                    <Link href="#" className="text-black hover:underline dark:text-white">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-black hover:underline dark:text-white">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
                <div className="pt-4">
                  <SubmitButton className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-medium text-sm transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/5 dark:shadow-white/5">
                    Create Account
                  </SubmitButton>
                </div>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-black hover:underline dark:text-white"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
