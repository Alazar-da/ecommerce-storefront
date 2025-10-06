import { useState } from 'react';
import { FiX, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

interface DeletePopupProps {
  id: number | string;
  itemName?: string;
  onConfirm: (id: number | string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const DeletePopup = ({ id, itemName = "item", onConfirm, onCancel, isOpen }: DeletePopupProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call delay
   /*    await new Promise(resolve => setTimeout(resolve, 800)); */
      onConfirm(id);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onCancel}></div>
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl transform transition-all">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
            disabled={isDeleting}
          >
            <FiX className="w-5 h-5" />
          </button>
          
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          {/* Content */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete {itemName}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this {itemName}? This action cannot be undone.
            </p>
            
            {/* Action buttons */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors flex items-center justify-center hover:cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;