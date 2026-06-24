import { Toaster, ToastBar, toast, resolveValue } from 'react-hot-toast';
import useTheme from '../../hooks/useTheme';
import SuccessPopup from '../ui/SuccessPopup';

const ToastProvider = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            duration: 1000,
          },
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#0f172a',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(31,38,135,0.15)',
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#1e293b' : '#ffffff',
            },
          },
        }}
      >
        {(t) => {
          if (t.type === 'success') {
            return (
              <SuccessPopup 
                isOpen={t.visible} 
                onClose={() => toast.dismiss(t.id)}
                message="Success!"
                subMessage={resolveValue(t.message, t)}
              />
            );
          }
          return <ToastBar toast={t} />;
        }}
      </Toaster>
    </>
  );
};

export default ToastProvider;
