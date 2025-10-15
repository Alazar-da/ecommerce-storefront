export interface OrderSummary {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    shippedOrders: number;
    totalProducts: number;
    totalCustomers: number;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
}
