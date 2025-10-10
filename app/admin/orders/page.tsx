// app/admin/orders/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Sidebar from '../components/sidebar';
import { Order } from "@/types/Order";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<"table" | "cards">("table");
     const [activePage, setActivePage] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [q, statusFilter, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
      const updated = await res.json();
      setOrders((s) => s.map((o) => (o._id === id ? updated : o)));
      toast.success("Status updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update status");
    }
  };

  const refundOrder = async (id: string) => {
    if (!confirm("Refund this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}/refund`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Refund failed");
      }
      const data = await res.json();
      toast.success("Refund issued");
      // reload single order
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Refund failed");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed");
      }
      toast.success("Order deleted");
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-100 w-full text-slate-800 pb-6 md:pb-0">
      {/* Include the Sidebar component */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        
      />
      <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders Admin</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1 rounded ${view === "table" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Table
          </button>
          <button
            onClick={() => setView("cards")}
            className={`px-3 py-1 rounded ${view === "cards" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Cards
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by order id, user id or product name"
          className="px-3 py-2 border rounded w-full"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2">
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
        <button onClick={() => { setPage(1); fetchOrders(); }} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : view === "table" ? (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Items</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/admin/orders/${o._id}`} className="text-blue-600 hover:underline">
                      #{o._id.slice(-8)}
                    </Link>
                    <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{o.userId}</td>
                  <td className="px-4 py-3 text-sm">{o.items.length}</td>
                  <td className="px-4 py-3 text-sm">${(o.totalAmount / 100).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2 items-center">
                      <span className="capitalize">{o.status}</span>
                      {/* Quick toggles */}
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="border rounded px-2 text-sm"
                      >
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                        <option value="shipped">shipped</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                        <option value="refunded">refunded</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => refundOrder(o._id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Refund</button>
                      <button onClick={() => deleteOrder(o._id)} className="px-2 py-1 bg-gray-200 rounded text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 flex justify-between items-center">
            <div>Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}</div>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
              <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">Next</button>
            </div>
          </div>
        </div>
      ) : (
        // cards view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/admin/orders/${o._id}`} className="font-semibold text-blue-600">Order #{o._id.slice(-8)}</Link>
                  <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${(o.totalAmount / 100).toFixed(2)}</div>
                  <div className="text-xs">Items: {o.items.length}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm capitalize">{o.status}</div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(o._id, "shipped")} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Mark Shipped</button>
                  <button onClick={() => refundOrder(o._id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Refund</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </section>
    </main>
  );
}
