
import React, { useState } from 'react';
import { User } from '../types';
import { Search, Trash2, Shield, User as UserIcon, Plus, Edit, KeyRound, Calendar } from 'lucide-react';

interface UserListProps {
  users: User[];
  onDelete: (id: string) => void;
  onEdit: (user: User) => void;
  onAdd: () => void;
  currentUser: User;
}

export const UserList: React.FC<UserListProps> = ({ users, onDelete, onEdit, onAdd, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserIcon className="text-indigo-400" /> User Management
                </h2>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full font-bold">
                    {users.length}
                </span>
            </div>
            <button 
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-900/20"
            >
                <Plus size={16} />
                <span>Add User</span>
            </button>
        </div>

        <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredUsers.map(user => (
            <div key={user.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between hover:border-slate-600 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full bg-slate-700 object-cover" />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center ${
                            user.role === 'admin' ? 'bg-emerald-500 text-white' : 'bg-purple-500 text-white'
                        }`}>
                            {user.role === 'admin' ? <Shield size={10} /> : <UserIcon size={10} />}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">{user.username}</h3>
                        <div className="flex flex-col">
                            <div className="text-xs text-slate-400 capitalize">{user.role} Account</div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                                <Calendar size={10} />
                                <span>Joined {new Date(user.created).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onEdit(user)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-blue-600/20 hover:text-blue-400 text-slate-300 rounded-lg transition-all text-sm"
                        title="Change Password / Edit Role"
                    >
                        <KeyRound size={14} />
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                    
                    {user.id !== currentUser.id && (
                        <button 
                            onClick={() => onDelete(user.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                            title="Delete User"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>
        ))}
        
        {filteredUsers.length === 0 && (
            <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <UserIcon className="text-slate-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-300 mb-2">No Users Found</h3>
                <p className="text-sm text-slate-500 mb-6">
                    {searchQuery ? `No matches for "${searchQuery}"` : 'Get started by adding a new user'}
                </p>
                {!searchQuery && (
                    <button 
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20"
                    >
                        <Plus size={18} />
                        <span>Create First User</span>
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
