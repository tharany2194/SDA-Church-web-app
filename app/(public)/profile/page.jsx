'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Key, Upload, Check } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../../components/auth/withAuth';
import { fetchCurrentUser } from '../../../store/slices/authSlice';

function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', preferredLanguage: user?.preferredLanguage || 'en' });
  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPw, setChangingPw] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(profile).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      await api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile updated');
      dispatch(fetchCurrentUser());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setChangingPw(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || '';
  let avatarUrl = user?.avatar?.startsWith('http')
    ? user.avatar
    : user?.avatar ? `${baseUrl}${user.avatar}` : null;

  // Legacy support
  if (avatarUrl && (user?.avatar?.startsWith('/avatars/') || user?.avatar?.startsWith('/images/')) && !user?.avatar?.includes('/api/v1/media')) {
    avatarUrl = `${baseUrl}/api/v1/media${user.avatar}`;
  }

  return (
    <div className="py-12 bg-gray-50 flex-1">
      <div className="container-custom max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

          {/* Profile Card */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  <Upload size={12} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatar(e.target.files[0])} />
                </label>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className="capitalize text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full mt-1 inline-block">{user?.role}</span>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={16} className="text-primary-600" />Personal Info</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                <input className="input" type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Preferred Language</label>
                <select className="input" value={profile.preferredLanguage} onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}>
                  <option value="en">English</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                </select>
              </div>
              {avatar && <p className="text-sm text-primary-600 flex items-center gap-1"><Check size={14} />New avatar selected: {avatar.name}</p>}
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Key size={16} className="text-primary-600" />Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                <input type="password" className="input" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                <input type="password" className="input" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={8} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
                <input type="password" className="input" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary" disabled={changingPw}>{changingPw ? 'Updating...' : 'Update Password'}</button>
            </form>
          </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
