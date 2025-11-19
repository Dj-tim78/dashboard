
import React from 'react';
import { AlertTriangle, CheckCircle, Power, Trash2, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  action: 'start' | 'stop' | 'restart' | 'delete';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, onClose, onConfirm, title, message, action, isLoading 
}) => {
  if (!isOpen) return null;

  const getActionStyles = () => {
    switch (action) {
      case 'stop':
        return {
          icon: <Power className="text-rose-500" size={32} />,
          buttonClass: 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/20',
          buttonText: 'Stop Container',
          borderColor: 'border-rose-500/30'
        };
      case 'restart':
        return {
          icon: <AlertTriangle className="text-amber-500" size={32} />,
          buttonClass: 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-900/20',
          buttonText: 'Restart Container',
          borderColor: 'border-amber-500/30'
        };
      case 'start':
        return {
          icon: <CheckCircle className="text-emerald-500" size={32} />,
          buttonClass: 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20',
          buttonText: 'Start Container',
          borderColor: 'border-emerald-500/30'
        };
      case 'delete':
        return {
          icon: <Trash2 className="text-rose-500" size={32} />,
          buttonClass: 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/20',
          buttonText: 'Delete Permanently',
          borderColor: 'border-rose-500/50'
        };
    }
  };

  const style = getActionStyles();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className={`bg-slate-900 border ${style.borderColor} rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-pop-in`}>
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
            {style.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm mb-8 px-4 leading-relaxed">{message}</p>
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors font-medium w-full border border-slate-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all transform hover:scale-105 w-full ${style.buttonClass} flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
              {isLoading ? 'Processing...' : style.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
