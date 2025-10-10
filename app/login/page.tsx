'use client';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
    }
    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const newErrors = {
    email: validateField("email", formData.email),
    password: validateField("password", formData.password),
  };
  setErrors(newErrors);

  if (Object.values(newErrors).some((err) => err !== "")) {
    toast.error("Please fix the errors in the form");
    setIsLoading(false);
    return;
  }

  const res = await signIn("credentials", {
    redirect: false,
    email: formData.email,
    password: formData.password,
  });

  setIsLoading(false);

  if (res?.error) {
    toast.error(res.error || "Invalid email or password");
  } else {
    toast.success("Login successful!");

    // ✅ Get session to check role
    const session = await fetch("/api/auth/session").then((r) => r.json());
    console.log("User session:", session);

    setTimeout(() => {
      if (session) {
        if (session?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/"); // default for customers
        }
      } else {
        router.push("/login");
    }
    }, 1500);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
         
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="mt-4 text-center flex justify-between">
              <Link href="/forgot-password" className="text-sm text-slate-600 hover:text-cyan-700">
                Forgot your password?
              </Link>
              <Link href="/register" className="text-sm text-slate-600 hover:text-cyan-700">
                Create a new account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
