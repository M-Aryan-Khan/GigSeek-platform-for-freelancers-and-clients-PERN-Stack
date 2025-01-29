import React, { useState, useEffect } from "react";
import axios from "axios";
import info from "../../assests/info.png";
import ClientPostDisplay from "./ClientPostDisplay";
import { Search } from "lucide-react";

export default function Component() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/gigs/all", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (res.data.success) {
          setPosts(res.data.gigs);
        } else {
          console.error("Failed to fetch posts:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex items-center gap-2 relative">
            <h1 className="text-3xl font-semibold">Browse All Gigs</h1>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="focus:outline-none"
              aria-label="Information about browsing gigs"
            >
              <img src={info} alt="" className="w-6 h-6 cursor-pointer" />
            </button>
            {showTooltip && (
              <div className="absolute left-full ml-2 top-0 bg-white text-gray-800 text-md rounded-md py-1 px-3 shadow-[0_4px_10px_rgba(0,0,0,0.25)] whitespace-nowrap">
                Browse through Gigs
              </div>
            )}
          </div>
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-black rounded-md focus:outline-none focus:ring focus:ring-[#0187a4]"
              aria-label="Search gigs"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"
              size={20}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-start gap-y-6 gap-10">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <ClientPostDisplay key={post.gig_id} post={post} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No gigs found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
