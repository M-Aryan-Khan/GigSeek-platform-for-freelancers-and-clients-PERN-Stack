import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import FreelancerNavbar from "./FreelancerNavbar";

export default function FreelancerPastOrders() {
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/freelancer/dashboard");
  };

  useEffect(() => {
    fetchPastOrders();
  }, []);

  const fetchPastOrders = async () => {
    try {
      const freelancerId = localStorage.getItem("freelancer_id");
      if (!freelancerId) {
        toast.error("Authorization expired. Please log in again.");
        navigate("/login");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/gig/freelancer/orders/history",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setPastOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching past orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FreelancerNavbar />
      <button
        onClick={handleBack}
        className="absolute mt-5 ml-5 text-sm font-medium text-white bg-[#0187a4] hover:bg-[#2e636f] py-2 px-4 rounded-md shadow-md"
      >
        Back
      </button>
      <div className="container mx-auto px-4 py-6 mt-8 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Your Past Orders</h1>
        <div className="flex gap-4 mb-6">
          <button
            className="px-4 py-2 hover:bg-[#0187a4] hover:text-white rounded bg-gray-100 text-[#0187a4]"
            onClick={() => navigate("/freelancer/current-orders")}
          >
            Pending Orders
          </button>
          <button className="px-4 py-2 bg-[#0187a4] text-white rounded">
            History
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : pastOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastOrders.map((order) => (
              <div
                key={order.order_id}
                className="border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-2">
                  Title: {order.gig_title}
                </h2>
                <p className="text-gray-600 mb-1">
                  Client: {order.client_name}
                </p>
                <p className="text-gray-600 mb-1">
                  Price: ${order.amount_to_pay}
                </p>
                <p className="text-gray-600 mb-2">
                  Status:{" "}
                  {order.order_status === "C" ? "Completed" : "Cancelled"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No past orders found.</p>
        )}
      </div>
    </>
  );
}
