"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getProfile, updateProfile, User } from "@/services/userService";

export default function EditProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData();
    formData.append("firstName", (form.elements.namedItem("firstName") as HTMLInputElement).value);
    formData.append("lastName", (form.elements.namedItem("lastName") as HTMLInputElement).value);
    formData.append("email", (form.elements.namedItem("email") as HTMLInputElement).value);

    const imageInput = form.elements.namedItem("profileImage") as HTMLInputElement;
    if (imageInput.files && imageInput.files.length > 0) {
      formData.append("profileImage", imageInput.files[0]);
    }

    try {
      await updateProfile(formData);
      router.push("/dashboard/profile");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Edit Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your personal information and social links.
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8">
        <form onSubmit={handleSave} className="flex flex-col">
          <div className="space-y-10">
            {/* Personal Information */}
            <div>
              <h5 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-100 pb-4 dark:border-gray-800">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>First Name</Label>
                  <Input type="text" name="firstName" defaultValue={profile?.firstName || ""} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Last Name</Label>
                  <Input type="text" name="lastName" defaultValue={profile?.lastName || ""} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Email Address</Label>
                  <Input type="email" name="email" defaultValue={profile?.email || ""} />
                </div>
                <div className="col-span-2">
                  <Label>Profile Picture</Label>
                  <Input type="file" name="profileImage" accept="image/*" />
                  {profile?.imageUrl && (
                    <div className="mt-2 text-sm text-gray-500">
                      Current: <img src={API_URL + profile.imageUrl} alt="Profile" className="h-10 w-10 rounded-full inline-block object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
            <Link
              href="/dashboard/profile"
              className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            >
              Cancel
            </Link>
            <Button size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

