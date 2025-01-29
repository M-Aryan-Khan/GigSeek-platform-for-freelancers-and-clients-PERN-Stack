import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import FreelancerNavbar from "../freelancer/FreelancerNavbar";

export default function FreelancerProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    bio: "",
    education: "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleBack = () => {
    navigate("/freelancer/dashboard");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        setSkills([...skills, inputValue.trim()]);
        setInputValue("");
      } else {
        toast.error("Skill already exists");
      }
    }
  };

  const handleSubmit = async (e) => {
    const freelancerId = localStorage.getItem("freelancer_id");
    if (!freelancerId) {
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
        `http://localhost:5000/freelancer/${freelancerId}/profile/edit`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await axios.post(
        `http://localhost:5000/freelancer/${freelancerId}/skills/edit`,
        { skills },
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
    const freelancerId = localStorage.getItem("freelancer_id");
    if (!freelancerId) {
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
        `http://localhost:5000/freelancer/${freelancerId}/change-password`,
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

  useEffect(() => {
    const fetchSkills = async () => {
      const freelancerId = localStorage.getItem("freelancer_id");
      if (!freelancerId) {
        toast.error("Authorization expired. Please log in again.");
        navigate("/login");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const skillsResponse = await axios.get(
          `http://localhost:5000/freelancer/${freelancerId}/skills`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (skillsResponse.data.success) {
          setSkills(
            skillsResponse.data.skills.map((skill) => skill.skill_name)
          );
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast.error("Failed to fetch skills");
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const freelancerId = localStorage.getItem("freelancer_id");
      if (!freelancerId) {
        toast.error("Authorization expired. Please log in again.");
        navigate("/login");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/freelancer/${freelancerId}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setProfile(response.data.freelancer);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const freelancerId = localStorage.getItem("freelancer_id");
      if (!freelancerId) {
        toast.error("Authorization expired. Please log in again.");
        navigate("/login");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const reviewsResponse = await axios.get(
          `http://localhost:5000/freelancer/${freelancerId}/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (reviewsResponse.data.success) {
          setReviews(reviewsResponse.data.reviews);
        } else {
          toast.error(
            reviewsResponse.data.message || "Failed to fetch reviews."
          );
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to fetch reviews");
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <FreelancerNavbar />
      <div className="w-full flex gap-10 justify-center items-center">
        <div className="w-[40%] my-6 p-6 bg-white rounded-lg shadow-lg">
          <button
            onClick={handleBack}
            className="top-4 left-4 text-sm font-medium text-white bg-[#0187a4] hover:bg-[#2e636f] py-2 px-4 rounded-md shadow-md"
          >
            Back
          </button>

          <h1 className="text-3xl font-bold text-center mb-6">
            Freelancer Profile
          </h1>
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

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ) : (
                  <p className="mt-1 text-lg">
                    {profile.bio || "No bio provided"}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="education"
                  className="block text-sm font-medium text-gray-700"
                >
                  Education
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={profile.education}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ) : (
                  <p className="mt-1 text-lg">
                    {profile.education || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      placeholder="Add Skills"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Press Enter to add a skill. For better results, add at
                      least 3 skills.
                    </p>
                  </>
                ) : null}
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 px-4 py-2 rounded-xl flex items-center"
                    >
                      <span className="mr-2 text-sm">{skill}</span>
                      {isEditing && (
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => removeSkill(skill)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
        <div className="w-[40%] h-[30rem] my-6 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Reviews</h1>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews found.</p>
          ) : (
            <div
              className="max-h-[24rem] overflow-y-auto p-4 bg-gray-50 rounded-md shadow-inner"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#0187a4 #f0f0f0",
              }}
            >
              <ul className="space-y-4">
                {reviews.map((review, index) => (
                  <li
                    key={index}
                    className="p-3 bg-white rounded-md shadow-md border border-gray-200"
                  >
                    <p className="font-semibold text-[#0187a4]">
                      {review.fullname}
                    </p>
                    <p className="text-gray-700">{review.review_text}</p>
                  </li>
                ))}
                
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
