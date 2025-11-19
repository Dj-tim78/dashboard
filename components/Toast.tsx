import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Notification } from '../types';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const bgStyles = {
    success: 'bg-slate-800 border-l-4 border-emerald-500',
    error: 'bg-slate-800 border-l-4 border-rose-500',
    info: 'bg-slate-800 border-l-4 border-blue-500',
  };

  const iconStyles = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  return (
    <div className={`${bgStyles[notification.type]} shadow-lg shadow-black/20 rounded-r-lg p-4 mb-3 flex items-center gap-3 min-w-[300px] animate-slide-in-right border border-slate-700`}>
      {iconStyles[notification.type]}
      <p className="text-sm text-slate-200 font-medium flex-1">{notification.message}</p>
      <button onClick={() => onClose(notification.id)} className="text-slate-500 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};
