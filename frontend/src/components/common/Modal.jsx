import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../store/slices/uiSlice';

const Modal = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  title,
  children,
  size = 'md',
}) => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => state.ui);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : modal.isOpen;
  const handleClose = controlledOnClose || (() => dispatch(closeModal()));

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${sizeClasses[size]} glass rounded-2xl shadow-2xl animate-slide-up`}
        role="dialog"
        aria-modal="true"
      >
        {(title || controlledIsOpen !== undefined) && (
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            {title && (
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ml-auto"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
