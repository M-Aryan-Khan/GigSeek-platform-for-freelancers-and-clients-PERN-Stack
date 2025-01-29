import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "./ClientNavbar";

export default function ClientProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleBack = () => {
    navigate("/client/dashboard");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const clientId = localStorage.getItem("client_id");
      if (!clientId) {
        toast.error("Authorization expired. Please log in again.");
        navigate("/login");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/client/${clientId}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setProfile(response.data.client);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    const clientId = localStorage.getItem("client_id");
    if (!clientId) {
      toast.error("Authorization expired. Please log in again.");
      navigate("/login");
      return;
    }
    e.preventDefault();
    if (!profile.fullname.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!profile.email.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/client/${clientId}/profile/edit`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating");
    }
  };

  const handlePasswordSubmit = async (e) => {
    const clientId = localStorage.getItem("client_id");
    if (!clientId) {
      toast.error("Authorization expired. Please log in again.");
      navigate("/login");
      return;
    }
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/client/${clientId}/profile/edit/password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("Password changed successfully");
        setPasswords({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setIsChangingPassword(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while changing the password"
      );
    }
  };

  return (
    <>
      <ClientNavbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <button
          onClick={handleBack}
          className="top-4 left-4 text-sm font-medium text-white bg-[#0187a4] hover:bg-[#2e636f] py-2 px-4 rounded-md shadow-md"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Client Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={profile.fullname}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              ) : (
                <p className="mt-1 text-lg">
                  {profile.fullname || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              ) : (
                <p className="mt-1 text-lg">
                  {profile.email || "Not provided"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0187a4] hover:bg-[#345a62] focus:outline-none"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0187a4] hover:bg-[#2e636f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwords.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0187a4] hover:bg-[#2e636f] focus:outline-none focus:ring-2 focus:ring-offset-2 "
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsChangingPassword(true)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0187a4] hover:bg-[#2e636f] focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Change Password
            </button>
          )}
        </div>
      </div>
    </>
  );
}
