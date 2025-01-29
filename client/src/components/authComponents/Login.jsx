import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assests/logo.png";
import Freelancer from "../../assests/Freelancer.png";
import HR from "../../assests/HR.png";

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        selectedRole === "freelancer"
          ? "http://localhost:5000/freelancer/login"
          : "http://localhost:5000/client/login";

      const res = await axios.post(endpoint, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success(res.data.message);
      setInput({ email: "", password: "" });
      if (selectedRole === "freelancer") {
        const { freelancer_id } = res.data.freelancer;
        localStorage.setItem("freelancer_id", freelancer_id);
        localStorage.setItem("token", res.token);
      } else {
        const { client_id } = res.data.client;
        localStorage.setItem("client_id", client_id);
        localStorage.setItem("token", res.token);
      }

      navigate(
        selectedRole === "freelancer"
          ? "/freelancer/dashboard"
          : "/client/dashboard"
      );
    } catch (error) {
      console.error(error);
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
    <div className="flex items-center w-screen h-screen justify-center bg-[#d6d7dd] ">
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center rounded-xl">
        <div className="h-[31rem] w-full md:w-[50%] bg-[#ececef] p-6 flex flex-col justify-center items-center border-b-2 md:border-b-0 md:border-r-2 border-[#0187a4] gap-6 shadow-lg rounded-l-xl">
          <p className="font-semibold text-center">
            Login as a <b className="text-[#0187a4]">Client</b> or{" "}
            <b className="text-[#0187a4]">Freelancer</b>
          </p>

          <div
            onClick={() => setSelectedRole("freelancer")}
            className={`flex flex-col justify-between items-center w-full sm:w-[90%] p-4 cursor-pointer border-2 
          ${
            selectedRole === "freelancer"
              ? "border-[#0187a4]"
              : "border-gray-300"
          }`}
          >
            <img src={Freelancer} alt="Freelancer" className="w-24 md:w-40" />
            <p className="font-semibold">Freelancer</p>
          </div>

          <div
            onClick={() => setSelectedRole("client")}
            className={`flex flex-col justify-between items-center w-full sm:w-[90%] p-4 cursor-pointer border-2 
          ${
            selectedRole === "client" ? "border-[#0187a4]" : "border-gray-300"
          }`}
          >
            <img src={HR} alt="Client" className="w-24 md:w-40" />
            <p className="font-semibold">Client</p>
          </div>
        </div>

        <form
          onSubmit={loginHandler}
          className="h-[31rem] shadow-lg flex flex-col gap-5 p-6 w-full md:w-[50%] bg-[#ececef] border-t-2 md:border-t-0 md:border-l-2 border-[#0187a4] rounded-r-xl"
        >
          <div className="my-2 flex flex-col items-center">
            <img src={Logo} alt="logo" className="w-10 md:w-12 mb-2" />
            <p className="text-sm text-center">
              <b className="text-[#0187a4]">Login Now</b> to start your{" "}
              <b className="text-[#0187a4]">Career</b> or hire{" "}
              <b className="text-[#0187a4]">Talent</b>
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-10 my-2 px-2"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Password</span>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-10 my-2 px-2"
            />
          </div>

          {loading ? (
            <button className="bg-[#0187a4] text-white h-10 rounded-md" disabled>
              Please wait...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#0187a4] hover:bg-[#3f656d] text-white h-10 rounded-md disabled:bg-[#3f656d]"
              disabled={!selectedRole}
            >
              Login
            </button>
          )}

          <span className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
