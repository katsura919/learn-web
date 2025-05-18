"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileForm from "@/components/settings/profile-form"; // Component for user info
import ChangePasswordForm from "@/components/settings/change-password-form";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile" className="mt-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="password">
            <ChangePasswordForm/>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
