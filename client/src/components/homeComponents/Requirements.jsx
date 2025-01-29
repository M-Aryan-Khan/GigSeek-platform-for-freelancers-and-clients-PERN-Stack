import React from "react";
import RightRequirements from "./RightRequirements";
import LeftRequirements from "./LeftRequirements";

export default function Requirements() {
  return (
    <div className="pl-10 bg-gradient-to-b from-white to-[#d6d7dd] w-full flex items-center justify-center">
      <div className="mt-4 w-[80%] flex justify-center ">
        <LeftRequirements/>
        <RightRequirements />
      </div>
    </div>
  );
}
