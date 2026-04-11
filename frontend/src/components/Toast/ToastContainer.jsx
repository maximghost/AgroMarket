import React, { useContext } from 'react';
import { ToastContext } from '../../context/ToastContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 border rounded-lg shadow-lg max-w-md animate-slide-up ${getStyles(toast.type)}`}
        >
          {getIcon(toast.type)}
          
          <div className="flex-1">
            <p className="font-medium">{toast.message}</p>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick();
                  removeToast(toast.id);
                }}
                className="mt-2 font-semibold text-sm hover:opacity-80 transition"
              >
                {toast.action.label} →
              </button>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-60 hover:opacity-100 transition"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
