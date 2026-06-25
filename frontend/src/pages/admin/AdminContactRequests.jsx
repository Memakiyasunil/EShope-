import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';

// Dummy data for contact requests since we don't have a backend model for this yet
const mockContacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Order not received', message: 'I ordered a phone 5 days ago and it is still not delivered.', status: 'pending', date: '2 hours ago' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@test.com', subject: 'Refund query', message: 'How long does a refund take to process to my bank?', status: 'resolved', date: '1 day ago' },
  { id: 3, name: 'Mike Johnson', email: 'mike@brand.com', subject: 'Seller onboarding', message: 'I want to sell my products on your platform. What are the fees?', status: 'pending', date: '2 days ago' },
];

const AdminContactRequests = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [filter, setFilter] = useState('');

  const markResolved = (id) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
    toast.success('Marked as resolved');
  };

  const deleteRequest = (id) => {
    if (!window.confirm('Delete this request?')) return;
    setContacts(prev => prev.filter(c => c.id !== id));
    toast.success('Request deleted');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Contact Requests</h1>
          <p className="text-slate-500 mt-1">Manage customer inquiries and support tickets (Mock Data)</p>
        </div>
      </div>

      <GlassCard className="p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search by name, email or subject..." className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field text-sm min-w-[130px]">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {contacts.filter(c => !filter || c.status === filter).map(c => (
            <div key={c.id} className={`p-5 transition-colors ${c.status === 'resolved' ? 'opacity-70 bg-slate-50/30 dark:bg-slate-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 flex items-center justify-center shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{c.subject}</h3>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        {c.name} <span className="text-slate-300 mx-1">•</span> <a href={`mailto:${c.email}`} className="text-brand-600 hover:underline">{c.email}</a>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {c.status}
                      </span>
                      <p className="text-xs text-slate-400 mt-2">{c.date}</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
                    "{c.message}"
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a href={`mailto:${c.email}`} className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1">
                      <Mail size={14} /> Reply
                    </a>
                    {c.status === 'pending' && (
                      <button onClick={() => markResolved(c.id)} className="btn-outline text-xs py-1.5 px-4 flex items-center gap-1 text-emerald-600 hover:border-emerald-300">
                        <CheckCircle size={14} /> Mark Resolved
                      </button>
                    )}
                    <button onClick={() => deleteRequest(c.id)} className="btn-outline text-xs py-1.5 px-4 flex items-center gap-1 text-red-500 hover:border-red-300 ml-auto">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {contacts.filter(c => !filter || c.status === filter).length === 0 && (
            <div className="p-16 text-center text-slate-400">No requests found</div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AdminContactRequests;
