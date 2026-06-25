import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Key, Activity, Smartphone, Monitor } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const mockSessions = [
  { id: 1, os: 'Windows 11', browser: 'Chrome 120.0', ip: '192.168.1.1', location: 'Mumbai, India', lastActive: 'Just now', current: true, device: 'desktop' },
  { id: 2, os: 'iOS 17', browser: 'Safari', ip: '10.0.0.5', location: 'Delhi, India', lastActive: '2 hours ago', current: false, device: 'mobile' },
];

const AdminSecurity = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Security & Sessions</h1>
        <p className="text-slate-500 mt-1">Manage active sessions and security logs</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldAlert size={24} />
          </div>
          <h2 className="font-bold text-lg mb-2">Two-Factor Auth</h2>
          <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your admin account.</p>
          <button className="btn-outline w-full py-2 text-sm" disabled>Coming Soon</button>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 text-brand-600 rounded-xl flex items-center justify-center mb-4">
            <Key size={24} />
          </div>
          <h2 className="font-bold text-lg mb-2">Password Policy</h2>
          <p className="text-sm text-slate-500 mb-4">Enforce strong passwords for all admin and seller accounts.</p>
          <button className="btn-outline w-full py-2 text-sm text-emerald-600 border-emerald-200">Enforced: Strong</button>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Activity size={24} />
          </div>
          <h2 className="font-bold text-lg mb-2">Login Alerts</h2>
          <p className="text-sm text-slate-500 mb-4">Get notified of logins from new devices or locations.</p>
          <button className="btn-primary w-full py-2 text-sm" disabled>Enabled</button>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 dark:text-white">Active Sessions</h2>
          <button className="text-xs text-red-500 font-semibold hover:underline" onClick={() => window.confirm('Terminate all other sessions?')}>Revoke All Others</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {mockSessions.map(s => (
            <div key={s.id} className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                {s.device === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {s.os} · {s.browser}
                  {s.current && <span className="bg-brand-100 text-brand-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Current Device</span>}
                </p>
                <p className="text-xs text-slate-500">{s.ip} · {s.location} · Active: {s.lastActive}</p>
              </div>
              {!s.current && (
                <button className="text-xs btn-outline py-1.5 px-3 rounded-lg text-red-500 hover:border-red-200">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AdminSecurity;
