import React, { useState, useEffect } from "react";
import FreelancerNavbar from "./FreelancerNavbar";
import bulb from "../../assests/bulb.png";
import clock from "../../assests/clock.png";
import priceTag from "../../assests/price-tag.png";
import GigPostStep from "./GigPostStep";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

export default function FreelancerPostGig() {
  const { gig_id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState(5);
  const [priceType, setPriceType] = useState("hourly");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  useEffect(() => {
    const fetchGigData = async () => {
      if (gig_id) {
        setIsEdit(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/gig/${gig_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            const gig = response.data.gig;
            setTitle(gig.title);
            setDescription(gig.description);
            setSalary(gig.price);
            setPriceType(gig.gig_type);
          }
        } catch (error) {
          console.error("Error fetching gig data:", error);
          toast.error("Failed to fetch gig data");
        }
      }
    };

    fetchGigData();
  }, [gig_id]);

  const progressPercentage = (step / 4) * 100;

  const handlePriceTypeChange = (type) => {
    setPriceType(type);
    setSalary("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (salary < 5) {
      toast.error("Minimum salary is $5");
      return;
    }

    const gigData = {
      title,
      description,
      price: salary,
      gig_type: priceType,
    };

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      let response;
      if (isEdit) {
        response = await axios.post(
          `http://localhost:5000/gig/edit/${gig_id}`,
          gigData,
          { headers, withCredentials: true }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/gig/addgig",
          gigData,
          { headers, withCredentials: true }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/freelancer/dashboard");
      } else {
        throw new Error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting gig:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while submitting the gig"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FreelancerNavbar />
      <div className="w-[80%] h-10 mt-10 bg-gray-100 mx-auto flex items-center rounded-lg">
        <img src={bulb} alt="" className="ml-4" />
        <p className="ml-6">
          Just a reminder when publishing your gig, Think like a client what
          details he needs
        </p>
      </div>
      <div className="pt-10 w-[65%] mx-auto mb-20">
        {step === 1 && (
          <div className="flex">
            <GigPostStep
              stepNumber="1/4"
              stepTitle={isEdit ? "Edit Gig" : "Gig Post"}
              mainTitle="Let's start with a strong title."
              descriptionText="This helps your Gig stand out to the right candidates. It’s the first thing they’ll see, so make it count!"
            />
            <div className="w-[7%]"></div>
            <div className="flex flex-col w-[48%] mt-5">
              <p className="font-[500]">Write a title of your Gig post</p>
              <input
                className="block p-2 border mt-2 w-full rounded-lg"
                placeholder="Enter Gig Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <ul className="mt-3 ml-3 font-[500]">
                Example title:
                <li className="ml-3 font-normal">
                  Build responsive WordPress site with booking/payment
                  functionality
                </li>
              </ul>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex">
            <GigPostStep
              stepNumber="2/4"
              stepTitle={isEdit ? "Edit Gig" : "Gig Post"}
              mainTitle="Start the Description."
              descriptionText="Clients are looking for: Clear expectations about your task or deliverables, The skills required for your work, Good communication, Details about how you or your team like to work"
            />
            <div className="w-[7%]"></div>
            <div className="flex flex-col w-[48%] mt-5">
              <p className="font-[500]">Describe what you need?</p>
              <textarea
                className="block p-2 border mt-4 w-full rounded-lg"
                rows="8"
                placeholder="Enter Gig Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="mt-6">Need Help?</p>
              <a
                href="https://help.fiverr.com/hc/en-us/articles/360010451397-Creating-a-Gig"
                className="text-[#5cb5c7] font-semibold underline"
                target="_blank"
              >
                See examples from fiverr
              </a>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex">
            <GigPostStep
              stepNumber="3/4"
              stepTitle={isEdit ? "Edit Gig" : "Gig Post"}
              mainTitle="Tell client your Fees"
              descriptionText="This will help us match you to client within their range."
            />
            <div className="w-[7%]"></div>
            <div className="flex flex-col w-[48%] mt-5">
              <div className="flex justify-between items-center">
                <div
                  onClick={() => handlePriceTypeChange("hourly")}
                  className={`w-[48%] border-2 h-28 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-200 ease-in-out ${
                    priceType === "hourly"
                      ? "border-[#5cb5c7] border-2 bg-[#f3f2f2]"
                      : ""
                  }`}
                >
                  <div className="w-[80%] h-[80%] ml-2 flex justify-between">
                    <div className="flex flex-col justify-between my-3">
                      <img src={clock} alt="" className="w-5 h-5" />
                      <p>Hourly Rate</p>
                    </div>
                    <div
                      className={`w-6 h-6 border-2 border-black rounded-[50%] transition-all duration-200 ease-in-out ${
                        priceType === "hourly" ? "bg-[#5cb5c7]" : ""
                      }`}
                    ></div>
                  </div>
                </div>
                <div
                  onClick={() => handlePriceTypeChange("fixed")}
                  className={`w-[48%] border-2 h-28 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-200 ease-in-out ${
                    priceType === "fixed"
                      ? "border-[#5cb5c7] border-2 bg-[#f3f2f2]"
                      : ""
                  }`}
                >
                  <div className="w-[80%] h-[80%] ml-2 flex justify-between">
                    <div className="flex flex-col justify-between my-3">
                      <img src={priceTag} alt="" className="w-5 h-5" />
                      <p>Fixed Price</p>
                    </div>
                    <div
                      className={`w-6 h-6 border-2 border-black rounded-[50%] transition-all duration-200 ease-in-out ${
                        priceType === "fixed" ? "bg-[#5cb5c7]" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              {priceType === "hourly" && (
                <p className="mt-8 font-semibold">
                  Enter the hourly rate price
                </p>
              )}
              {priceType === "fixed" && (
                <p className="mt-8 font-semibold">Enter the fixed price</p>
              )}
              <div className="flex items-center gap-2 mt-3 ">
                <input
                  className="block p-2 border w-[25%] rounded-lg"
                  placeholder="5"
                  type="number"
                  min={5}
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
                {priceType === "hourly" && <span className="text-lg">/hr</span>}
                {priceType === "fixed" && <span className="text-lg">/-</span>}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                (min: 5$) Before setting rate make sure to check the rates
                online
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex">
            <GigPostStep
              stepNumber="4/4"
              stepTitle={isEdit ? "Edit Gig" : "Gig Post"}
              mainTitle="Post Your Gig."
              descriptionText="Post your Gig and hunt for best talents out there."
            />
            <div className="flex flex-col w-[48%] mt-8 self-start">
              {loading ? (
                <button
                  className="text-xl border-2 border-[#d6d7dd] bg-[#0187a4] text-white cursor-not-allowed p-4 "
                  disabled
                >
                  Please wait...
                </button>
              ) : (
                <button
                  className="text-xl border-2 hover:border-2 border-[#d6d7dd] hover:border-[#0187a4] hover:bg-[#ffffff] rounded-lg hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-500 ease-in-out hover:bg-transparent p-4"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isEdit
                    ? "Update Gig"
                    : "Post Gig"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
        <div className="relative pt-1">
          <div className="overflow-hidden h-1 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#5cb5c7] transition-all duration-500"
            />
          </div>
        </div>

        <div className="flex justify-between p-4">
          {step === 1 ? (
            <button
              className="w-24 h-10 ml-5 rounded-lg border-2 border-[#0187a4] text-[#0f1137] hover:bg-[#0187a4] hover:text-white transition-all duration-500 ease-in-out"
              onClick={() => navigate("/freelancer/dashboard")}
            >
              Cancel
            </button>
          ) : (
            <button
              className={`w-24 h-10 ml-5 rounded-lg  ${
                step === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "border-2 border-[#0187a4] text-[#0f1137] hover:bg-[#0187a4] hover:text-white transition-all duration-500 ease-in-out"
              }`}
              onClick={prevStep}
              disabled={step === 1}
            >
              Back
            </button>
          )}
          <button
            className={`w-24 h-10 ml-5 rounded-lg  ${
              step === 4
                ? "bg-gray-300 cursor-not-allowed"
                : "border-2 hover:border-2 border-[#d6d7dd] hover:border-[#0187a4] hover:bg-[#ffffff] w-24 h-10 rounded-lg hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-500 ease-in-out hover:bg-transparent"
            }`}
            onClick={nextStep}
            disabled={step === 4}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
