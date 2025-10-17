"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics, createOrRefreshSummary } from "@/utils/fetchAnalytics";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Pie, Doughnut } from "react-chartjs-2";
import { FiShoppingCart, FiBox, FiUsers, FiPieChart, FiRefreshCw, FiTrendingUp, FiPackage, FiAlertTriangle } from "react-icons/fi";
import Sidebar from "../components/sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState<number>(30);
  const [activePage, setActivePage] = useState('analytics');

  const load = async (d = days) => {
    setLoading(true);
    try {
      const res = await fetchAnalytics(d);
      setData(res);
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await load(days);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshSummary = async () => {
    setRefreshing(true);
    try {
      await createOrRefreshSummary();
      await load(days);
    } catch (err: any) {
      console.error("Failed to refresh summary:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Loading Component
  const LoadingState = () => (
    <main className="flex h-screen bg-gray-100 w-full text-slate-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <section className="p-8 overflow-y-auto h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics data...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
        </div>
      </section>
    </main>
  );

  if (loading && !data) {
    return <LoadingState />;
  }

  // Chart data configurations
  const lineData = {
    labels: data?.revenue?.dates || [],
    datasets: [
      {
        label: "Revenue",
        data: data?.revenue?.values || [],
        borderColor: 'rgb(5, 150, 105)',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  };

  const statusLabels = data ? Object.keys(data.ordersByStatus) : [];
  const statusValues = data ? Object.values<number>(data.ordersByStatus) : [];
  const pieData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Orders by Status",
        data: statusValues,
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',   // pending - yellow
          'rgba(13, 110, 253, 0.8)',   // paid - blue
          'rgba(111, 66, 193, 0.8)',   // shipped - purple
          'rgba(25, 135, 84, 0.8)',    // completed - green
          'rgba(220, 53, 69, 0.8)',    // cancelled - red
          'rgba(108, 117, 125, 0.8)',  // refunded - gray
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const topNames = data?.topProducts?.map((p: any) => p.name) || [];
  const topQty = data?.topProducts?.map((p: any) => p.qty) || [];
  const barData = {
    labels: topNames,
    datasets: [
      {
        label: "Quantity Sold",
        data: topQty,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(29, 78, 216)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lowNames = data?.lowStockProducts?.map((p: any) => p.name) || [];
  const lowStockValues = data?.lowStockProducts?.map((p: any) => p.stock) || [];
  const doughnutData = {
    labels: lowNames,
    datasets: [
      {
        label: "Stock Remaining",
        data: lowStockValues,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(132, 204, 22, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const summary = data?.summary || {};

  return (
    <main className="flex h-screen bg-gray-100 w-full text-slate-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <section className="py-5 px-3 lg:px-5 mb-0 overflow-y-auto h-screen w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 mt-6 lg:mt-0">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

            <button
              onClick={handleRefreshSummary}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
              Recalculate Summary
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ETB {Number(summary.totalRevenue ?? 0).toLocaleString()}
                </h3>
                <p className="text-xs text-gray-500 mt-2">All time revenue</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <FiTrendingUp className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.totalProducts ?? 0}
                </h3>
                <p className="text-xs text-gray-500 mt-2">Active products</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                <FiBox className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.totalCustomers ?? 0}
                </h3>
                <p className="text-xs text-gray-500 mt-2">Registered users</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <FiUsers className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.totalOrders ?? 0}
                </h3>
                <p className="text-xs text-gray-500 mt-2">All time orders</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <FiPackage className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Revenue Trend</h4>
              <span className="text-sm text-gray-500">Last {days} days</span>
            </div>
            {data?.revenue?.values?.length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiTrendingUp className="text-4xl mb-3 opacity-50" />
                <p>No revenue data available</p>
              </div>
            )}
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Orders by Status</h4>
              <span className="text-sm text-gray-500">Distribution</span>
            </div>
            {statusValues.length > 0 ? (
              <div className="h-64">
                <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiPieChart className="text-4xl mb-3 opacity-50" />
                <p>No order status data available</p>
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Top Products</h4>
              <span className="text-sm text-gray-500">By quantity sold</span>
            </div>
            {topNames.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiShoppingCart className="text-4xl mb-3 opacity-50" />
                <p>No product sales data available</p>
              </div>
            )}
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Low Stock Alert</h4>
              <span className="text-sm text-gray-500">Need restocking</span>
            </div>
            {lowNames.length > 0 ? (
              <div className="h-64">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiAlertTriangle className="text-4xl mb-3 text-green-500" />
                <p className="text-green-600 font-medium">All products are well stocked</p>
                <p className="text-sm text-gray-500 mt-1">No low stock items</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Last Updated */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Data last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </section>
    </main>
  );
}