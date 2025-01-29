import React from "react";
import Logo from "../../assests/logo.png";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
    <div className="h-full mt-64 bg-[#c0c1c8] rounded-t-[3rem]">
      <div className="flex justify-center">
        <div className="w-[70%] h-60 bg-[#0187a4] absolute -mt-48 rounded-2xl text-center flex flex-col justify-center items-center">
          <h1 className="text-[40px] font-bold text-[#ececf0] px-20">
            Get Notified About Your
          </h1>
          <h1 className="text-[40px] font-bold text-[#ececf0] px-20">
            Required Gig
          </h1>
          <div className="relative w-[35%] mt-2">
            <input
              type="email"
              className="h-12 w-full bg-[#ececf0] text-black placeholder-black rounded-md pl-4 pr-20 outline-none"
              placeholder="Enter your email address"
            />
            <button className="absolute right-1 top-1 bottom-1 border-2 hover:border-2 border-[#ececf0] hover:border-[#0187a4] px-4 rounded-md hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-500 ease-in-out hover:bg-transparent">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[70%] h-72 mt-12 rounded-2xl text-left flex justify-between items-center">
          <div className="flex flex-col gap-6">
            <button className="flex items-center cursor-default">
              <img src={Logo} alt="" className="w-8" />
              <span className="font-semibold text-lg">Gig </span>
              <span className="font-semibold text-lg text-[#0187a4]">Hive</span>
            </button>
            <p>
              Here you can find best talent .Explore <br /> millions of
              freelancers with us.
            </p>
            <div className="flex gap-5">
              <SocialIcon url="https://www.linkedin.com/in/m-aryan-khan-2ba789247/" />
              <SocialIcon url="https://www.instagram.com/thearyankhan_13/" />
              <SocialIcon url="https://www.facebook.com/thearyankhan_13/" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="font-bold">Service</h1>
            <div className="flex flex-col gap-3">
              <p>Overview</p>
              <p>Features</p>
              <p>Releases</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="font-bold">Company</h1>
            <div className="flex flex-col gap-3">
              <p>About</p>
              <p>Careers</p>
              <p>Contact</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="font-bold">Service</h1>
            <div className="flex flex-col gap-3">
              <p>Help Center</p>
              <p>Terms of Sevices</p>
              <p>Privacy Policy</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="font-bold">Contact</h1>
            <div className="flex flex-col gap-3">
              <p>info@gighive.com</p>
              <p>021-111-99999</p>
              <p>Karachi, Pk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
