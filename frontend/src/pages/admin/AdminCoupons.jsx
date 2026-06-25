import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';

const emptyForm = { code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, startDate: '', endDate: '', isActive: true };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    api.get('/coupons').then(({ data }) => setCoupons(data.coupons || data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => { setEditCoupon(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c) => {
    setEditCoupon(c);
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || 0, maxDiscount: c.maxDiscount || 0,
      usageLimit: c.usageLimit || 0, isActive: c.isActive,
      startDate: c.startDate ? c.startDate.slice(0, 10) : '',
      endDate: c.endDate ? c.endDate.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCoupon) {
        await api.put(`/coupons/${editCoupon._id}`, form);
        toast.success('Coupon updated');
      } else {
        await api.post('/coupons', form);
        toast.success('Coupon created');
      }
      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch { toast.error('Failed'); }
  };

  const toggleActive = async (c) => {
    try {
      await api.put(`/coupons/${c._id}`, { isActive: !c.isActive });
      toast.success(`Coupon ${!c.isActive ? 'activated' : 'deactivated'}`);
      setCoupons(prev => prev.map(x => x._id === c._id ? { ...x, isActive: !x.isActive } : x));
    } catch { toast.error('Failed'); }
  };

  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success(`Copied: ${code}`); };

  const isExpired = (endDate) => endDate && new Date(endDate) < new Date();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Coupon Management</h1>
          <p className="text-slate-500 mt-1">{coupons.length} coupons</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 rounded-xl">
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSkeleton variant="table" count={6} /> : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/70 dark:bg-slate-800/40">
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500">
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Code</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Discount</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Min Order</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Usage</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Validity</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {coupons.length > 0 ? coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-lg text-sm">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="p-1 text-slate-400 hover:text-slate-600" title="Copy code"><Copy size={14} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                      {c.maxDiscount > 0 && <span className="text-xs text-slate-400 font-normal ml-1">(max ₹{c.maxDiscount})</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {c.minOrderAmount > 0 ? `₹${c.minOrderAmount.toLocaleString()}` : 'No min'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">{c.usedCount || 0}</span>
                        <span className="text-slate-400">/ {c.usageLimit || '∞'}</span>
                      </div>
                      {c.usageLimit > 0 && (
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 w-20 overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {c.startDate && <p>{new Date(c.startDate).toLocaleDateString()}</p>}
                      {c.endDate && (
                        <p className={isExpired(c.endDate) ? 'text-red-500 font-semibold' : ''}>
                          → {new Date(c.endDate).toLocaleDateString()} {isExpired(c.endDate) && '(Expired)'}
                        </p>
                      )}
                      {!c.endDate && <p className="text-emerald-600">No expiry</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleActive(c)} className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 transition-colors ${c.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                        {c.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(c._id, c.code)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-slate-400">No coupons found. Create one to get started.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCoupon ? 'Edit Coupon' : 'Create Coupon'} size="lg">
        <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Coupon Code *</label>
            <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field w-full font-mono" placeholder="SAVE20" disabled={!!editCoupon} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Discount Type *</label>
            <select required value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="input-field w-full">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Discount Value *</label>
            <input required type="number" min="1" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Max Discount (₹, 0 = unlimited)</label>
            <input type="number" min="0" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Min Order Amount (₹)</label>
            <input type="number" min="0" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: Number(e.target.value) })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Usage Limit (0 = unlimited)</label>
            <input type="number" min="0" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Start Date</label>
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">End Date</label>
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="input-field w-full" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-brand-600" />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">Active (coupon can be used)</label>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-5">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary py-2 px-6">{saving ? 'Saving...' : editCoupon ? 'Update Coupon' : 'Create Coupon'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminCoupons;
