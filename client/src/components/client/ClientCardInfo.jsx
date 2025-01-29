import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "./ClientNavbar";
import axios from "axios";

export default function ClientCardInfo({ clientId }) {
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [cardNumber, setCardNumber] = useState("");

  const handleBack = () => {
    navigate("/client/dashboard");
  };

  useEffect(() => {
    fetchCard();
  }, [clientId]);

  const fetchCard = async () => {
    const clientId = localStorage.getItem("client_id");
    if (!clientId) {
      toast.error("Authorization expired. Please log in again.");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/client/${clientId}/card`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) setCard(response.data.card);
    } catch (error) {
      if (error.response && error.response.data) {
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const addCard = async () => {
    const clientId = localStorage.getItem("client_id");
    if (!clientId) {
      toast.error("Authorization expired. Please log in again.");
      navigate("/login");
      return;
    }
    if (cardNumber.length !== 16) {
      toast.error("Enter a valid 16-digit card number");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/client/${clientId}/card/add`,
        { cardNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("Card added successfully");
        setCard(null);
        setCardNumber("");
        fetchCard();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const deleteCard = async () => {
    const clientId = localStorage.getItem("client_id");
    if (!clientId) {
      toast.error("Authorization expired. Please log in again.");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/client/${clientId}/card/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          params: { cardNumber },
        }
      );
      if (response.data.success) {
        toast.success("Card deleted successfully");
        setCard(null);
        fetchCard();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <ClientNavbar/>
      <div className="flex items-center justify-center mt-20">
        <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={handleBack}
            className="top-4 left-4 text-sm font-medium text-white bg-[#0187a4] hover:bg-[#2e636f] py-2 px-4 rounded-md shadow-md mb-6"
          >
            Back
          </button>
          <h2 className="text-xl font-semibold mb-4">
            Client Card Information
          </h2>
          {card ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium">Card Number:</span>{" "}
                {card.card_number}
              </p>
              <button
                onClick={deleteCard}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Delete Card
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCard();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-10 w-full border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0187a4] text-white py-2 px-4 rounded hover:bg-[#296471] transition"
              >
                Add Card
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
