import React, { useState } from "react";
import { FiPackage, FiUser } from "react-icons/fi";
import { Order } from "@/types/Order";
import { formatPrice } from "@/utils/formatPrice";
import { shortDate } from "@/utils/date";

// Order Detail Modal Component
const OrderDetailModal = ({ order, isOpen, onClose, loadingAction, onStatusUpdate }: { 
  order: Order | null; 
  isOpen: boolean; 
  onClose: () => void; 
  loadingAction: boolean;
  onStatusUpdate: (id: string, status: string) => void;
}) => {
  if (!isOpen || !order) return null;

  const [selectedStatus, setSelectedStatus] = useState<"pending" | "paid" | "shipped" | "completed" | "cancelled" | "refunded">(order.status);

  const handleStatusUpdate = () => {
    onStatusUpdate(order._id, selectedStatus);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <section className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">#{order._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiPackage className="text-emerald-600" />
                Order Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{shortDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{shortDate(order.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                {order.paymentIntentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Intent:</span>
                    <span className="font-medium text-sm">{order.paymentIntentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiUser className="text-emerald-600" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{order.userId.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{order.userId.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{order.userId.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-medium text-sm">{order.userId._id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Order Status</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <select
                value={selectedStatus}
                disabled={order.status === "cancelled" || order.status === "refunded" || order.status === "completed" || loadingAction}
                onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <button
                onClick={handleStatusUpdate}

                disabled={selectedStatus === order.status}
                className={`px-4 py-2 rounded-lg font-medium transition-colors hover:cursor-pointer ${
                  selectedStatus === order.status
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {loadingAction ? "Updating..." : "Update Status"}
              </button>
              <span className={`px-3 py-2 text-sm font-medium border rounded-full capitalize ${
                statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
              }`}>
                Current: {order.status}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.productId.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">SKU: {item.productId._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(item.price,item.productId.currency)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                         {formatPrice((item.price * item.quantity),item.productId.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                      Total Amount:
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">
                        {formatPrice(order.totalAmount,order.items[0].productId.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Order Status History</h4>
              <div className="text-sm text-gray-600">
                <div>Created: {shortDate(order.createdAt)}</div>
                <div>Last Updated: {shortDate(order.updatedAt)}</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Payment Information</h4>
              <div className="text-sm text-gray-600">
                <div>Refunded: {order.status === "refunded" ? 'Yes' : 'No'}</div>
                <div>Payment Method: {order.paymentMethod}</div>
                {order.paymentIntentId && (
                  <div className="truncate" title={order.paymentIntentId}>
                    Intent: {order.paymentIntentId.slice(0, 20)}...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderDetailModal;