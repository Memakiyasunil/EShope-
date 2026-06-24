import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';

const STEPS = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/orders/my-orders?page=${page}&limit=10`)
      .then(({ data }) => {
        const ordersArray = Array.isArray(data.data) ? data.data : (data.orders || data.data?.orders || []);
        setOrders(ordersArray);
        setTotalPages(data.pagination?.pages || data.totalPages || 1);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSkeleton variant="table" count={5} />;

  return (
    <div>
      <h1 className="section-title mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="glass-card text-center py-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">No orders yet. Start shopping!</p>
          <Link to="/categories" className="btn-primary mt-2">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 dark:border-slate-800/50 pb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">#{order.orderNumber}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Total Amount</span>
                    <span className="font-bold text-xl text-brand-600 dark:text-brand-400">₹{order.totalPrice?.toLocaleString()}</span>
                  </div>
                  <button onClick={() => setSelectedOrder(order)} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <Eye size={16} /> <span className="hidden sm:inline">View Details</span><span className="sm:hidden">View</span>
                  </button>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 shrink-0 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm bg-white dark:bg-slate-900" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <span className="text-xs text-slate-400">No Img</span>
                      </div>
                    )}
                    <div className="flex flex-col max-w-[150px]">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.product?.name || item.name}</span>
                      <span className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] transition-opacity"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
                className="fixed top-[5%] sm:top-[10%] left-1/2 w-[95%] sm:w-[90%] max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-[10000] scrollbar-thin border border-slate-100 dark:border-slate-800"
              >
                <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      Order #{selectedOrder.orderNumber}
                      <StatusBadge status={selectedOrder.status} />
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center gap-2 mt-3 bg-slate-100 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 max-w-max">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Tracking ID:</span>
                      <code className="text-xs sm:text-sm font-mono font-bold text-brand-600 dark:text-brand-400 select-all">{selectedOrder._id}</code>
                    </div>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors bg-slate-50 dark:bg-slate-800/50 self-start">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  {!['cancelled', 'returned', 'refunded'].includes(selectedOrder.status) && (
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200 dark:border-slate-700/50">
                      <h3 className="font-bold mb-4 text-slate-900 dark:text-white text-lg flex items-center gap-2">
                        <CheckCircle className="text-brand-500" size={20} />
                        Tracking Progress
                      </h3>
                      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin snap-x">
                        {STEPS.map((step, i) => {
                          const currentStep = STEPS.indexOf(selectedOrder.status);
                          const isCompleted = i <= currentStep;
                          const isCurrent = i === currentStep;
                          return (
                            <div key={step} className={`flex flex-col items-center gap-2 shrink-0 snap-center min-w-[80px] sm:min-w-[100px] ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${isCompleted ? 'bg-brand-500 text-white shadow-brand-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'} ${isCurrent ? 'ring-4 ring-brand-100 dark:ring-brand-900/50 scale-110' : ''}`}>
                                <CheckCircle size={isCompleted ? 24 : 20} />
                              </div>
                              <span className={`text-[10px] sm:text-xs text-center font-bold uppercase tracking-wider ${isCompleted ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {step.replace(/_/g, ' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex items-center gap-3 shadow-sm">
                          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tracking ID</span>
                          <strong className="text-slate-900 dark:text-white font-mono text-sm tracking-wide">{selectedOrder.trackingNumber}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
                    <div className="lg:col-span-3 space-y-4">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Purchased Items ({selectedOrder.items?.length})</h3>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        {selectedOrder.items?.map((item, i) => (
                          <div key={i} className="flex gap-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            {item.product?.images?.[0] ? (
                              <img src={item.product.images[0]} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0" />
                            ) : (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                <span className="text-xs text-slate-400">No Image</span>
                              </div>
                            )}
                            <div className="flex flex-col justify-between py-1 flex-1">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white line-clamp-2 text-sm sm:text-base leading-tight mb-1">{item.product?.name || item.name}</p>
                                {item.product?.slug && (
                                  <Link to={`/products/${item.product._id}`} className="text-xs text-brand-600 hover:underline">View Product</Link>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs sm:text-sm text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">Qty: {item.quantity}</p>
                                <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">₹{item.price?.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="font-bold mb-4 text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-700 pb-3">Shipping Details</h3>
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 dark:text-white text-base block mb-2">{selectedOrder.shippingAddress?.fullName}</span>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex flex-col gap-1">
                            <span>{selectedOrder.shippingAddress?.addressLine1}</span>
                            <span>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</span>
                            <span className="mt-2 font-medium bg-slate-200/50 dark:bg-slate-700/50 px-2 py-1 rounded-md inline-block w-max">📞 {selectedOrder.shippingAddress?.phone}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-brand-50/50 dark:bg-brand-900/10 rounded-xl p-5 sm:p-6 border border-brand-100 dark:border-brand-900/30 shadow-sm">
                        <h3 className="font-bold mb-4 text-slate-900 dark:text-white text-lg border-b border-brand-200/50 dark:border-brand-800/50 pb-3">Payment Summary</h3>
                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Subtotal ({selectedOrder.items?.length} items)</span>
                            <span className="font-bold text-slate-900 dark:text-white">₹{selectedOrder.itemsPrice?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tax Collected</span>
                            <span className="font-bold text-slate-900 dark:text-white">₹{selectedOrder.taxPrice?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Shipping Fee</span>
                            <span className="font-bold text-slate-900 dark:text-white">{selectedOrder.deliveryCharge ? `₹${selectedOrder.deliveryCharge.toLocaleString()}` : <span className="text-green-600 uppercase text-xs tracking-wider">Free</span>}</span>
                          </div>
                          {selectedOrder.discountAmount > 0 && (
                            <div className="flex justify-between items-center text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md -mx-2">
                              <span>Discount Applied</span>
                              <span>-₹{selectedOrder.discountAmount?.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-black text-lg sm:text-xl pt-4 mt-2 border-t border-brand-200/50 dark:border-brand-800/50 text-slate-900 dark:text-white">
                            <span>Grand Total</span>
                            <span className="text-brand-600 dark:text-brand-400">₹{selectedOrder.totalPrice?.toLocaleString()}</span>
                          </div>
                          <div className="pt-4 mt-2 border-t border-brand-200/50 dark:border-brand-800/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">Payment Method</span>
                              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{selectedOrder.paymentMethod}</span>
                            </div>
                            <StatusBadge status={selectedOrder.paymentStatus} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Orders;
