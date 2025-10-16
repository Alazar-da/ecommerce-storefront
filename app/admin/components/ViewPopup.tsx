import { FiX, FiTag, FiBox, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { Product } from '@/types/Product';
import { formatPrice } from '@/utils/formatPrice';
import { shortDate } from '@/utils/date';

interface ViewPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

const ViewPopup = ({ product, isOpen, onClose, onAddToCart }: ViewPopupProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

    const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-6 h-6 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 fill-current'
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
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
            </div>

            {/* Product details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                {
                  product.featured && ( <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Featured</span> )
                }
               
               <div className="flex items-center space-x-2 py-2">
                     <div className="flex items-center">
              {renderStars(product?.averageRating ?? 0)}
            </div>
            <span className="text-gray-600 text-lg">
              {(product?.averageRating !== undefined ? product.averageRating.toFixed(1) : '0.0')} out of 5
            </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>
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
                  <span>Last updated: {shortDate(product.updatedAt)}</span>
                </div>
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