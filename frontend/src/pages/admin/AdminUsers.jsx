import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    api.get(`/users?page=${page}&limit=15`)
      .then(({ data }) => {
        setUsers(data.users || data.data?.users || []);
        setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/${id}`, { isActive: !isActive });
      toast.success('User updated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSkeleton variant="table" count={8} />;

  return (
    <div>
      <h1 className="section-title mb-6">User Management</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Role</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3"><StatusBadge status={u.isActive ? 'active' : 'inactive'} /></td>
                <td className="p-3 text-right">
                  <button onClick={() => toggleActive(u._id, u.isActive)} className="btn-outline text-xs py-1 px-2">
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AdminUsers;
