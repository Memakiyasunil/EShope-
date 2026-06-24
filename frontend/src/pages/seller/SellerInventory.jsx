import { useState } from 'react';
import { Package, AlertTriangle, Edit, Search, Filter } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const SellerInventory = () => {
  const [inventory] = useState([
    { id: 1, name: 'Premium Wireless Headphones', sku: 'AUDIO-WH-001', stock: 45, status: 'In Stock', price: '$299' },
    { id: 2, name: 'Minimalist Smart Wallet', sku: 'ACC-WL-002', stock: 5, status: 'Low Stock', price: '$49' },
    { id: 3, name: 'Ergonomic Desk Chair', sku: 'FUR-DC-003', stock: 0, status: 'Out of Stock', price: '$199' },
    { id: 4, name: 'Mechanical Gaming Keyboard', sku: 'TECH-KB-004', stock: 120, status: 'In Stock', price: '$129' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
          <p className="text-slate-500">Monitor and update your product stock levels</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Package size={18} /> Add New Stock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6 border-l-4 border-brand-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Products</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">124</h3>
            </div>
            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-lg">
              <Package size={24} />
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 border-l-4 border-amber-500 bg-amber-50/30 dark:bg-amber-900/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</h3>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-red-500 bg-red-50/30 dark:bg-red-900/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Out of Stock</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3</h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
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
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock Level</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-sm">{item.sku}</td>
                  <td className="p-4 text-slate-900 dark:text-white font-medium">{item.price}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${item.stock === 0 ? 'text-red-500' : item.stock < 10 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                        {item.stock}
                      </span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.stock === 0 ? 'bg-red-500' : item.stock < 10 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((item.stock / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.stock === 0 ? 'bg-red-100 text-red-700' : 
                      item.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-brand-600 hover:text-brand-700 p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                      <Edit size={18} />
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

export default SellerInventory;
