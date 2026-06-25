import Modal from './Modal';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const RoleRestrictedModal = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();

  const handleSwitchAccount = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Administrator Account Detected" size="md">
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          This account is intended for platform management only. To place orders or use wishlist features, please sign in with a Customer account.
        </p>
        <div className="flex flex-col w-full gap-3">
          <button onClick={handleSwitchAccount} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            Switch Account <ArrowRight size={18} />
          </button>
          <button onClick={onClose} className="btn-outline w-full py-3">
            Continue Browsing
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RoleRestrictedModal;
