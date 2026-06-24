import { useState } from 'react';
import { Tag, Plus, Search, Filter, Edit, Trash2, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';

const SellerCoupons = () => {
  const [coupons] = useState([
    { id: 1, code: 'SUMMER25', type: 'percentage', value: 25, uses: 142, maxUses: 500, status: 'active', expiry: '2023-12-31' },
    { id: 2, code: 'WELCOME10', type: 'fixed', value: 10, uses: 890, maxUses: 1000, status: 'active', expiry: '2024-12-31' },
    { id: 3, code: 'FLASH50', type: 'percentage', value: 50, uses: 100, maxUses: 100, status: 'expired', expiry: '2023-10-31' },
  ]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Discount Coupons</h1>
          <p className="text-slate-500">Create and manage promotional codes for your products</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by coupon code..."
              className="input-field pl-10 w-full"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} /> Filter Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Coupon Code</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Usage</th>
                <th className="p-4 font-medium">Expiry Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-800 font-mono font-bold tracking-wider flex items-center gap-2">
                        <Tag size={14} /> {coupon.code}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-slate-400 hover:text-brand-500 p-1"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {coupon.uses} / {coupon.maxUses}
                      </span>
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${(coupon.uses / coupon.maxUses) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                    {new Date(coupon.expiry).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max capitalize ${
                      coupon.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {coupon.status === 'active' && <CheckCircle size={12} />} {coupon.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-brand-600 hover:text-brand-700 p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors inline-block">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors inline-block">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default SellerCoupons;
