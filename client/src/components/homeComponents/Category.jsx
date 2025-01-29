import React from "react";

import communication from "../../assests/communication.png";
import sales from "../../assests/sales.png";
import programming from "../../assests/programming.png";
import finance from "../../assests/finance.png";
import management from "../../assests/management.png";
import service from "../../assests/service.png";
import support from "../../assests/support.png";
import figma from "../../assests/figma.png";

export default function Category() {
  return (
    <div className="py-24 bg-gradient-to-t from-white to-[#d6d7dd] flex flex-col justify-center items-center">
      <div className="text-4xl font-semibold text-center">
        <h1 className="text-[#0f1137]">
          Explore <span className="text-[#0187a4]">Categories</span>
        </h1>
      </div>
      <div className="w-[80%] mt-10 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="h-56 w-56 ml-10 bg-[#cbccd3] rounded-lg shadow-2xl flex flex-col">
            <div>
              <img src={communication} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Communication & Management</h1>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
          <div className="h-56 w-56 bg-[#cbccd3] rounded-lg shadow-2xl">
          <div>
              <img src={sales} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Sales <br /> Management</h1>
            </div>
            <div>
              <p className=" mt-3 mx-4 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
          <div className="h-56 w-56 bg-[#cbccd3] rounded-lg shadow-2xl">
          <div>
              <img src={programming} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Coding Or<br /> Development</h1>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
          <div className="h-56 w-56 mr-10 bg-[#cbccd3] rounded-lg shadow-2xl">
          <div>
              <img src={finance} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Finance <br /> Management</h1>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-10">
          <div className="h-56 w-56 ml-10 bg-[#cbccd3] rounded-lg shadow-2xl">
          <div>
              <img src={management} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Management <br />Services</h1>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
          <div className="h-56 w-56 bg-[#cbccd3] rounded-lg shadow-2xl">
          <div>
              <img src={service} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Customer <br />Service</h1>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
          <div className="h-56 w-56 bg-[#cbccd3] rounded-lg shadow-2xl">
          <div>
              <img src={support} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Customer <br />Support</h1>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
          <div className="h-56 w-56 mr-10 bg-[#cbccd3] rounded-lg shadow-2xl">
          <div>
              <img src={figma} alt="" className="w-10 m-4" />
            </div>
            <div>
              <h1 className="mx-4 font-bold">Ui/Ux <br />Designer</h1>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm">
                Here you can find your best job. Explore millions of jobs
              </p>
            </div>
            <div>
              <p className="mx-4 mt-3 text-sm text-[#0187a4] font-semibold">
                2k job vacancy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
