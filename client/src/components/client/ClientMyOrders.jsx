import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import ClientNavbar from "./ClientNavbar";

export default function ClientMyOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/client/dashboard");
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const clientId = localStorage.getItem("client_id");
      if (!clientId) {
        toast.error("Authorization expired. Please log in again.");
        navigate("/login");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/gig/client/orders/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setPendingOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ClientNavbar />
      <button
        onClick={handleBack}
        className="absolute mt-5 ml-5 text-sm font-medium text-white bg-[#0187a4] hover:bg-[#2e636f] py-2 px-4 rounded-md shadow-md"
      >
        Back
      </button>
      <div className="container mx-auto px-4 py-6 mt-8 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-[#0187a4] text-white rounded ">
            Pending Orders
          </button>
          <button
            onClick={() => navigate("/client/completed-orders")}
            className="px-4 py-2 hover:bg-[#0187a4] hover:text-white rounded bg-gray-100 text-[#0187a4]"
          >
            Completed Orders
          </button>
          <button
            onClick={() => navigate("/client/orders-history")}
            className="px-4 py-2 hover:bg-[#0187a4] hover:text-white rounded bg-gray-100 text-[#0187a4]"
          >
            History
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : pendingOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order) => (
              <div
                key={order.order_id}
                className="border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-2">
                  Title: {order.gig_title}
                </h2>
                <p className="text-gray-600 mb-1">Order ID: {order.order_id}</p>
                <p className="text-gray-600 mb-2">
                  Price: ${order.amount_to_pay}
                </p>
                <div className="mt-4">
                  <Link to={`/client/order/${order.order_id}`}>
                    <button className="px-4 py-2 bg-[#0187a4] text-white rounded hover:bg-[#31555d]">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No pending orders found.</p>
        )}
      </div>
    </>
  );
}
