import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import FreelancerNavbar from "./FreelancerNavbar";

export default function FreelancerOrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    if (order.order_status == "P") navigate("/freelancer/current-orders");
    else navigate("/freelancer/orders-history");
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const freelancerId = localStorage.getItem("freelancer_id");
      if (!freelancerId) {
        toast.error("Authorization expired. Please log in again.");
        navigate("/login");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/freelancer/order/${orderId}`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/freelancer/order/${orderId}/submit`,{},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("Order submitted successfully");
        navigate("/freelancer/current-orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-16 text-gray-500">
        Loading order details...
      </p>
    );
  }

  if (!order) {
    return <p className="text-center mt-16 text-gray-500">Order not found</p>;
  }

  return (
    <>
      <FreelancerNavbar />
      <div className="container mx-auto px-4 py-6 mt-2">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <button
            onClick={handleBack}
            className="mb-3 text-sm font-medium text-white bg-[#0187a4] hover:bg-[o.description] py-2 px-4 rounded-md shadow-md"
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
              <h3 className="text-lg font-semibold">Client</h3>
              <p className="text-gray-700">{order.client_name}</p>
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
              <p className="text-gray-700">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            {order.order_status === "P" && (
              <button
                onClick={handleSubmitOrder}
                className={`mt-4 px-4 py-2 rounded ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-[#0187a4] hover:bg-[#406c76] text-white"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
