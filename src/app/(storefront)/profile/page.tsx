"use client";

import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, User } from "@/services/userService";
import { User as UserIcon } from "lucide-react";
import { getImageUrl } from "@/utils/apiConfig";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile(false);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      await updateProfile(formData, false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      fetchProfile(); // Refresh profile to get the new image URL
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500 dark:bg-gray-800 dark:border-gray-700">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Personal Information</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              defaultValue={profile?.firstName || ""}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              defaultValue={profile?.lastName || ""}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              defaultValue={profile?.email || ""}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Profile Picture
            </label>
            <div className="flex items-center gap-6 mt-2">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                {profile?.imageUrl ? (
                  <img
                    src={getImageUrl(profile.imageUrl)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <UserIcon size={32} />
                  </div>
                )}
              </div>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-white dark:hover:file:bg-gray-600 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 mt-8 dark:border-gray-700">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-100"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

