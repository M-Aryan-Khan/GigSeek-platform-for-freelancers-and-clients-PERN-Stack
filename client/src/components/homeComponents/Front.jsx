import React from "react";
import LeftFront from "./LeftFront";
import RightFront from "./RightFront";

export default function Front() {
  return (
    <div className="pl-7 w-full flex items-center justify-center">
      <div className="mt-4 w-[80%] flex items-center justify-between ">
        <LeftFront />
        <RightFront />
      </div>
    </div>
  );
}
