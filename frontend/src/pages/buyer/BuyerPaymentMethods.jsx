import { useState, useEffect } from 'react';
import { CreditCard, Plus, ShieldCheck, CheckCircle, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import SuccessPopup from '../../components/ui/SuccessPopup';
import api from '../../utils/axios';

const BuyerPaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successState, setSuccessState] = useState({ isOpen: false, message: '', subMessage: '' });
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    isDefault: false
  });

  const fetchMethods = async () => {
    try {
      const { data } = await api.get('/users/payment-methods');
      setMethods(data.paymentMethods || []);
    } catch (error) {
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleOpenModal = (method = null) => {
    if (method) {
      setEditingId(method._id);
      setFormData({
        cardNumber: method.cardNumber,
        expiryDate: method.expiryDate,
        cvv: method.cvv,
        nameOnCard: method.nameOnCard,
        isDefault: method.isDefault
      });
    } else {
      setEditingId(null);
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        isDefault: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/payment-methods/${editingId}`, formData);
        setSuccessState({ isOpen: true, message: 'Card Updated!', subMessage: 'Your payment method was successfully updated.' });
      } else {
        await api.post('/users/payment-methods', formData);
        setSuccessState({ isOpen: true, message: 'Card Added!', subMessage: 'Your new payment method has been securely saved.' });
      }
      fetchMethods();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) return;
    try {
      await api.delete(`/users/payment-methods/${id}`);
      setSuccessState({ isOpen: true, message: 'Card Removed', subMessage: 'The payment method was removed from your account.' });
      fetchMethods();
    } catch (error) {
      toast.error('Failed to delete payment method');
    }
  };

  if (loading) return <LoadingSkeleton variant="card" count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Methods</h1>
          <p className="text-slate-500">Manage your saved credit cards and payment options</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add Payment Method
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {methods.length === 0 && (
            <div className="glass-card text-center py-10 text-slate-500">
              No saved payment methods. Add one below.
            </div>
          )}

          {methods.map((method) => (
            <GlassCard key={method._id} className="p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
                    <span className="text-white dark:text-slate-900 font-bold italic text-lg">{method.provider || 'VISA'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Card ending in {method.cardNumber.slice(-4) || '****'}
                      {method.isDefault && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> Default
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500">Expires {method.expiryDate}</p>
                    <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider">{method.nameOnCard}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4 text-sm relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <button onClick={() => handleOpenModal(method)} className="text-slate-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-1.5">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(method._id)} className="text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1.5">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </GlassCard>
          ))}

          <GlassCard onClick={() => handleOpenModal()} className="p-6 relative overflow-hidden group border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent shadow-none hover:border-brand-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[160px]">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Add New Card</h3>
            <p className="text-sm text-slate-500">Securely save another card for faster checkout</p>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Secure Payments</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We use industry-standard encryption to protect your payment details. All card numbers are securely masked and your CVV is never exposed.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="text-brand-500" />
                {editingId ? 'Edit Payment Method' : 'Add New Card'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name on Card</label>
                <input
                  type="text"
                  name="nameOnCard"
                  required
                  value={formData.nameOnCard}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  required
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="**** **** **** ****"
                  className="input-field w-full font-mono placeholder:font-sans tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    required
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    required
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-600 transition-colors"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Set as default payment method
                </span>
              </label>

              <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={handleCloseModal} className="btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 shadow-md hover:shadow-lg transition-shadow">
                  {editingId ? 'Update Card' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPaymentMethods;
