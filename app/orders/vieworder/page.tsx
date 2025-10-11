"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "../../components/CheckoutPage";
import convertToSubcurrency from "@/utils/convertToSubcurrency";
import { Order } from "@/types/Order";
import { formatPrice } from "@/utils/formatPrice";
import { useSearchParams } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);



export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/getorder?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch order details");
        const data = await res.json();
        setOrder(data);

        // ✅ Create PaymentIntent only if not paid
        if (data.status !== "paid") {
          const paymentRes = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: convertToSubcurrency(data.totalAmount),
              orderId: data._id,
            }),
          });

          const paymentData = await paymentRes.json();
          if (paymentData.clientSecret) setClientSecret(paymentData.clientSecret);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  console.log("order:", order);
  if (loading)
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse">Loading order details...</p>
      </section>
    );

  if (!order)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600">Order not found.</p>
        <Link href="/orders" className="text-emerald-600 hover:underline mt-4">
          Back to Orders
        </Link>
      </div>
    );

  return (
   <section className="min-h-screen bg-gray-50 py-8 text-slate-800">
      <div className="container mx-auto px-4 max-w-5xl">
         <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link href="/orders" className="text-gray-500 hover:text-gray-700">
                Orders
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium capitalize">
                {`#${order._id.slice(-6)}`}
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>

        {/* Order Summary */}
        <div className="p-6 border rounded-xl bg-slate-200 shadow-sm mb-8">
          <p className="text-gray-700 font-medium">
            Order #{order._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <div className="mt-3">
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                order.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="mt-4 font-bold text-lg text-gray-900">
            Total: {formatPrice(order.totalAmount, order.items[0].productId?.currency)}
          </p>
        </div>

        {/* Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-4">
           
                    <img
                      src={item.productId?.imageUrl}
                      alt={item.productId?.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                 
                  <div>
                    <p className="font-medium">{item.productId?.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item?.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  {formatPrice(item.price * item.quantity,item.productId?.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-6 border rounded-xl bg-slate-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3">Payment Info</h2>
          <p>
            <span className="font-medium">Payment ID:</span>{" "}
            {order?.status || "N/A"}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {order?.status === "paid" ? "Paid via Stripe" : "Not Paid"}
          </p>
        </div>

        {/* Stripe Checkout */}
        {order.status !== "paid" && clientSecret && (
          <div className="p-6 border rounded-xl bg-white shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-3">Pay Now</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutPage order={order} />
            </Elements>
          </div>
        )}

        <Link href="/orders" className="text-blue-600 hover:underline text-sm">
          ← Back to Orders
        </Link>
      </div>
    </section>
  );
}
