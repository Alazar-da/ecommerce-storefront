"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget } from 'next-cloudinary';
import { Product } from "@/types/Product";
import { Category } from "@/types/Category";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  initialData?: Product | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currency: "ETB",
    price: "",
    categoryId: "",
    imageUrl: "",
    stock: "",
  });
  const [resource, setResource] = useState<{ secure_url?: string } | undefined>(undefined);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // ✅ Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode - populate form with existing data
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          currency: initialData.currency || "ETB",
          price: initialData.price?.toString() || "",
          categoryId: typeof initialData.categoryId === "object" && initialData.categoryId !== null
            ? initialData.categoryId._id
            : (initialData.categoryId || ""),
          imageUrl: initialData.imageUrl || "",
          stock: initialData.stock?.toString() || "",
        });
        setResource(initialData.imageUrl ? { secure_url: initialData.imageUrl } : undefined);
      } else {
        // Create mode - reset form
        setFormData({
          name: "",
          description: "",
          currency: "ETB",
          price: "",
          categoryId: "",
          imageUrl: "",
          stock: "",
        });
        setResource(undefined);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  // ✅ Update imageUrl when resource changes
  useEffect(() => {
    if (resource?.secure_url) {
      setFormData((prev:any) => ({ ...prev, imageUrl: resource.secure_url }));
    }
  }, [resource]);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/getCategories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Validation
  const validateField = (name: string, value: string) => {
    let errorMsg = "";
    switch (name) {
      case "name":
        if (!value.trim()) errorMsg = "Product name is required";
        break;
      case "price":
        if (!value || isNaN(Number(value)) || Number(value) <= 0)
          errorMsg = "Enter a valid price";
        break;
      case "categoryId":
        if (!value) errorMsg = "Please select a category";
        break;
      case "stock":
        if (!value || isNaN(Number(value)) || Number(value) < 0)
          errorMsg = "Enter a valid stock quantity";
        break;
    }
    setErrors((prev: any) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ✅ Handle Submit for both Create and Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    let hasError = false;
    const requiredFields = ["name", "price", "categoryId", "stock"];
    
    requiredFields.forEach((field) => {
      validateField(field, formData[field as keyof typeof formData] as string);
      if (!formData[field as keyof typeof formData]) hasError = true;
    });

    if (hasError) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      console.log("Submitting product data:", productData);

      let res;
      if (initialData) {
        // Edit mode - PUT request
        res = await fetch(`/api/product/${initialData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        // Create mode - POST request
        res = await fetch("/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      if (res.ok) {
        const savedProduct = await res.json();
        toast.success(
          initialData 
            ? "Product updated successfully!" 
            : "Product created successfully!"
        );
        onSave(savedProduct);

        setTimeout(() => {
          window.location.reload();
        }, 4500);
     
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("An error occurred while saving the product");
    } finally {
      setLoading(false);
  
    }
  };

  // ✅ Handle close with reset
  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      currency: "ETB",
      price: "",
      categoryId: "",
      imageUrl: "",
      stock: "",
    });
    setResource(undefined);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white max-h-[98%] overflow-y-auto rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="ETB">ETB</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image {!initialData && "*"}
            </label>
            <CldUploadWidget
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={(result, { widget }) => {
                setResource(
                  typeof result?.info === "object" && result?.info !== null && "secure_url" in result.info
                    ? { secure_url: (result.info as { secure_url?: string }).secure_url }
                    : undefined
                );
              }}
              onQueuesEnd={(result, { widget }) => {
                widget.close();
              }}
            >
              {({ open }) => {
                function handleOnClick() {
                  setResource(undefined);
                  open();
                }
                return (
                  <button 
                    onClick={handleOnClick} 
                    type="button" 
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {formData.imageUrl ? "Change Image" : "Upload Image"}
                  </button>
                );
              }}
            </CldUploadWidget>
            
            <input name="imageUrl" hidden value={formData.imageUrl} onChange={handleChange} readOnly />
            
            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Product preview" 
                  className="h-32 w-32 object-cover rounded-lg border"
                />
                <p className="text-sm text-gray-500 mt-1">Image uploaded successfully</p>
              </div>
            )}
            
            {!formData.imageUrl && !initialData && (
              <p className="text-red-500 text-sm mt-1">Product image is required</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              placeholder="0"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              required
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors hover:cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors hover:cursor-pointer"
            >
              {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

