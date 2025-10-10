"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Cart } from "@/types/Cart";
import { Order } from "@/types/Order";
import Link from "next/link";
import { toast } from "react-toastify";
import { formatPrice } from "@/utils/formatPrice";
import { fetchProductById } from "@/utils/fetchProductById";
import { Product } from "@/types/Product";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/cart/${user?.id}`);
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
        console.log("Fetched cart:", cartData);
      } else if (response.status === 404) {
        setCart(null);
      } else {
        throw new Error("Failed to fetch cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  console.log("Current cart state:", cart);

const updateCartItemQuantity = async (productId: string, newQuantity: number) => {
  if (!cart || newQuantity < 0) return;
  try {
    const updatedItems = cart.items
      .map((item) =>
        item.productId._id === productId ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);

    const totalQuantity = updatedItems.reduce((t, i) => t + i.quantity, 0);
    const totalPrice = updatedItems.reduce((t, i) => t + i.price * i.quantity, 0);

    // ✅ Use /api/cart/[id]
    const response = await fetch(`/api/cart/${cart.user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: updatedItems, totalQuantity, totalPrice }),
    });

    if (response.ok) {
      setCart(await response.json());
    } else throw new Error("Failed to update cart");
  } catch (error) {
    console.error("Error updating quantity:", error);
    toast.error("Failed to update quantity");
  }
};


const removeCartItem = async (productId: string) => {
  if (!cart) return;
  try {
    const updatedItems = cart.items.filter((i) => i.productId._id !== productId);
    const totalQuantity = updatedItems.reduce((t, i) => t + i.quantity, 0);
    const totalPrice = updatedItems.reduce((t, i) => t + i.price * i.quantity, 0);

    // ✅ Call API with userId
    const response = await fetch(`/api/cart/${cart.user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: updatedItems,
        totalQuantity,
        totalPrice, // backend will map → total
      }),
    });

    if (response.ok) {
      setCart(await response.json());
      toast.success("Item removed from cart");
    }
  } catch (error) {
    console.error("Error removing item:", error);
    toast.error("Failed to remove item");
  }
};

const clearCart = async () => {
  if (!cart) return;
  try {
    // ✅ Call API with userId
    const response = await fetch(`/api/cart/${cart.user}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [],
        totalQuantity: 0,
        totalPrice: 0, // backend maps → total
      }),
    });

    if (response.ok) {
      setCart(await response.json());
      toast.info("Cart cleared");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error("Failed to clear cart");
  }
};


  const createOrder = async () => {
    if (!cart || !user || cart.items.length === 0) return;
    try {
      setOrderLoading(true);
      const orderData = { 
  userId: user.id, 
  items: cart.items,
  status: "pending" 
};
   const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order: Order = await response.json();
        await clearCart();
        toast.success("Order created successfully!");
        setTimeout(() => {
        window.location.href = `/orders`;
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setOrderLoading(false);
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  // 🔹 User not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Please Log In</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
        <Link
          href="/login"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Log In
        </Link>
      </div>
    );
  }

  // 🔹 Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your cart to get started.</p>
        <Link
          href="/"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // 🔹 Cart page
  return (
<section className="min-h-screen bg-gray-50 py-8 text-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
         <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Cart
              </Link>
            </li>
          </ol>
        </nav>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-100 transition hover:cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cart.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex items-center p-6 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <img
                    src={item.productId.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder-product.jpg")}
                  />

                  {/* Info */}
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-emerald-600 font-bold">{formatPrice(item.price, item.productId.currency)}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCartItemQuantity(item.productId._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItemQuantity(item.productId._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 hover:cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Item total */}
                  <div className="ml-6 text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity, item.productId.currency)}
                    </p>
                    <button
                      onClick={() => removeCartItem(item.productId._id)}
                      className="text-red-600 hover:text-red-700 text-sm mt-2 hover:cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6 ">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.totalQuantity} items)</span>
                  <span>{formatPrice(cart.total, cart.items[0].productId.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (15%)</span>
                  <span>{formatPrice(cart.total * 0.15, cart.items[0].productId.currency)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-emerald-600">
                  {formatPrice(cart.total * 1.15, cart.items[0].productId.currency)}
                </span>
              </div>

              <button
                onClick={createOrder}
                disabled={orderLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white hover:cursor-pointer ${
                  orderLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {orderLoading ? "Processing..." : `Place Order`}
              </button>

              <Link
                href="/"
                className="block text-center text-emerald-600 hover:text-emerald-700 mt-4"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 p-4 bg-cyan-50 rounded-lg text-sm text-cyan-700">
                <p className="font-semibold mb-1">Secure Checkout</p>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
