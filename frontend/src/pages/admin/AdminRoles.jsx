import { motion } from 'framer-motion';
import { Shield, Check, X } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const roles = [
  {
    name: 'Super Admin',
    desc: 'Full access to all settings, users, and financials.',
    color: 'bg-brand-500',
    permissions: ['manage_users', 'manage_sellers', 'manage_roles', 'view_finances', 'manage_settings', 'manage_products', 'manage_orders', 'view_reports']
  },
  {
    name: 'Admin',
    desc: 'Access to most management features, cannot change core settings.',
    color: 'bg-purple-500',
    permissions: ['manage_users', 'manage_sellers', 'manage_products', 'manage_orders', 'view_reports']
  },
  {
    name: 'Manager',
    desc: 'Manages products and orders only.',
    color: 'bg-emerald-500',
    permissions: ['manage_products', 'manage_orders', 'view_reports']
  },
  {
    name: 'Support',
    desc: 'Can view users and orders to assist customers.',
    color: 'bg-blue-500',
    permissions: ['view_users', 'view_orders']
  }
];

const allPerms = [
  { key: 'manage_users', label: 'Manage Users' },
  { key: 'manage_sellers', label: 'Manage Sellers' },
  { key: 'manage_products', label: 'Manage Products' },
  { key: 'manage_orders', label: 'Manage Orders' },
  { key: 'view_reports', label: 'View Reports' },
  { key: 'view_finances', label: 'View Finances' },
  { key: 'manage_settings', label: 'Manage Settings' },
  { key: 'manage_roles', label: 'Manage Roles' },
];

const AdminRoles = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Role Management</h1>
        <p className="text-slate-500 mt-1">View access levels and permissions</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex gap-3 text-sm text-blue-700 dark:text-blue-400">
        <Shield className="shrink-0 mt-0.5" size={18} />
        <div>
          <p className="font-bold mb-1">System Roles (Read-Only)</p>
          <p>Roles and permissions are currently hardcoded into the system backend logic for security purposes. This page provides a matrix view of what each role can do.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {roles.map(r => (
          <GlassCard key={r.name} className="p-5 border-t-4" style={{ borderTopColor: 'currentColor' }}>
            <div className={`w-12 h-12 rounded-xl ${r.color} flex items-center justify-center text-white mb-4 shadow-md`}>
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{r.name}</h3>
            <p className="text-sm text-slate-500 min-h-[40px]">{r.desc}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">Permission Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/70 dark:bg-slate-800/40">
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500">
                <th className="text-left px-5 py-4 font-bold text-[10px] uppercase tracking-widest w-1/4">Permission</th>
                {roles.map(r => (
                  <th key={r.name} className="text-center px-5 py-4 font-bold text-[10px] uppercase tracking-widest">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allPerms.map(p => (
                <tr key={p.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">{p.label}</td>
                  {roles.map(r => (
                    <td key={r.name} className="px-5 py-4 text-center">
                      {r.permissions.includes(p.key) ? (
                        <Check size={18} className="text-emerald-500 mx-auto" />
                      ) : (
                        <X size={18} className="text-slate-300 dark:text-slate-700 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AdminRoles;
