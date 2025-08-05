"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, User, Lock, Trash2, LogOut, Camera, Edit3, Save, X, Hospital } from "lucide-react";
import Image from "next/image";
import { useHospitalInfo } from "@/contexts/HospitalInfoContext";

export default function ProfilePage() {

  const { hospitalInfo, updateHospitalInfo } = useHospitalInfo();
  const [formData, setFormData] = useState(hospitalInfo);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(hospitalInfo);
  }, [hospitalInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    updateHospitalInfo(formData);
    setSaved(true);
  };

  const { user, updateProfile, changePassword, deleteAccount, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profileImage);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!user) return null;

  const handleProfileSave = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and Email cannot be empty");
      return;
    }

    const success = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      profileImage: profileImage,
    });

    if (success) {
      alert("Profile updated successfully");
      setEditMode(false);
    } else {
      alert("Failed to update profile");
    }
  };

  const handleProfileAndPasswordSave = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and Email cannot be empty");
      return;
    }

    // Save profile first
    const success = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      profileImage: profileImage,
    });

    if (!success) {
      alert("Failed to update profile");
      return;
    }

    // Handle password change if fields are filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("Please fill all password fields to change password");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New password and confirm password do not match");
        return;
      }
      
      const passwordSuccess = await changePassword(currentPassword, newPassword);
      if (!passwordSuccess) {
        setPasswordError("Failed to change password");
        return;
      }
      
      // Clear password fields on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    }

    alert("Profile updated successfully" + (currentPassword ? " and password changed" : ""));
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset all fields to original values
    setName(user?.name || "");
    setEmail(user?.email || "");
    setProfileImage(user?.profileImage);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setPasswordError("");
      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordError("Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      setIsDeleteDialogOpen(false);
      logout();
    } else {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Info Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {!editMode ? (
              <div className="space-y-8">
                {/* Profile Image Display */}
                <div className="flex justify-center">
                  <div className="relative">
                    {user.profileImage ? (
                      <div className="relative">
                        <Image
                          src={user.profileImage}
                          alt="Profile"
                          width={120}
                          height={120}
                          className="rounded-full object-cover border-4 border-slate-200 shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-black/20"></div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-200">
                        <User className="w-12 h-12 text-slate-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-800 font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Email Address</label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-800 font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => setEditMode(true)}
                    className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Profile Image Edit */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Preview"
                        width={120}
                        height={120}
                        className="rounded-full object-cover border-4 border-slate-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-200">
                        <User className="w-12 h-12 text-slate-500" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 p-2 bg-slate-600 text-white rounded-full cursor-pointer hover:bg-slate-700 transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-sm text-slate-500">Click the camera icon to change your profile picture</p>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 border-slate-200 focus:border-slate-400 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="h-12 border-slate-200 focus:border-slate-400 rounded-lg"
                    />
                  </div>
                </div>

                {/* Password Fields in Edit Mode */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Current Password</label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="h-12 border-slate-200 focus:border-slate-400 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="h-12 border-slate-200 focus:border-slate-400 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Confirm New Password</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="h-12 border-slate-200 focus:border-slate-400 rounded-lg"
                      />
                    </div>
                  </div>
                  {passwordError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{passwordError}</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">Leave password fields empty if you don't want to change your password</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-4">
                  <Button 
                    onClick={handleProfileAndPasswordSave}
                    className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save All Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delete Account Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 w-100 mx-auto">
      <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/20 rounded-lg">
            <Hospital className="w-6 h-6" />
          </div>
          Hospital Contact Info
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Hospital Email"
          value={formData.email}
          onChange={handleChange}
          className="bg-white/70 backdrop-blur-sm"
        />
        <Input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="bg-white/70 backdrop-blur-sm"
        />
        <Input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="bg-white/70 backdrop-blur-sm"
        />
        <Button
          onClick={handleSave}
          className="border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-2 rounded-lg font-medium transition-all duration-300"
          variant="outline"
        >
          Save Changes
        </Button>

        {saved && (
          <p className="text-sm text-green-600 mt-2 text-center">Changes saved successfully!</p>
        )}
      </CardContent>
    </Card>

          {/* Logout Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <LogOut className="w-6 h-6" />
                </div>
                Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">End your current session and return to login</p>
                <Button 
                  variant="outline" 
                  onClick={() => logout()}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-slate-800">Confirm Account Deletion</DialogTitle>
              <DialogDescription className="text-slate-600">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 pt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}