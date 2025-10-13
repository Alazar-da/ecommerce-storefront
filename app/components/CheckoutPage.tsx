"use client";

import React, { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Order } from "@/types/Order";

interface CheckoutPageProps {
  order: Order;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // ✅ Step 0: Create PaymentIntent when page loads
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: order.totalAmount, // in cents
            orderId: order._id,
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    };

    createPaymentIntent();
  }, [order]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage("Stripe has not loaded yet.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Step 1: Confirm Payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success/?amount=${order.totalAmount / 100}`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      // ✅ Step 2: If payment succeeded, update order in DB
      if (paymentIntent?.status === "succeeded") {
        const response = await fetch(`/api/order/getorder?id=${order._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "paid",
            paymentMethod: paymentIntent.payment_method_types?.[0] || "stripe",
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to update order status");
        }

        window.location.href = `${window.location.origin}/payment-success/?amount=${order.totalAmount / 100}`;
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret ? (
        <PaymentElement />
      ) : (
        <p>Loading payment form...</p>
      )}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      <button
        disabled={!stripe || loading || !clientSecret}
        className="text-white w-full p-4 bg-slate-900 mt-3 rounded-md font-bold hover:bg-slate-700 transition hover:cursor-pointer"
      >
        {loading ? "Processing..." : `Pay $${order.totalAmount / 100}`}
      </button>
    </form>
  );
};

export default CheckoutPage;
