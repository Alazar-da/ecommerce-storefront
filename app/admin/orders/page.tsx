// app/admin/orders/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Sidebar from '../components/sidebar';
import { Order } from "@/types/Order";
import { FiGrid, FiList, FiSearch, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiEye, FiTrash2, FiUser, FiMail, FiPhone, FiPackage, FiCreditCard, FiCalendar } from "react-icons/fi";
import OrderDetailModal from "../components/OrderDetailModal";
import { formatPrice } from "@/utils/formatPrice";


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activePage, setActivePage] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  useEffect(() => {
    fetchOrders();
  }, [q, statusFilter, page, limit]);

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
  setLoadingAction(true);
  try {
    const res = await fetch(`/api/admin/orders/status?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update order status");

    const data = await res.json();
    toast.success("Order status updated");
    setLoadingAction(false);
    return data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to update order status");
    setLoadingAction(false);
    throw error;
  }
};


  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      paid: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      refunded: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded-full capitalize ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  return (
    <main className="flex min-h-screen bg-gray-100 w-full text-slate-800 pb-6 md:pb-0">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <section className="w-full p-5 pb-0 mb-0">          
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
              >
                <FiList className="text-lg" />
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setViewMode('cards')}
                aria-label="Card view"
              >
                <FiGrid className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search and Filter Section */}
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative max-w-md flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or user..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          ) : viewMode === "table" ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: Order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-emerald-600 hover:text-emerald-800 font-medium">
                          #{order._id.slice(-8)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.userId.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items.length} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatPrice(order.totalAmount,order.items[0].productId.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openOrderModal(order)}
                            className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs hover:bg-emerald-100 transition-colors hover:cursor-pointer"
                            title="View order details"
                          >
                            <FiEye className="text-sm" />
                            View
                          </button>
                          <button
                            onClick={() => updateStatus(order._id, "refunded")}
                            className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100 transition-colors hover:cursor-pointer"
                            title="Refund order"
                          >
                            Refund
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No orders found</div>
                  <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200">
                  {/* Results info */}
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{startItem}</span> -{' '}
                    <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
                    <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> orders
                  </div>

                  {/* Pagination controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className={`p-2 border rounded-lg transition-all duration-200 ${
                        page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                      aria-label="First page"
                    >
                      <FiChevronsLeft className="text-lg" />
                    </button>

                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className={`p-2 border rounded-lg transition-all duration-200 ${
                        page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                      aria-label="Previous page"
                    >
                      <FiChevronLeft className="text-lg" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1 mx-2">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`min-w-[2.5rem] px-3 py-2 border text-sm font-medium rounded-lg transition-all duration-200 ${
                            page === pageNum
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                          aria-label={`Page ${pageNum}`}
                          aria-current={page === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                      className={`p-2 border rounded-lg transition-all duration-200 ${
                        page >= totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                      aria-label="Next page"
                    >
                      <FiChevronRight className="text-lg" />
                    </button>

                    <button
                      onClick={() => setPage(totalPages)}
                      disabled={page >= totalPages}
                      className={`p-2 border rounded-lg transition-all duration-200 ${
                        page >= totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                      aria-label="Last page"
                    >
                      <FiChevronsRight className="text-lg" />
                    </button>
                  </div>

                  {/* Page size selector */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Rows per page:</span>
                    <select
                      className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      value={limit}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Cards View */
            <div className="p-4">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No orders found</div>
                  <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-emerald-600">
                            Order #{order._id.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">
                           {formatPrice(order.totalAmount,order.items[0].productId.currency)}
                          </div>
                          <div className="text-xs text-gray-500">{order.items.length} items</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <StatusBadge status={order.status} />
                        <div className="text-sm text-gray-600">User: {order.userId.username}</div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openOrderModal(order)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-sm hover:bg-emerald-100 transition-colors hover:cursor-pointer"
                        >
                          <FiEye className="text-sm" />
                          View Details
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, "refunded")}
                          className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors hover:cursor-pointer"
                          title="Refund order"
                        >
                          Refund
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        loadingAction={loadingAction}
        onClose={closeOrderModal}
        onStatusUpdate={updateStatus}
      />
    </main>
  );
}