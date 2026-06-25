import { useState } from 'react';
import useAuth from './useAuth';
import RoleRestrictedModal from '../components/common/RoleRestrictedModal';

const useRoleCheck = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const checkRole = (eOrAction, callback) => {
    // Can be called directly as checkRole(() => doSomething())
    // Or attached to onClick as checkRole(e, () => doSomething())
    let action = callback;
    let e = null;
    
    if (typeof eOrAction === 'function') {
      action = eOrAction;
    } else if (eOrAction && typeof eOrAction.preventDefault === 'function') {
      e = eOrAction;
    }

    if (user && (user.role === 'admin' || user.role === 'seller')) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setShowModal(true);
    } else {
      if (action) action();
    }
  };

  const Modal = () => <RoleRestrictedModal isOpen={showModal} onClose={() => setShowModal(false)} />;

  return { checkRole, RoleModal: Modal };
};

export default useRoleCheck;
