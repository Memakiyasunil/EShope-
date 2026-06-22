import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { toggleSidebar } from '../store/slices/uiSlice';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors overflow-x-hidden">
      <Navbar />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 border-l border-slate-200 dark:border-slate-800">
          <div className="lg:hidden flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-slate-900 dark:text-white">Dashboard</h1>
          </div>
          <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
