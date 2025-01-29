import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientNavbar from "./ClientNavbar";
import axios from "axios";
import { toast } from "sonner";

export default function ClientGigView() {
  const [gig, setGig] = useState(null);
  const [freelancerProfile, setFreelancerProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const { gig_id } = useParams();
  const navigate = useNavigate();

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    const fetchGigAndFreelancerDetails = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        if (!clientId) {
          toast.error("Authorization expired. Please log in again.");
          navigate("/login");
          return;
        }
        const token = localStorage.getItem("token");
        const gigResponse = await axios.get(
          `http://localhost:5000/gig/${gig_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (gigResponse.data.success) {
          setGig(gigResponse.data.gig);

          const freelancerResponse = await axios.get(
            `http://localhost:5000/freelancer/${gigResponse.data.gig.freelancer_id}/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          if (freelancerResponse.data.success) {
            setFreelancerProfile(freelancerResponse.data.freelancer);
          }

          const skillsResponse = await axios.get(
            `http://localhost:5000/freelancer/${gigResponse.data.gig.freelancer_id}/skills`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          if (skillsResponse.data.success) {
            setFreelancerProfile((prevProfile) => ({
              ...prevProfile,
              skills: skillsResponse.data.skills.map(
                (skill) => skill.skill_name
              ),
            }));
          }

          const reviewsResponse = await axios.get(
            `http://localhost:5000/freelancer/${gigResponse.data.gig.freelancer_id}/reviews`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          if (reviewsResponse.data.success) {
            setReviews(reviewsResponse.data.reviews);
          }
        } else {
          console.error("Failed to fetch gig:", gigResponse.data.message);
          setError(gigResponse.data.message);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to fetch details");
        setLoading(false);
      }
    };

    fetchGigAndFreelancerDetails();
  }, [gig_id]);

  const setHoursInput = (value) => {
    if (value >= 1) setHours(value);
  };

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1)
      return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return interval === 1
        ? `${interval} month ago`
        : `${interval} months ago`;
    interval = Math.floor(seconds / 604800);
    if (interval >= 1)
      return interval === 1 ? `${interval} week ago` : `${interval} weeks ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1)
      return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return interval === 1 ? `${interval} hr ago` : `${interval} hrs ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return interval === 1 ? `${interval} min ago` : `${interval} mins ago`;
    return seconds === 1 ? `${seconds} sec ago` : `${seconds} secs ago`;
  };

  const handleBuyGig = async () => {
    if (!description) {
      toast.error("Add description first before buying");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/gig/${gig_id}/buy`,
        { amount: gig.price * hours, description },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/client/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error buying gig:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to purchase Gig");
      } else {
        toast.error("Failed to purchase Gig, Try again");
      }
    }
  };

  return (
    <>
      <ClientNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mt-2">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/5"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/5"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 font-semibold mt-10">{error}</div>
          ) : gig ? (
            <>
              <div className="flex gap-10">
                <div className="w-[60%] flex flex-col gap-3">
                  <div className="flex items-end gap-3">
                    <h1 className="text-3xl font-semibold">{gig.title}</h1>
                    <h1 className="text-md font-semibold text-gray-500">
                      ({timeSince(gig.created_at)})
                    </h1>
                  </div>
                  <h1 className="text-xl font-semibold">
                    By {gig.freelancer_name}
                  </h1>
                  <div className="flex flex-col gap-3 mt-3">
                    <h1 className="text-lg font-semibold">About this gig:</h1>
                    <p>{gig.description}</p>
                    <div className="mt-2">
                      <h1 className="text-md font-semibold">
                        Before Buying add description for freelancer, that what
                        you want?
                      </h1>
                      <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows="5"
                        className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:outline-none p-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-[40%] shadow-lg p-4 flex flex-col gap-4">
                  <h1 className="text-xl font-semibold">
                    {gig.gig_type === "hourly"
                      ? "This is an hourly based gig and price will be for per hour job"
                      : "This is a fixed price gig and price cannot vary in this"}
                  </h1>
                  <h1 className="text-md font-semibold text-gray-600">
                    {gig.gig_type === "hourly"
                      ? "If your work is more you can search for fixed price gig that will be beneficial to you"
                      : "If you have less work you can search same type of gig in hourly based gig"}
                  </h1>
                  <div className="flex flex-col mt-2 gap-1">
                    <h1 className="text-xl font-semibold">
                      {gig.gig_type === "hourly"
                        ? `$${gig.price}/hr`
                        : `$${gig.price}/-`}
                    </h1>
                    {gig.gig_type === "hourly" && (
                      <div className="flex gap-2 items-end">
                        <p>Select no. of hours</p>
                        <input
                          onChange={(e) => setHoursInput(e.target.value)}
                          min={1}
                          value={hours}
                          type="number"
                          className="border text-lg px-1 border-gray-400 focus:outline-none w-14 rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex justify-between mt-2 px-4">
                      <span className="text-gray-600">Total Price</span>
                      <span className="text-gray-900 text-lg">
                        ${gig.price * hours}/-
                      </span>
                    </div>
                    <button
                      className="mt-2 w-full bg-[#0187a4] text-white py-3 rounded-lg text-xl hover:bg-[#296a78]"
                      onClick={handleBuyGig}
                    >
                      Buy Gig
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div className="mt-6 flex gap-10">
          {freelancerProfile && (
            <div className="w-[50%] p-6 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-6">Freelancer Profile</h1>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0187a4]">
                    Full Name
                  </label>
                  <p className="mt-1 text-lg">
                    {freelancerProfile.fullname || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0187a4]">
                    Email
                  </label>
                  <p className="mt-1 text-lg">
                    {freelancerProfile.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0187a4]">
                    Bio
                  </label>
                  <p className="mt-1 text-lg">
                    {freelancerProfile.bio || "No bio provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0187a4]">
                    Education
                  </label>
                  <p className="mt-1 text-lg">
                    {freelancerProfile.education || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0187a4]">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {freelancerProfile.skills &&
                      freelancerProfile.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 px-4 py-2 rounded-xl"
                        >
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="w-[50%] p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Reviews</h1>
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
      </div>
    </>
  );
}
