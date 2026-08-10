import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { ChangePasswordFormData } from "../types";

export default function SecuritySettingsPage() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call password update API mutation here
    console.log("Updating password:", formData);
  };

  return (
    <div className="w-full max-w-5xl space-y-8 font-mono">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Security
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Manage your personal account preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-white">Change Password</h3>
          <p className="mt-1 text-xs text-gray-400">
            Use a strong, unique password to protect your account.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-300">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-300">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-300">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-[3px] border border-white/10 bg-[#030303] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="rounded-[3px] border border-amber-500/80 bg-amber-500/10 px-5 py-2 text-xs font-semibold text-amber-500 transition-colors hover:bg-amber-500/20"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}