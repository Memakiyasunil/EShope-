import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Server, Activity, AlertTriangle, Info } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const mockLogs = [
  { id: 1, type: 'error', action: 'API Request Failed', user: 'System', ip: '127.0.0.1', details: 'GET /api/orders/invalid - 404 Not Found', time: '10 mins ago' },
  { id: 2, type: 'warning', action: 'High Memory Usage', user: 'System', ip: 'Server', details: 'Memory usage exceeded 85%', time: '1 hour ago' },
  { id: 3, type: 'info', action: 'Admin Login', user: 'admin@eshop.com', ip: '192.168.1.5', details: 'Successful login', time: '2 hours ago' },
  { id: 4, type: 'info', action: 'Product Deleted', user: 'manager@eshop.com', ip: '10.0.0.8', details: 'Deleted product ID: 64f1a...', time: '5 hours ago' },
];

const AdminSystemLogs = () => {
  const [filter, setFilter] = useState('');

  const typeIcons = {
    error: <AlertTriangle size={16} className="text-red-500" />,
    warning: <Activity size={16} className="text-orange-500" />,
    info: <Info size={16} className="text-blue-500" />
  };

  const typeColors = {
    error: 'bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-400',
    warning: 'bg-orange-50 text-orange-700 dark:bg-orange-900/10 dark:text-orange-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Logs</h1>
          <p className="text-slate-500 mt-1">Monitor platform activity and errors (Mocked Data)</p>
        </div>
        <button className="btn-outline text-sm py-2 px-4 flex items-center gap-2 rounded-xl text-slate-500">
          <Server size={15} /> Server Status: Healthy
        </button>
      </div>

      <GlassCard className="p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search logs..." className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field text-sm min-w-[130px]">
          <option value="">All Types</option>
          <option value="error">Errors</option>
          <option value="warning">Warnings</option>
          <option value="info">Info</option>
        </select>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/70 dark:bg-slate-800/40">
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500">
                <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Type</th>
                <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Action</th>
                <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">User / IP</th>
                <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Details</th>
                <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockLogs.filter(l => !filter || l.type === filter).map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${typeColors[l.type]}`}>
                      {typeIcons[l.type]} {l.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{l.action}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium">{l.user}</p>
                    <p className="text-xs text-slate-400">{l.ip}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500 max-w-xs truncate">{l.details}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AdminSystemLogs;
