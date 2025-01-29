import React, { useState, useRef, useEffect } from "react";
import Logo from "../../assests/logo.png";
import dollar from "../../assests/dollar.png";
import account from "../../assests/account.png";
import heart from "../../assests/heart.png";
import questions from "../../assests/question.png";
import logout from "../../assests/log-out.png";
import { useNavigate, Link } from "react-router-dom";
import down from "../../assests/down.png";
import axios from "axios";
import { toast } from "sonner";

export default function HrNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [OrdersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [showSavedTooltip, setShowSavedTooltip] = useState(false);
  const [profile, setProfile] = useState({
    fullname: "",
  });
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      localStorage.removeItem("client_id");
      const res = await axios.get("http://localhost:5000/client/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="h-16 w-full flex items-center justify-center text-[#0f1137] bg-[#ffffff] border-b-2 z-20">
      <div className="h-12 w-[95%] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="m-2 flex items-center justify-center cursor-default">
            <img src={Logo} alt="" className="w-10 self-center" />
            <span className="font-semibold text-xl">Gig </span>
            <span className="font-semibold text-xl text-[#0187a4]">Hive</span>
          </button>

          <div
            className="relative flex items-center justify-center cursor-pointer gap-1"
            onMouseEnter={() => setOrdersDropdownOpen(true)}
            onMouseLeave={() => setOrdersDropdownOpen(false)}
          >
            <p className="py-2">Orders </p>
            <img src={down} alt="down" className="w-4 h-4 mt-[0.15rem]" />
            {OrdersDropdownOpen && (
              <div className="absolute top-10 bg-white text-gray-900 text-md rounded-md shadow-[0_4px_10px_rgba(0,0,0,0.25)] z-30 left-[-20%] w-40">
                <ul className="p-3">
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    <Link to="/client/my-orders">Pending Orders</Link>
                  </li>
                  <hr className="w-[95%]" />
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    <Link to="/client/completed-orders">Completed Orders</Link>
                  </li>
                  <hr className="w-[95%]" />
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    <Link to="/client/orders-history">Orders History</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="m-2 gap-7 flex font-semibold relative items-center">
          <div className="relative flex items-center">
            <img
              src={questions}
              alt="Help & Support"
              className="w-5 h-5 cursor-pointer"
              onMouseEnter={() => setShowHelpTooltip(true)}
              onMouseLeave={() => setShowHelpTooltip(false)}
            />
            {showHelpTooltip && (
              <div className="absolute top-8 left-[-30px] bg-white text-gray-800 text-md rounded-md h-10 py-1 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                <p className="px-3 whitespace-nowrap">Help</p>
              </div>
            )}
          </div>

          <div className="relative flex items-center">
            <img
              src={heart}
              alt="Saved Gig"
              className="w-5 h-5 cursor-pointer"
              onMouseEnter={() => setShowSavedTooltip(true)}
              onMouseLeave={() => setShowSavedTooltip(false)}
            />
            {showSavedTooltip && (
              <div className="absolute top-8 left-[-70px] bg-white text-gray-800 text-md rounded-md h-10 py-1 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                <p className="px-3 whitespace-nowrap">Saved Gig</p>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <img
              src={account}
              alt="Account"
              className="w-7 h-7 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                <div className="my-6 flex items-center justify-center">
                  <p>{profile.fullname}</p>
                </div>
                <ul className="pb-2 text-gray-700 flex flex-col items-center justify-center">
                  <hr className="w-[75%] m-auto" />
                  <li className="my-2 px-4 py-2 hover:text-[#0187a4] cursor-pointer flex justify-start items-center gap-4 w-[90%]">
                    <img src={account} className="w-6"></img>
                    <Link to="/client/profile">My profile</Link>
                  </li>
                  <hr className="w-[75%] m-auto" />
                  <li className="my-2 px-4 py-2 hover:text-[#0187a4] cursor-pointer flex justify-start items-center gap-4 w-[90%]">
                    <img src={dollar} className="w-6"></img>
                    <Link to="/client/balance">Balance</Link>
                  </li>
                  <hr className="w-[75%] m-auto" />
                  <li
                    className="my-2 px-4 py-2 hover:text-[#0187a4] cursor-pointer flex justify-start items-center gap-4 w-[90%]"
                    onClick={logoutHandler}
                  >
                    <img src={logout} className="w-6"></img>
                    <a className="">Logout</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
