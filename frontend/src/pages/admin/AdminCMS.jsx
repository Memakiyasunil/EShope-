import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { Construction } from 'lucide-react';

const AdminCMS = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Content Management</h1>
          <p className="text-slate-500">This feature is currently under development</p>
        </div>
      </div>

      <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
          <Construction size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Coming Soon</h2>
        <p className="text-slate-500 max-w-md">
          We are working hard to bring you the Content Management module. Check back later for updates.
        </p>
      </GlassCard>
    </div>
  );
};

export default AdminCMS;
