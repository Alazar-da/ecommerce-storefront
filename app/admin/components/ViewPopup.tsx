import { FiX, FiShoppingCart, FiHeart, FiStar, FiTag, FiBox, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { Product } from '@/types/Product';
import { shortDate } from '@/utils/date';

interface ViewPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

// Date formatting utility
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ViewPopup = ({ product, isOpen, onClose, onAddToCart }: ViewPopupProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format price based on currency
  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : "ETB ";
    return `${symbol}${price.toFixed(2)}`;
  };

  // Generate rating based on product ID for demo
/*   const getProductRating = (productId: string) => {
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return 3.5 + (Math.abs(hash) % 15) / 10;
  }; */

/*   const rating = getProductRating(product._id); */

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Close product view"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image section */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x400/cccccc/969696?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              </div>
              
              {/* Category image */}
          {/*     {product.categoryId?.image && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Category Image</h4>
                  <div className="aspect-video overflow-hidden rounded-md bg-gray-100">
                    <img 
                      src={product.categoryId.image} 
                      alt={product.categoryId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )} */}
            </div>

            {/* Product details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <div className="flex items-center mb-4">
               {/*    <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={i < Math.floor(rating) ? "fill-current" : i < rating ? "fill-current opacity-50" : ""} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm ml-2">({rating.toFixed(1)})</span> */}
                  <span className="mx-2 text-gray-300">•</span>
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.currency === "ETB" && (
                    <span className="text-sm text-gray-500 ml-2">(Ethiopian Birr)</span>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                
                {/* Category description */}
                {product.categoryId?.description && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {product.categoryId.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Product information grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                <div className="flex items-center">
                  <FiTag className="text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500 block">Category</span>
                    <span className="font-medium text-gray-900">{product.categoryId?.name || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiBox className="text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500 block">Product ID</span>
                    <span className="font-medium text-gray-900">{product._id}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiDollarSign className="text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500 block">Currency</span>
                    <span className="font-medium text-gray-900">{product.currency}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500 block">Added</span>
                    <span className="font-medium text-gray-900">{shortDate(product.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Category details */}
              {product.categoryId && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-sm font-semibold text-green-800 mb-2">Category Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-green-600">Name:</span>
                      <span className="ml-1 text-green-800">{product.categoryId.name}</span>
                    </div>
                    <div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-green-600">Description:</span>
                      <span className="ml-1 text-green-800">{product.categoryId.description}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Last updated */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center text-sm text-blue-700">
                  <FiCalendar className="mr-2 flex-shrink-0" />
                  <span>Last updated: {formatDate(product.updatedAt)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => onAddToCart && onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <FiShoppingCart className="mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button 
                  className="flex items-center justify-center p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Add to wishlist"
                >
                  <FiHeart className="w-5 h-5" />
                </button>
              </div>

              {/* Stock warning */}
              {product.stock > 0 && product.stock < 10 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-700 text-sm">
                    ⚠️ Only {product.stock} left in stock! Order soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;