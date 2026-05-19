'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { Trash2, Shield, UserCheck, User, ShieldAlert, UserCog } from 'lucide-react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Pagination from '../../../../components/Pagination';

const fetcher = (url) => api.get(url).then((r) => r.data);

const ROLE_META = {
  super_admin: { label: 'Super Admin', color: 'bg-yellow-100 text-yellow-800', icon: ShieldAlert },
  admin:       { label: 'Admin',       color: 'bg-purple-100 text-purple-700', icon: Shield },
  editor:      { label: 'Editor',      color: 'bg-blue-100 text-blue-700',     icon: UserCheck },
  volunteer:   { label: 'Volunteer',   color: 'bg-green-100 text-green-700',   icon: UserCog },
  member:      { label: 'Member',      color: 'bg-gray-100 text-gray-600',     icon: User },
};

// Roles a super_admin can assign
const ALL_ROLES = ['super_admin', 'admin', 'editor', 'volunteer', 'member'];

export default function AdminUsers() {
  const { user: currentUser } = useSelector((s) => s.auth);
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const [page, setPage] = useState(1);
  const [filterRole, setFilterRole] = useState('');
  const { data, mutate } = useSWR(
    `/users?page=${page}&limit=20${filterRole ? `&role=${filterRole}` : ''}`,
    fetcher
  );
  const users = data?.data || [];

  const handleRoleChange = async (userId, role) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      toast.success('Role updated');
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await api.patch(`/users/${userId}/status`);
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`);
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted');
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Users &amp; Roles</h2>
        <p className="text-sm text-gray-500 mt-1">
          {isSuperAdmin
            ? 'Manage all users and assign roles across the platform.'
            : 'View all registered users. Role assignment requires Super Admin access.'}
        </p>
      </div>

      {/* Role legend */}
      <div className="card p-4 mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Role Hierarchy</p>
        <div className="flex flex-wrap gap-2">
          {ALL_ROLES.map((r) => {
            const { label, color, icon: Icon } = ROLE_META[r];
            return (
              <span key={r} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${color}`}>
                <Icon size={11} />{label}
              </span>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-gray-500 space-y-0.5">
          <p><strong>Super Admin</strong> — Full access; assigns all roles including Admin</p>
          <p><strong>Admin</strong> — Manages all content (sermons, events, gallery, articles, prayers)</p>
          <p><strong>Editor</strong> — Can be granted content editing tasks by Admin</p>
          <p><strong>Volunteer</strong> — Community helpers with limited access</p>
          <p><strong>Member</strong> — Default role for all new sign-ups</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={filterRole}
          onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
          className="text-sm border rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All roles</option>
          {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
        </select>
        <span className="text-sm text-gray-400">{data?.total || 0} users total</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Status</th>
                {isSuperAdmin && <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => {
                const meta = ROLE_META[u.role] || ROLE_META.member;
                const RoleIcon = meta.icon;
                const isSelf = u._id === currentUser?._id;

                return (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {u.name}
                            {isSelf && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      {isSuperAdmin && !isSelf ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs border rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          {ALL_ROLES.map((r) => (
                            <option key={r} value={r}>{ROLE_META[r].label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
                          <RoleIcon size={11} />{meta.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {!isSelf && u.role !== 'super_admin' && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(u._id, u.isActive)}
                                className={`p-1.5 rounded-lg text-xs transition-colors ${
                                  u.isActive
                                    ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                }`}
                                title={u.isActive ? 'Deactivate user' : 'Activate user'}
                              >
                                <UserCheck size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(u._id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <p className="text-center text-gray-400 py-8">No users found.</p>}
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={page} 
        totalPages={data?.totalPages || 1} 
        onPageChange={setPage} 
      />
    </div>
  );
}

