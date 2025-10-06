"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface Order {
  _id: string;
  totalAmount: number; // in cents
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
       <main className="min-h-screen bg-gray-50 text-slate-800 py-8 w-full">
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse p-4 border rounded-lg shadow-sm bg-gray-100 h-24"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-5 border rounded-xl shadow-sm bg-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-right mt-4 sm:mt-0">
                <p className="font-bold text-lg text-gray-900">
                  ${(order.totalAmount / 100).toFixed(2)}
                </p>
                <Link
                  href={`/orders/${order._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </main>
  );
}
