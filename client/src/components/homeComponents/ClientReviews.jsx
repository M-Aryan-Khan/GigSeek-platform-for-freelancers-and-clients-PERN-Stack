import React from "react";
import dp from "../../assests/dp.png";
import comma from "../../assests/comma.png";

export default function ClientReviews() {
  return (
    <div className="ml-12 pt-10 pb-10">
      <div className="flex pl-32">
        <h1 className="text-[40px] font-bold text-[#0f1137] px-20">
          Our Client
          <span className="text-[40px] font-bold text-[#0187a4] pl-4">
            Reviews
          </span>
        </h1>
      </div>
      <div className="flex mt-10 ml-40">
        <div className="gap-20 flex justify-between ">
          <div className="h-64 w-72 ml-10 bg-[#cfd2d7] rounded-2xl shadow-2xl flex flex-col border-2 border-[#0187a4]">
            <div className="flex justify-between">
              <div>
                <img src={dp} alt="" className="w-10 m-4" />
              </div>
              <div className="">
                <img src={comma} alt="" className="w-10" />
              </div>
            </div>
            <div>
              <h1 className="mx-4">
                Learn from leading universities and canpepicue omnis iste natus
                error sitptatem ausant doremuya laudant. ut perspicatis unde
                omnis iste sit voluptatem accusantium do
              </h1>
            </div>
            <div>
              <p className="mx-4 mt-2 text-sm font-semibold">Ali Khan</p>
            </div>
          </div>
          <div className="h-64 w-72 bg-[#cfd2d7] rounded-2xl shadow-2xl flex flex-col border-2 border-[#0187a4]">
            <div className="flex justify-between">
              <div>
                <img src={dp} alt="" className="w-10 m-4" />
              </div>
              <div className="">
                <img src={comma} alt="" className="w-10" />
              </div>
            </div>
            <div>
              <h1 className="mx-4">
                Learn from leading universities and canpepicue omnis iste natus
                error sitptatem ausant doremuya laudant. ut perspicatis unde
                omnis iste sit voluptatem accusantium do
              </h1>
            </div>
            <div>
              <p className="mx-4 mt-2 text-sm font-semibold">Hasan Ali</p>
            </div>
          </div>
          <div className="h-64 w-72 bg-[#cfd2d7] rounded-2xl shadow-2xl flex flex-col border-2 border-[#0187a4]">
            <div className="flex justify-between">
              <div>
                <img src={dp} alt="" className="w-10 m-4" />
              </div>
              <div className="">
                <img src={comma} alt="" className="w-10" />
              </div>
            </div>
            <div>
              <h1 className="mx-4">
                Learn from leading universities and canpepicue omnis iste natus
                error sitptatem ausant doremuya laudant. ut perspicatis unde
                omnis iste sit voluptatem accusantium do
              </h1>
            </div>
            <div>
              <p className="mx-4 mt-2 text-sm font-semibold">Ibrahim Hasan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
