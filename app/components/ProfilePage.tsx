'use client';

import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { User } from '@/types/User';

interface PasswordForm {
    userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    userId: id,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile(id);
  }, [id]);

const fetchUserProfile = async (id: string) => {
  try {
    const response = await fetch(`/api/user/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user');
    }
    setUser(data);
    setLoading(false);

    return data; // user object
  } catch (err: any) {
    console.error('Error fetching user:', err.message);
    return null;
  }
};



const handlePasswordChange = async (e: React.FormEvent) => { 
  e.preventDefault();

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('New passwords do not match');
    return;
  }

  setSaving(true);

  try {
    const response = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordForm),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Password updated successfully!');
      setPasswordForm({ userId: id, currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(data.message || 'Failed to update password');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    toast.error('An error occurred while changing password');
  } finally {
    setSaving(false);
  }
};


  const handlePasswordInputChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-lg text-gray-600">Manage your account information and security</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              messageType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 text-center font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-4 text-center font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-b-2 border-cyan-500 text-cyan-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Change Password
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'profile' && user && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard label="Username" value={user.username} color="emerald" />
                  <InfoCard label="Email Address" value={user.email} color="cyan" />
                  <InfoCard
                    label="Phone Number"
                    value={user.phone || 'Not provided'}
                    color="emerald"
                  />
                  <InfoCard
                    label="Account Role"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    color="cyan"
                  />
                  <InfoCard
                    label="Member Since"
                    value={new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    color="emerald"
                    full
                  />
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Account Security</h3>
                  <p className="opacity-90">
                    Keep your account secure by regularly updating your password.
                  </p>
                  <button
                    onClick={() => setActiveTab('password')}
                    className="mt-4 bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
  <PasswordField
    id="currentPassword"
    label="Current Password"
    value={passwordForm.currentPassword}
    onChange={(val) => handlePasswordInputChange('currentPassword', val)}
  />
  <PasswordField
    id="newPassword"
    label="New Password"
    value={passwordForm.newPassword}
    onChange={(val) => handlePasswordInputChange('newPassword', val)}
  />
  <PasswordField
    id="confirmPassword"
    label="Confirm New Password"
    value={passwordForm.confirmPassword}
    onChange={(val) => handlePasswordInputChange('confirmPassword', val)}
  />

  <button
    type="submit"
    disabled={saving}
    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
  >
    {saving ? (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
        Updating Password...
      </div>
    ) : (
      'Update Password'
    )}
  </button>
</form>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable info card
const InfoCard = ({
  label,
  value,
  color,
  full,
}: {
  label: string;
  value: string;
  color: 'emerald' | 'cyan';
  full?: boolean;
}) => (
  <div
    className={`rounded-lg p-4 bg-${color}-50 ${
      full ? 'md:col-span-2' : ''
    } transition-transform hover:scale-[1.02]`}
  >
    <label className={`block text-sm font-medium text-${color}-700 mb-1`}>{label}</label>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

// Password input with show/hide toggle
const PasswordField = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-10"
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
};


export default ProfilePage;
