"use client";
import { useState } from "react";
import { addRatingToProduct } from "@/utils/addRating";
import { FiX } from "react-icons/fi";

interface RatingPopupProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onRated?: (average: number) => void;
}

export default function RatingPopup({
  productId,
  isOpen,
  onClose,
  onRated,
}: RatingPopupProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    const data = await addRatingToProduct(productId, rating);
    setLoading(false);

    if (data) {
      onRated?.(data.average);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
      onClose();
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition hover:cursor-pointer"
        >
          <FiX size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Rate this Product
        </h2>

        {/* Stars */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              xmlns="http://www.w3.org/2000/svg"
              fill={(hover || rating) >= star ? "#facc15" : "none"}
              viewBox="0 0 24 24"
              stroke="#facc15"
              strokeWidth="2"
              className="w-8 h-8 cursor-pointer transition-transform hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div>

        {/* Selected rating text */}
        {rating > 0 && (
          <p className="text-center text-gray-600 mb-3">
            You rated <span className="font-semibold">{rating}</span> star
            {rating > 1 ? "s" : ""}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
          className={`w-full py-2 rounded-lg text-white font-medium transition 
            ${rating === 0 || loading ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600 hover:cursor-pointer"}
          `}
        >
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </section>
  );
}
