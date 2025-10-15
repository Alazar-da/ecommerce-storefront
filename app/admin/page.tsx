"use client";
import { useEffect, useState } from "react";
import { fetchSummary, createOrUpdateSummary } from "@/utils/fetchSummary";
import { FiBox, FiShoppingCart, FiUsers, FiPieChart, FiRefreshCw, FiTrendingUp, FiPackage, FiDollarSign } from 'react-icons/fi';
import Sidebar from './components/sidebar';
import { Order } from "@/types/Order";
import { toast } from "react-toastify";
import { formatPrice } from "@/utils/formatPrice";

const DashboardHome = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [orders, setOrders] = useState<Order[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const params = new URLSearchParams();
            params.set("q", "");
            params.set("status", "");
            params.set("page", String(1));
            params.set("limit", String(5));

            const res = await fetch(`/api/admin/orders?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(data.orders);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to load orders");
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSummary();
                setSummary(data);
                console.log("Fetched summary:", data);
            } catch {
                console.log("No summary found yet");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleCreateSummary = async () => {
        try {
            setLoadingAction(true);
            const data = await createOrUpdateSummary();
            setSummary(data.summary);
            toast.success("Summary refreshed successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to refresh summary");
        } finally {
            setLoadingAction(false);
        }
    };

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
            <span className={`px-2 py-1 text-xs font-medium border rounded-full capitalize ${
                statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
            }`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <main className="flex h-screen bg-gray-100 w-full text-slate-800">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <section className="mb-6 overflow-y-auto w-full min-h-screen p-5 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="flex h-screen bg-gray-100 w-full text-slate-800">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <section className="mb-6 overflow-y-auto w-full min-h-screen p-5">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
                    </div>
                    <button
                        onClick={handleCreateSummary}
                        disabled={loadingAction}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-0 hover:cursor-pointer"
                    >
                        {loadingAction ? (
                            <FiRefreshCw className="animate-spin" />
                        ) : (
                            <FiRefreshCw />
                        )}
                        {loadingAction ? "Refreshing..." : "Refresh Summary"}
                    </button>
                </div>

                {/* Summary Cards */}
                {summary ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Sales Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Sales</p>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {formatPrice(summary.totalRevenue || 0, 'ETB')}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-2">All time revenue</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                    <FiTrendingUp className="text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Total Products Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {summary.totalProducts || 0}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-2">Active products</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                                    <FiBox className="text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Total Customers Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {summary.totalCustomers || 0}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-2">Registered users</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                    <FiUsers className="text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Total Orders Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {summary.totalOrders || 0}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-2">All time orders</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                    <FiPackage className="text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center mb-8">
                        <FiPackage className="text-3xl text-yellow-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Summary Data</h3>
                        <p className="text-yellow-700 mb-4">Click the refresh button to generate your first summary</p>
                    </div>
                )}

                {/* Recent Orders Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                            <span className="text-sm text-gray-500">Last 5 orders</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {loadingOrders ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                    <p className="text-gray-600">Loading orders...</p>
                                </div>
                            </div>
                        ) : orders.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order: Order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-emerald-600">
                                                    #{order._id.slice(-8)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.userId.username}</div>
                                                <div className="text-xs text-gray-500">{order.userId.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatPrice(order.totalAmount, order.items[0]?.productId?.currency || 'ETB')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={order.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <FiPackage className="text-4xl text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Found</h3>
                                <p className="text-gray-500">There are no recent orders to display.</p>
                            </div>
                        )}
                    </div>
                    
                    {orders.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Showing {Math.min(orders.length, 5)} of {orders.length} recent orders
                                </p>
                                <button 
                                    onClick={fetchOrders}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                                >
                                    <FiRefreshCw className="text-sm" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats Section */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 rounded-lg text-white">
                                    <FiShoppingCart className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Average Order Value</p>
                                    <h3 className="text-2xl font-bold text-blue-900">
                                        {summary.totalSales && summary.totalOrders ? 
                                            formatPrice(summary.totalSales / summary.totalOrders, 'ETB') : 
                                            formatPrice(0, 'ETB')
                                        }
                                    </h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500 rounded-lg text-white">
                                    <FiUsers className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-800">Conversion Rate</p>
                                    <h3 className="text-2xl font-bold text-green-900">
                                        {summary.totalCustomers && summary.totalOrders ? 
                                            `${((summary.totalOrders / summary.totalCustomers) * 100).toFixed(1)}%` : 
                                            '0%'
                                        }
                                    </h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500 rounded-lg text-white">
                                    <FiDollarSign className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-800">Revenue Growth</p>
                                    <h3 className="text-2xl font-bold text-purple-900">
                                        +12.5%
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default DashboardHome;