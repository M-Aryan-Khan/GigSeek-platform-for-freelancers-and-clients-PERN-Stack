import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assests/logo.png";
import Freelancer from "../../assests/Freelancer.png";
import HR from "../../assests/HR.png";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const endpoint =
        selectedRole === "freelancer"
          ? "http://localhost:5000/freelancer/register"
          : "http://localhost:5000/client/register";

      const res = await axios.post(endpoint, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success(res.data.message);
      setInput({
        fullname: "",
        email: "",
        password: "",
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-[#d6d7dd]">
      <div className="w-full flex flex-col md:flex-row justify-center rounded-xl">
        <div className="shadow-lg h-[31rem] w-full md:w-[40%] lg:w-[30%] xl:w-[25%] bg-[#ececef] p-8 flex flex-col justify-center items-center border-b-2 md:border-r-2 md:border-b-0 border-[#0187a4] gap-6 rounded-l-xl">
          <p className="font-semibold text-center">
            Join as a <b className="text-[#0187a4]">Client</b> or{" "}
            <b className="text-[#0187a4]">Freelancer</b>
          </p>

          <div
            onClick={() => setSelectedRole("freelancer")}
            className={`flex flex-col justify-between items-center w-[90%] p-4 cursor-pointer border-2 
          ${
            selectedRole === "freelancer"
              ? "border-[#0187a4]"
              : "border-gray-300"
          }`}
          >
            <img src={Freelancer} alt="Freelancer" className="w-32 md:w-40" />
            <p className="font-semibold">Freelancer</p>
          </div>

          <div
            onClick={() => setSelectedRole("client")}
            className={`flex flex-col justify-between items-center w-[90%] p-4 cursor-pointer border-2 
          ${
            selectedRole === "client" ? "border-[#0187a4]" : "border-gray-300"
          }`}
          >
            <img src={HR} alt="Client" className="w-32 md:w-40" />
            <p className="font-semibold">Client</p>
          </div>
        </div>

        <form
          onSubmit={signupHandler}
          className="shadow-lg flex flex-col gap-5 p-8 h-[31rem] w-full md:w-[40%] lg:w-[30%] xl:w-[25%] bg-[#ececef] border-t-2 md:border-l-2 md:border-t-0 border-[#0187a4] rounded-r-xl"
        >
          <div className="my-2 mb-2 flex flex-col items-center">
            <img
              src={Logo}
              alt="logo"
              className="w-10 md:w-12 self-center mb-2"
            />
            <p className="text-sm text-center">
              <b className="text-[#0187a4]">Signup Now</b> to start your{" "}
              <b className="text-[#0187a4]">Career</b> or hire{" "}
              <b className="text-[#0187a4]">Talent</b>
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Full Name</span>
            <input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-7 my-1 pl-2"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-7 my-1 pl-2"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Password</span>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-7 my-1 pl-2"
            />
          </div>

          {loading ? (
            <button className="bg-[#0187a4] text-white h-9 rounded-md" disabled>
              Please wait...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#0187a4] hover:bg-[#3f656d] text-white h-9 rounded-md disabled:bg-[#3f656d]"
              disabled={!selectedRole}
            >
              Signup
            </button>
          )}

          <span className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
