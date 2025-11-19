
import React from 'react';
import { User } from '../types';
import { LogOut, Shield, User as UserIcon, Menu, Eye } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar }) => {
  return (
    <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50">
                A
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 hidden sm:block">
                Andorya Dashboard
            </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user.role === 'viewer' && (
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-full transition-all hover:bg-slate-700">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Eye size={12} /> Read Only
                </span>
             </div>
        )}
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{user.username}</span>
                    {user.role === 'admin' ? (
                        <Shield size={14} className="text-emerald-400" fill="currentColor" fillOpacity={0.2} />
                    ) : (
                        <Eye size={14} className="text-purple-400" />
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="uppercase text-[10px] tracking-wider font-bold">{user.role}</span>
                </div>
            </div>
            
            <div className={`h-10 w-10 rounded-full overflow-hidden border-2 flex items-center justify-center shadow-sm transition-colors ${
                user.role === 'admin' 
                ? 'border-emerald-500/50 shadow-emerald-500/20 bg-slate-700' 
                : 'border-purple-500/50 shadow-purple-500/20 bg-slate-700'
            }`}>
                {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-lg font-bold text-slate-400">
                        {user.username.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
        </div>

        <button 
            onClick={onLogout}
            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-full transition-colors ml-2"
            title="Logout"
        >
            <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
