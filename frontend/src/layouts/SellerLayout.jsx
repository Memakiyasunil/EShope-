import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SellerSidebar from '../components/common/sidebars/SellerSidebar';
import DashboardHeader from '../components/common/DashboardHeader';

const SellerLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-dvh flex bg-slate-50 dark:bg-slate-950 transition-colors overflow-x-hidden">
      <SellerSidebar />
      <div className="flex-1 flex flex-col min-w-0 border-l border-slate-200 dark:border-slate-800 h-dvh overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto relative">
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
  );
};

export default SellerLayout;
