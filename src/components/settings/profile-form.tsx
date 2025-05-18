"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePic?: string;
}

export default function ProfileForm() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const localUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const userId = localUser?.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        toast.error("Failed to load user profile");
      }
    };
    if (userId && token) fetchUser();
  }, [userId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/profile-pic`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error("Failed to upload picture");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">

      <div className="flex items-center gap-4">
        {user.profilePic && (
          <Image
            src={user.profilePic}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full object-cover border"
          />
        )}
        <div className="space-y-2 flex-1">
          <Label htmlFor="image">Profile Picture</Label>
          <Input id="image" type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          <Button
            onClick={handleUpload}
            variant="secondary"
            className="text-sm"
          >
            Upload
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Username"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
      </div>

      <Button onClick={handleUpdate} disabled={loading} className="w-full">
        {loading ? "Updating..." : "Save Changes"}
      </Button>
    </div>
  );
}
