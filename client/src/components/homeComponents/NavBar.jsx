import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assests/logo.png";

export default function NavBar({ frontRef, categoryRef, reviewsRef }) {
  const [activeTab, setActiveTab] = useState("Home");

  const handleScroll = (section) => {
    setActiveTab(section);
    if (section === "Home") {
      frontRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "Categories") {
      categoryRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "Reviews") {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="h-16 w-full flex items-center justify-center text-[#0f1137] fixed bg-[#d6d7dd]">
      <div className="h-12 w-[85%] flex items-center justify-between">
        <button className="m-2 flex items-center justify-center cursor-default">
          <img src={Logo} alt="" className="w-8 self-center" />
          <span className="font-semibold text-lg">Gig </span>
          <span className="font-semibold text-lg text-[#0187a4]">Hive</span>
        </button>
        <div className="m-2 font-semibold">
          <ul className="flex gap-8">
            <li
              onClick={() => handleScroll("Home")}
              className={`cursor-pointer hover:text-[#0187a4] ${
                activeTab === "Home"
                  ? "text-[#0187a4] border-b-2 border-[#0187a4]"
                  : ""
              }`}
            >
              Home
            </li>
            <li
              onClick={() => handleScroll("Categories")}
              className={`cursor-pointer hover:text-[#0187a4] ${
                activeTab === "Categories"
                  ? "text-[#0187a4] border-b-2 border-[#0187a4]"
                  : ""
              }`}
            >
              Categories
            </li>
            <li
              onClick={() => handleScroll("Reviews")}
              className={`cursor-pointer hover:text-[#0187a4] ${
                activeTab === "Reviews"
                  ? "text-[#0187a4] border-b-2 border-[#0187a4]"
                  : ""
              }`}
            >
              Reviews
            </li>
          </ul>
        </div>
        <div className="m-2 gap-6 flex font-semibold">
          <Link to="/signup">
            <button className="border-2 border-[#0187a4] w-24 h-9 rounded-lg text-[#0f1137] hover:bg-[#0187a4] hover:text-white transition-all duration-500 ease-in-out">
              SignUp
            </button>
          </Link>
          <Link to="/login">
            <button className="border-2 hover:border-2 border-[#d6d7dd] hover:border-[#0187a4] hover:bg-[#d6d7dd] w-24 h-9 rounded-lg hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-500 ease-in-out hover:bg-transparent">
              LogIn
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
