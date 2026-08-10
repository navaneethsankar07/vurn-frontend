import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";
import { useProfileQuery } from "../api/accountQueries";
import { formatDate, formatDateTime } from "@/utils/date";
import type { GeneralSettingsFormData } from "../types";

export default function GeneralSettingsPage() {
  const { data, isLoading, isError } = useProfileQuery();

  const [formData, setFormData] = useState<GeneralSettingsFormData>({
    full_name: "",
    username: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    if (data?.user) {
      setFormData({
        full_name: data.user.full_name || "",
        username: data.user.username || "",
        email: data.user.email || "",
        avatar: data.user.avatar || null,
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Handle image preview or file state update for API upload
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call PATCH/PUT API mutation here with formData
    console.log("Submitting settings update:", formData);
  };

  if (isLoading) {
    return (
      <div className="font-mono text-sm text-gray-400">Loading settings...</div>
    );
  }

  if (isError || !data) {
    return (
      <div className="font-mono text-sm text-red-400">
        Failed to load account settings.
      </div>
    );
  }

  const { user } = data;
  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="w-full max-w-5xl space-y-8 font-mono">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          General Settings
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Manage your personal account details and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs text-gray-300">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-300">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[3px] border border-white/10 bg-[#141416] text-base font-semibold text-gray-300 overflow-hidden">
              {typeof formData.avatar === "string" && formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={user.full_name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <label className="cursor-pointer rounded-[3px] border border-white/10 bg-[#141416] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10">
              Upload picture
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>

            <span className="text-xs text-gray-500">
              PNG or JPG. 1MB maximum.
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-300">
            Language <span className="text-gray-500">(Coming Soon)</span>
          </label>
          <div className="relative">
            <select
              disabled
              className="w-full appearance-none rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
            >
              <option>English (US)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 rounded-[3px] border border-white/10 overflow-hidden sm:grid-cols-2">
          <div className="bg-[#030303] p-4 flex items-center gap-3">
            <Clock className="h-4 w-4 text-gray-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-500">Account Created</span>
              <span className="text-xs text-gray-200">
                {formatDate(user.created_at)}
              </span>
            </div>
          </div>

          <div className="bg-[#030303] p-4 flex items-center gap-3">
            <Globe className="h-4 w-4 text-gray-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-500">Last Login</span>
              <span className="text-xs text-gray-200">
                {formatDateTime(user.last_login)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-white/10">
          <button
            type="submit"
            className="rounded-[3px] border border-amber-500/80 bg-amber-500/10 px-6 py-2.5 text-xs font-semibold text-amber-500 transition-colors hover:bg-amber-500/20"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}