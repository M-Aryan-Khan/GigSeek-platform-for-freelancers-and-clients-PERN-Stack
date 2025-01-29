import React from "react";
import bin from "../../assests/delete.png";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1)
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  interval = Math.floor(seconds / 604800);
  if (interval >= 1)
    return interval === 1 ? `${interval} week ago` : `${interval} weeks ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval === 1 ? `${interval} hr ago` : `${interval} hrs ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval === 1 ? `${interval} min ago` : `${interval} mins ago`;
  return seconds === 1 ? `${seconds} sec ago` : `${seconds} secs ago`;
};

export default function ClientPostDisplay({ post }) {
  const navigate = useNavigate();

  const truncateTitle = (title) => {
    return title.length > 29 ? `${title.slice(0, 29)}...` : title;
  };

  const handleView = () => {
    navigate(`/gig/view/${post.gig_id}`);
  };
  return (
    <div className="w-80 h-60 flex justify-center items-center border-2 rounded-xl shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
      <div className="w-[85%] h-[88%]">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <p className="text-gray-500">{timeSince(post.created_at)}</p>
          </div>
        </div>
        <div>
          <p className="mt-1 text-gray-900 font-semibold text-lg">
            By {post.freelancer_name}
          </p>
        </div>
        <div className="h-14">
          <p className="mt-3 font-bold text-2xl">{truncateTitle(post.title)}</p>
        </div>
        <hr className="my-5" />
        <div className="mt-2 flex justify-between items-center">
          <p className="py-2 font-semibold text-lg">{`$${post.price}${
            post.gig_type == "hourly" ? "/hr" : "/-"
          }`}</p>
          <button
            className="px-3 py-2 border-2 hover:border-2 border-[#ffffff] hover:border-[#0187a4] hover:bg-[#ffffff] hover:text-[#0f1137] bg-[#0187a4] text-white rounded-lg transition-all duration-200 ease-in-out"
            onClick={handleView}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
