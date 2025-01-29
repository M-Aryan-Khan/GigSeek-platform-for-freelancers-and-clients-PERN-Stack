import React from "react";

export default function GigPostStep({
  stepNumber,
  stepTitle,
  mainTitle,
  descriptionText,
}) {
  return (
    <div className="flex flex-col gap-4 w-[45%] flex-wrap">
      <div className="flex gap-7 text-gray-500">
        <p className="text-sm">{stepNumber}</p>
        <p className="text-sm">{stepTitle}</p>
      </div>
      <div>
        <h1 className="text-4xl font-semibold">{mainTitle}</h1>
      </div>
      <div>
        <h1 className="text-md text-gray-500">{descriptionText}</h1>
      </div>
    </div>
  );
}
