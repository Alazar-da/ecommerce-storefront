// app/admin/orders/vieworders/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Order } from "@/types/Order";

export default function AdminOrderDetails() {
  const params = useParams() as { id: string };
  const id = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/getorder?id=${id}`);
      if (!res.ok) throw new Error("Unable to fetch order");
      setOrder(await res.json());
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (payload: any) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/orders/getorder?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
      const updated = await res.json();
      setOrder(updated);
      toast.success("Updated");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/getorder?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed");
      }
      toast.success("Deleted");
      fetchOrder();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

 /*  const refund = async () => {
    if (!confirm("Refund this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/refund?id=${id}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Refund failed");
      }
      toast.success("Refunded");
      fetchOrder();
    } catch (err: any) {
      toast.error(err.message || "Refund failed");
    }
  }; */

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  const total = (order.totalAmount / 100).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id}</h1>
          <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => updateOrder({ status: "shipped" })} className="px-3 py-2 bg-blue-600 text-white rounded">Mark Shipped</button>
          <button onClick={() => deleteOrder(order._id)} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Items</h2>
        <div className="space-y-2">
          {order.items.map((it: any, i: number) => (
            <div key={i} className="flex justify-between items-center border-b last:border-b-0 py-2">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
              </div>
              <div className="text-right">
                <div>${(it.price * it.quantity / 100).toFixed(2)}</div>
                <div className="text-sm text-gray-500">${(it.price / 100).toFixed(2)} each</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-sm">User: {order.userId}</p>
            <p className="text-sm">PaymentIntent: {order.paymentIntentId || "—"}</p>
            <p className="text-sm">Payment method: {order.paymentMethod || "—"}</p>
            <p className="text-sm">Status: <span className="capitalize">{order.status}</span></p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${total}</div>
          </div>
        </div>

  {/*       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Carrier</label>
            <input type="text" defaultValue={order.shipping?.carrier || ""} className="border rounded px-3 py-2 w-full" id="carrier" />
          </div>
          <div>
            <label className="block text-sm mb-1">Tracking #</label>
            <input type="text" defaultValue={order.shipping?.trackingNumber || ""} className="border rounded px-3 py-2 w-full" id="tracking" />
          </div>
        </div> */}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              const carrier = (document.getElementById("carrier") as HTMLInputElement).value;
              const tracking = (document.getElementById("tracking") as HTMLInputElement).value;
              updateOrder({ shipping: { carrier, trackingNumber: tracking } });
            }}
            className="px-3 py-2 bg-green-600 text-white rounded"
            disabled={updating}
          >
            Save Shipping
          </button>
          <button onClick={() => updateOrder({ status: "cancelled" })} className="px-3 py-2 bg-gray-200 rounded">Cancel Order</button>
        </div>
      </div>
    </div>
  );
}
