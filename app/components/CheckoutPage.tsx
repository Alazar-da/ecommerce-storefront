"use client";

import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Order } from "@/types/Order";

const CheckoutPage = ({ order }: { order: Order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    // ✅ Step 1: Submit payment form
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    // ✅ Step 2: Confirm payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success/?amount=${order.totalAmount / 100}`,
      },
      redirect: "if_required", // prevents auto-redirect if not needed
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    // ✅ Step 3: If payment is successful → update order status in DB
    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const response = await fetch(`/api/order?id=${order._id}`, {
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

        // ✅ Step 4: Redirect or show success
        window.location.href = `${window.location.origin}/payment-success/?amount=${order.totalAmount / 100}`;
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      <button
        disabled={!stripe || loading}
        className="text-white w-full p-4 bg-slate-900 mt-3 rounded-md font-bold hover:bg-slate-700 transition hover:cursor-pointer"
      >
        {loading ? "Processing..." : `Pay $${order.totalAmount / 100}`}
      </button>
    </form>
  );
};

export default CheckoutPage;
