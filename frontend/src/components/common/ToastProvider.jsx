import { Toaster } from 'react-hot-toast';
import useTheme from '../../hooks/useTheme';

const ToastProvider = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
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
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: isDark ? '#1e293b' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#1e293b' : '#ffffff',
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
