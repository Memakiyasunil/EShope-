import { useState } from 'react';
import { Bell, CheckCircle, Package, AlertTriangle, DollarSign } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      message: 'You have received a new order (#ORD-9942) for 2x Premium Wireless Headphones.',
      type: 'order',
      date: '10 mins ago',
      isRead: false
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Product "Minimalist Smart Wallet" is running low on stock (Only 5 left). Please restock soon.',
      type: 'alert',
      date: '2 hours ago',
      isRead: false
    },
    {
      id: 3,
      title: 'Withdrawal Processed',
      message: 'Your withdrawal request of $1,200.00 has been successfully processed.',
      type: 'payment',
      date: '1 day ago',
      isRead: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'order': return <Package size={20} className="text-blue-500" />;
      case 'alert': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'payment': return <DollarSign size={20} className="text-green-500" />;
      default: return <Bell size={20} className="text-slate-500" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'order': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'alert': return 'bg-amber-100 dark:bg-amber-900/30';
      case 'payment': return 'bg-green-100 dark:bg-green-900/30';
      default: return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500">Stay updated on your store's activity</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-2"
          >
            <CheckCircle size={16} /> Mark all as read
          </button>
        )}
      </div>

      <GlassCard className="p-0 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!notification.isRead ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold text-slate-900 dark:text-white ${!notification.isRead ? 'font-bold' : ''}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{notification.date}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {notification.message}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-6">
              <Bell size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You're all caught up!</h2>
            <p className="text-slate-500 max-w-md">
              You don't have any new notifications right now.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default SellerNotifications;
