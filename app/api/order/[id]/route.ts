import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";

export async function GET(request: NextRequest,
  params: { id: Promise<{ id: string }> } // Type params as a Promise
) {
  try {
    await connectDB();

    const order = await Order.findById(params.id)
      .populate("userId")
      .populate({
        path: "items.productId",
        select: "name price imageUrl", // 👈 match your Product model fields here
      });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🧹 Transform productId to include only needed fields
    const formattedOrder = {
      ...order.toObject(),
      items: order.items.map((item: any) => ({
        _id: item._id,
        quantity: item.quantity,
        productId: item.productId
          ? {
              _id: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              imageUrl: item.productId.imageUrl, // ✅ match actual field name
            }
          : null,
      })),
    };

    return NextResponse.json(formattedOrder, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching order by ID:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// ✅ Update order
export async function PUT(
 request: NextRequest,
  params: { id: Promise<{ id: string }> } // Type params as a Promise
) {
  try {
    await connectDB();
    const { status, shipping, paymentMethod } = await request.json();

    // ✅ Validate status
    const allowedStatuses = ["pending", "paid", "shipped", "completed", "cancelled", "refunded"];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    // ✅ Build update object
    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (shipping) updateData.shipping = shipping;

    const updatedOrder = await Order.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ✅ Delete order
export async function DELETE(request: NextRequest,
  params: { id: Promise<{ id: string }> } // Type params as a Promise
) {
  try {
    await connectDB();
    const deletedOrder = await Order.findByIdAndDelete(params.id);
    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Order deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
