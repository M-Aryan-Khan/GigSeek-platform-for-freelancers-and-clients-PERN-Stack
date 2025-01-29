import React from "react";

export default function LeftRequirements() {
  return (
    <div className="mt-5 w-[75%]">
      <div>
        <h1 className="text-[40px] font-bold text-[#0f1137] px-20">
          Steps to easily find right
          <span className="text-[40px] font-bold text-[#0187a4] pl-4">
            Talent.
          </span>
        </h1>
      </div>
      <div className="ml-20 mt-8">
        <div className="flex items-center gap-5">
          <div className="w-3 h-3  rounded-[50%] bg-[#0187a4]"></div>
          <h1 className="font-bold text-2xl">Create Your Account</h1>
        </div>
        <div className="ml-7 mt-2">We will review your account and then will approve it</div>
      </div>
      <div className="ml-20 mt-8">
        <div className="flex items-center gap-5">
          <div className="w-3 h-3 rounded-[50%] bg-[#0187a4]"></div>
          <h1 className="font-bold text-2xl">Browse Gigs</h1>
        </div>
        <div className="ml-7 mt-2">Select the gig you want for your work</div>
      </div>
    </div>
  );
}
