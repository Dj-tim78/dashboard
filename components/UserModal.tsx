
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { X, User as UserIcon, Lock, Shield, Eye, Save, Upload, Check } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => void;
  userToEdit?: User | null; // If provided, we are in edit/change password mode
}

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
];

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, userToEdit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (userToEdit) {
        setUsername(userToEdit.username);
        setRole(userToEdit.role);
        setPassword(''); // Clear password field for security/reset
        setAvatar(userToEdit.avatar);
      } else {
        setUsername('');
        setPassword('');
        setRole('viewer');
        setAvatar(AVATAR_OPTIONS[0]);
      }
    }
  }, [isOpen, userToEdit]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
        setError('Username is required');
        return;
    }

    // If creating new user, password is required. 
    // If editing, password can be empty (meaning no change), unless specific requirement.
    if (!userToEdit && !password) {
        setError('Password is required for new users');
        return;
    }
    
    if (password && password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
    }

    onSubmit({
        id: userToEdit?.id,
        username,
        password: password || undefined, // Send undefined if empty during edit to signal no change
        role,
        avatar: avatar // Use the selected avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
              {userToEdit ? <Lock size={24} /> : <UserIcon size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{userToEdit ? 'Edit User' : 'Add User'}</h2>
              <p className="text-xs text-slate-400">{userToEdit ? 'Change password or role' : 'Create a new account'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
            {/* Avatar Selection Side */}
            <div className="p-6 bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-700 md:w-1/3 flex flex-col items-center">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-4 w-full text-center">Profile Avatar</label>
                
                {/* Current Avatar Preview */}
                <div className="relative w-32 h-32 rounded-full border-4 border-slate-700 overflow-hidden mb-6 shadow-lg group">
                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                         <Upload className="text-white" size={24} />
                    </div>
                </div>

                {/* Upload Button */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 mb-6 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                    <Upload size={14} /> Upload Custom
                </button>

                {/* Presets */}
                <div className="w-full">
                    <p className="text-xs text-slate-500 mb-2 text-center">Or choose a preset:</p>
                    <div className="grid grid-cols-4 gap-2">
                        {AVATAR_OPTIONS.map((opt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setAvatar(opt)}
                                className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all ${avatar === opt ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-110' : 'border-transparent hover:border-slate-500'}`}
                            >
                                <img src={opt} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 md:w-2/3">
                {error && (
                    <div className="bg-rose-500/10 text-rose-400 text-sm px-4 py-2 rounded-lg border border-rose-500/20">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Username</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Enter username"
                            disabled={!!userToEdit} // Prevent changing username for simplicity
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        {userToEdit ? 'New Password (Leave blank to keep)' : 'Password'}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder={userToEdit ? "••••••••" : "Enter password"}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                role === 'admin' 
                                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                        >
                            <Shield size={18} />
                            <span className="font-medium">Admin</span>
                            {role === 'admin' && <Check size={16} />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('viewer')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                role === 'viewer' 
                                ? 'bg-purple-600/20 border-purple-500 text-purple-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                        >
                            <Eye size={18} />
                            <span className="font-medium">Viewer</span>
                            {role === 'viewer' && <Check size={16} />}
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> {userToEdit ? 'Update User' : 'Create User'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
