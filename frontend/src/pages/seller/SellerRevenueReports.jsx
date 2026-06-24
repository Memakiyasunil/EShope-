import { useState } from 'react';
import { Download, Filter, FileText, ChevronDown } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const SellerRevenueReports = () => {
  const [reports] = useState([
    { id: 'REP-2023-11', month: 'November 2023', orders: 420, revenue: '$12,450.00', fees: '$1,245.00', net: '$11,205.00', status: 'Generated' },
    { id: 'REP-2023-10', month: 'October 2023', orders: 385, revenue: '$10,230.00', fees: '$1,023.00', net: '$9,207.00', status: 'Generated' },
    { id: 'REP-2023-09', month: 'September 2023', orders: 412, revenue: '$11,890.00', fees: '$1,189.00', net: '$10,701.00', status: 'Generated' },
    { id: 'REP-2023-08', month: 'August 2023', orders: 350, revenue: '$8,450.00', fees: '$845.00', net: '$7,605.00', status: 'Generated' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue Reports</h1>
          <p className="text-slate-500">Download and analyze your monthly financial statements</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} /> Filter
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} /> Export All
          </button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Report ID</th>
                <th className="p-4 font-medium">Period</th>
                <th className="p-4 font-medium">Total Orders</th>
                <th className="p-4 font-medium">Gross Revenue</th>
                <th className="p-4 font-medium">Platform Fees (10%)</th>
                <th className="p-4 font-medium">Net Earnings</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-500">{report.id}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{report.month}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{report.orders}</td>
                  <td className="p-4 text-slate-900 dark:text-white font-medium">{report.revenue}</td>
                  <td className="p-4 text-red-500 font-medium">-{report.fees}</td>
                  <td className="p-4 text-green-500 font-bold">{report.net}</td>
                  <td className="p-4 text-right">
                    <button className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center justify-end gap-1 w-full">
                      <FileText size={16} /> Download PDF
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

export default SellerRevenueReports;
