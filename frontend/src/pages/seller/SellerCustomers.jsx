import { useState } from 'react';
import { Search, Filter, Mail, User, Phone, MapPin, MoreVertical } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const SellerCustomers = () => {
  const [customers] = useState([
    { id: 'CUST-001', name: 'John Doe', email: 'john.doe@example.com', phone: '+1 234-567-8900', location: 'New York, USA', orders: 12, spent: '$1,240.00', lastActive: '2 hours ago' },
    { id: 'CUST-002', name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '+1 987-654-3210', location: 'London, UK', orders: 5, spent: '$450.00', lastActive: '1 day ago' },
    { id: 'CUST-003', name: 'Michael Johnson', email: 'michael.j@example.com', phone: '+1 456-789-0123', location: 'Sydney, AUS', orders: 1, spent: '$120.00', lastActive: '3 days ago' },
    { id: 'CUST-004', name: 'Emma Wilson', email: 'emma.w@example.com', phone: '+1 321-654-0987', location: 'Toronto, CAN', orders: 8, spent: '$890.00', lastActive: '5 hours ago' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-500">Manage and engage with your buyers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6">
          <p className="text-slate-500 text-sm font-medium">Total Customers</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">1,482</h3>
          <p className="text-xs text-green-500 mt-2 font-medium">+12% from last month</p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <p className="text-slate-500 text-sm font-medium">Active This Week</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">345</h3>
          <p className="text-xs text-green-500 mt-2 font-medium">+5% from last week</p>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-slate-500 text-sm font-medium">Average Order Value</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">$124.50</h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">Stable</p>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              className="input-field pl-10 w-full"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Customer Details</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{customer.name}</p>
                        <p className="text-xs text-slate-500">Active {customer.lastActive}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Mail size={14} /> {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone size={14} /> {customer.phone}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} /> {customer.location}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{customer.orders}</td>
                  <td className="p-4 font-bold text-green-600">{customer.spent}</td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                      <MoreVertical size={18} />
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

export default SellerCustomers;
