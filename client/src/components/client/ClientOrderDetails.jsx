import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import ClientNavbar from "./ClientNavbar";

export default function ClientOrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [showReviewInput, setShowReviewInput] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/client/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (action === "giveReview" && review.trim() === "") {
      toast.error("Please enter a review before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = { action, reviewText: action === "giveReview" ? review : null };
      const response = await axios.post(
        `http://localhost:5000/client/order/${orderId}/confirm`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        if (action === "giveReview") {
          setReview("");
          setShowReviewInput(false);
        }
        navigate("/client/completed-orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(`Error processing ${action} action:`, error);
      toast.error("An error occurred while processing your request");
    }
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/client/order/${orderId}/cancel`, {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/client/my-orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    navigate(order?.order_status === "P" ? "/client/my-orders" : "/client/completed-orders");
  };

  if (loading) {
    return <p className="text-center mt-16 text-gray-500">Loading order details...</p>;
  }

  if (!order) {
    return <p className="text-center mt-16 text-gray-500">Order not found</p>;
  }

  return (
    <>
      <ClientNavbar />
      <div className="container mx-auto px-4 py-6 mt-2">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <button
            onClick={handleBack}
            className="mb-3 text-sm font-medium text-white bg-[#0187a4] hover:bg-[#2e636f] py-2 px-4 rounded-md shadow-md"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold mb-6">Order Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Gig Title</h3>
              <p className="text-gray-700">{order.gig_title}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Order ID</h3>
              <p className="text-gray-700">{order.order_id}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Order Description</h3>
              <p className="text-gray-700">{order.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Freelancer</h3>
              <p className="text-gray-700">{order.freelancer_name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Price</h3>
              <p className="text-gray-700">${order.amount_to_pay}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Status</h3>
              <p className="text-gray-700">
                {order.order_status === "P"
                  ? "Pending"
                  : order.order_status === "C"
                  ? "Completed"
                  : "Cancelled"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Order Date</h3>
              <p className="text-gray-700">{new Date(order.created_at).toLocaleString()}</p>
            </div>
            {order.order_status === "C" && (
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => handleAction("markAsDone")}
                  className="px-4 py-2 border-2 hover:border-2 border-white hover:border-[#0187a4] hover:bg-[#ffffff] rounded-lg hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-100 ease-in-out hover:bg-transparent"
                  disabled={showReviewInput}
                >
                  Mark as Done
                </button>
                <button
                  onClick={() => setShowReviewInput(true)}
                  className="px-4 py-2 border-2 hover:border-2 hover:border-white border-[#0187a4] bg-[#ffffff] rounded-lg text-[#0f1137] hover:bg-[#418695] hover:text-white transition-all duration-100 ease-in-out hover:bg-transparent"
                  disabled={showReviewInput}
                >
                  Give Review
                </button>
                {showReviewInput && (
                  <div>
                    <textarea
                      className="w-full border rounded p-2 m-0 my-4"
                      placeholder="Write your review here..."
                      rows={3}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <button
                      onClick={() => handleAction("giveReview")}
                      className="px-4 py-2 border-2 hover:border-2 border-white hover:border-[#0187a4] hover:bg-[#ffffff] rounded-lg hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-100 ease-in-out hover:bg-transparent"
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            )}
            {order.order_status === "P" && (<button
                  onClick={handleCancel}
                  className="px-4 py-2 border-2 hover:border-2 border-white hover:border-red-500 hover:bg-[#ffffff] rounded-lg hover:text-[#0f1137] bg-red-500 text-white transition-all duration-100 ease-in-out hover:bg-transparent"
                >
                  Cancel Order
                </button>)}
          </div>
        </div>
      </div>
    </>
  );
}
