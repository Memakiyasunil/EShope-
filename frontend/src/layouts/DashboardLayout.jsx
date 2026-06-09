import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { toggleSidebar } from '../store/slices/uiSlice';

const DashboardLayout = () => {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-slate-900 dark:text-white">Dashboard</h1>
          </div>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
