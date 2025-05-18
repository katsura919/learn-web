"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const localUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const userId = localUser?.id;

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    id: string,
    label: string,
    value: string,
    setValue: (val: string) => void,
    show: boolean,
    setShow: (val: boolean) => void
  ) => (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={label}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">

      {renderPasswordInput("currentPassword", "Current Password", currentPassword, setCurrentPassword, showCurrent, setShowCurrent)}
      {renderPasswordInput("newPassword", "New Password", newPassword, setNewPassword, showNew, setShowNew)}
      {renderPasswordInput("confirmPassword", "Confirm New Password", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm)}

      <Button onClick={handleChangePassword} disabled={loading} className="w-full">
        {loading ? "Changing..." : "Change Password"}
      </Button>
    </div>
  );
}
