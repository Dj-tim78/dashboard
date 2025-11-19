
import React, { useState, useEffect } from 'react';
import { Container, ContainerStatus, User, MetricPoint, DockerImage, DockerVolume, Notification, RestartPolicy, SortField, SortDirection, HealthStatus } from './types';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { ContainerRow } from './components/ContainerRow';
import { LogModal } from './components/LogModal';
import { ContainerDetailsModal } from './components/ContainerDetailsModal';
import { CreateContainerModal } from './components/CreateContainerModal';
import { PullImageModal } from './components/PullImageModal';
import { ImageList } from './components/ImageList';
import { VolumeList } from './components/VolumeList';
import { UserList } from './components/UserList'; // Import UserList
import { UserModal } from './components/UserModal'; // Import UserModal
import { Toast } from './components/Toast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Server, Box, Cpu, Activity, Search, Sparkles, Shield, Eye, EyeOff, Lock, PlusCircle, Filter, PieChart as PieChartIcon, RefreshCw, ArrowUp, ArrowDown, ArrowUpDown, ArrowLeft, KeyRound, Users, WifiOff } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

// --- Mock Data Constants for Auth Only ---
const INITIAL_USERS: User[] = [
    { 
        id: '1', 
        username: 'admin', 
        role: 'admin', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        password: 'admin', // Simple mock password
        created: '2023-01-15T08:00:00Z'
    },
    { 
        id: '2', 
        username: 'viewer', 
        role: 'viewer', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viewer',
        password: 'view',
        created: '2023-03-10T14:30:00Z'
    }
];

// --- Inline Login Component ---
const LoginComponent: React.FC<{ onLogin: (user: User) => void, users: User[] }> = ({ onLogin, users }) => {
    const [view, setView] = useState<'select' | 'password'>('select');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setView('password');
        setError('');
        setPassword('');
        setShowPassword(false);
    }

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser && password === selectedUser.password) {
            onLogin(selectedUser);
        } else {
            setError('Incorrect password.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl"></div>

            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md relative z-10 transition-all duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-900/50 mb-4">
                        <Box className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Andorya Dashboard</h1>
                    <p className="text-slate-400">Enterprise Container Management</p>
                </div>

                {view === 'select' ? (
                    <div className="space-y-4 animate-fade-in max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                            <p className="text-sm text-blue-200 text-center">Select a user account</p>
                        </div>
                        
                        {users.map(u => (
                             <button 
                                key={u.id}
                                onClick={() => handleUserSelect(u)} 
                                className="group w-full flex items-center justify-between bg-slate-700/50 hover:bg-slate-600 border border-slate-600 p-4 rounded-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={u.avatar} className="w-10 h-10 rounded-full bg-slate-800" alt="Avatar" />
                                    <div className="text-left">
                                        <div className="font-bold text-white">{u.username}</div>
                                        <div className="text-xs text-slate-400 capitalize">{u.role}</div>
                                    </div>
                                </div>
                                {u.role === 'admin' ? <Shield size={16} className="text-emerald-400" /> : <Eye size={16} className="text-purple-400" />}
                            </button>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in">
                         <button 
                            type="button"
                            onClick={() => { setView('select'); setError(''); setPassword(''); setSelectedUser(null); }}
                            className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-2 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to users
                        </button>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Password for {selectedUser?.username}</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Enter password"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {error && (
                                <p className="text-rose-400 text-sm mt-2 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                                    {error}
                                </p>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                        >
                            Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

type View = 'dashboard' | 'images' | 'volumes' | 'users';

const PIE_COLORS = {
    [ContainerStatus.RUNNING]: '#10b981', // Emerald
    [ContainerStatus.STOPPED]: '#64748b', // Slate
    [ContainerStatus.ERROR]: '#f43f5e',   // Rose
    [ContainerStatus.EXITED]: '#f59e0b',  // Amber
};

// Helper to parse uptime strings into minutes for sorting
const parseUptime = (uptime: string): number => {
    if (uptime === 'Just now') return 0;
    const parts = uptime.split(' ');
    if (parts.length < 2) return 0;
    
    const val = parseInt(parts[0]);
    const unit = parts[1].toLowerCase();
    
    if (unit.startsWith('min')) return val;
    if (unit.startsWith('hour')) return val * 60;
    if (unit.startsWith('day')) return val * 60 * 24;
    if (unit.startsWith('week')) return val * 60 * 24 * 7;
    if (unit.startsWith('month')) return val * 60 * 24 * 30;
    
    return 0;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  
  // Data State - Initialize empty, no mock data
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [containers, setContainers] = useState<Container[]>([]);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [volumes, setVolumes] = useState<DockerVolume[]>([]);
  const [connectionError, setConnectionError] = useState(false);

  // UI State
  const [selectedLogsContainerId, setSelectedLogsContainerId] = useState<string | null>(null); 
  const [selectedDetailsContainerId, setSelectedDetailsContainerId] = useState<string | null>(null); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPullModalOpen, setIsPullModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContainerStatus | 'ALL'>('ALL');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Confirmation State
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    targetId: string | null; 
    action: 'start' | 'stop' | 'restart' | 'delete' | null;
    targetName: string; 
    targetType: 'container' | 'user'; 
  }>({ isOpen: false, targetId: null, action: null, targetName: '', targetType: 'container' });

  // --- Helpers ---
  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Map Raw Backend Data to Container Interface
  const mapBackendToFrontend = (backendData: any[]): Container[] => {
      return backendData.map((c: any) => {
          // Determine Status
          let status = ContainerStatus.STOPPED;
          if (c.State === 'running') status = ContainerStatus.RUNNING;
          else if (c.State === 'exited') status = ContainerStatus.EXITED;
          else if (c.State === 'dead' || c.State === 'restarting') status = ContainerStatus.ERROR;

          return {
              id: c.Id,
              name: c.Names ? c.Names[0].replace('/', '') : 'unknown',
              image: c.Image,
              status: status,
              health: status === ContainerStatus.RUNNING ? 'healthy' : 'none',
              created: new Date(c.Created * 1000).toISOString(),
              uptime: c.Status,
              port: c.Ports && c.Ports.length > 0 ? `${c.Ports[0].PublicPort}:${c.Ports[0].PrivatePort}` : '-',
              cpu: 0, // Backend typically needs stream for this, using 0 default
              cpuLimit: 100,
              memory: 0, 
              memoryLimit: 1024,
              logs: [], 
              envVars: {},
              volumes: c.Mounts ? c.Mounts.map((m: any) => ({ hostPath: m.Source, mountPath: m.Destination, mode: m.Mode })) : [],
              restartPolicy: 'no'
          };
      });
  };

  // Fetch Data - NO SIMULATION FALLBACK
  const fetchSystemData = async () => {
        try {
            // Attempt to fetch from local backend (port 3001 as per README)
            const [containersRes, statsRes] = await Promise.all([
                fetch('http://localhost:3001/api/containers', { signal: AbortSignal.timeout(2000) }),
                fetch('http://localhost:3001/api/stats', { signal: AbortSignal.timeout(2000) })
            ]);

            if (containersRes.ok && statsRes.ok) {
                const rawContainers = await containersRes.json();
                const systemStats = await statsRes.json();
                
                const mappedContainers = mapBackendToFrontend(rawContainers);
                
                // We now rely on backend data primarily.
                setContainers(mappedContainers);
                setConnectionError(false);

                const now = new Date();
                const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                
                // Use real system stats 
                const totalCpu = systemStats.cpu || 0;
                const totalMem = (systemStats.memory / 1024 / 1024) || 0; // Convert bytes to MB

                 setMetrics(prev => {
                    const newMetrics = [...prev, { 
                        time: timeStr, 
                        value: totalCpu,
                        value2: totalMem
                    }];
                    if (newMetrics.length > 20) return newMetrics.slice(1);
                    return newMetrics;
                });
            } else {
                throw new Error("API Error");
            }
        } catch (error) {
            setConnectionError(true);
            // No simulation fallback. App will show empty or stale state if backend is down.
            console.warn("Backend unreachable. Ensure server.js is running on port 3001.");
        }
    };

  useEffect(() => {
    if (!user || activeView !== 'dashboard') return;
    
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 2000);
    return () => clearInterval(interval);
  }, [user, activeView]);

  const handleLogin = (authenticatedUser: User) => {
      setUser(authenticatedUser);
  };

  const handleLogout = () => {
      setUser(null);
      setActiveView('dashboard');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSystemData().then(() => {
        addNotification('Dashboard data refreshed', 'success');
        setIsRefreshing(false);
    });
  };

  // Note: These handlers update local state optimistically. 
  // In a full implementation, they should POST to the backend.
  const handleContainerAction = (id: string, action: 'start' | 'stop' | 'restart' | 'delete') => {
    if (user?.role !== 'admin') return;

    const targetContainer = containers.find(c => c.id === id);
    if (!targetContainer) return;

    setConfirmation({
      isOpen: true,
      targetId: id,
      action: action,
      targetName: targetContainer.name,
      targetType: 'container'
    });
  };

  const handleConfirmAction = () => {
    const { targetId, action, targetType, targetName } = confirmation;
    if (!targetId || !action) return;

    const timestamp = new Date().toISOString();
    const username = user?.username || 'System';

    if (targetType === 'user' && action === 'delete') {
        setIsProcessingAction(true);
        setTimeout(() => {
            setUsers(prev => prev.filter(u => u.id !== targetId));
            addNotification(`User ${targetName} deleted successfully`, 'success');
            setIsProcessingAction(false);
            setConfirmation({ ...confirmation, isOpen: false });
        }, 1500);
        return;
    }

    if (targetType === 'container') {
        // Optimistic update - in real app, call API here
        if (action === 'delete') {
            setIsProcessingAction(true);
            setTimeout(() => {
                setContainers(prev => prev.filter(c => c.id !== targetId));
                if (selectedDetailsContainerId === targetId) {
                    setSelectedDetailsContainerId(null);
                }
                addNotification(`Container ${targetName} deleted successfully`, 'success');
                setIsProcessingAction(false);
                setConfirmation({ ...confirmation, isOpen: false });
            }, 2500); 
            return;
        }

        setContainers(prev => prev.map(c => {
            if (c.id !== targetId) return c;
            let newStatus = c.status;
            let newLogs = [...c.logs];
            let newHealth = c.health;

            newLogs.push(`[audit] Action '${action.toUpperCase()}' initiated by user '${username}' at ${timestamp}`);

            if (action === 'stop') {
                newStatus = ContainerStatus.STOPPED;
                newHealth = 'none';
            }
            if (action === 'start') {
                newStatus = ContainerStatus.RUNNING;
                newHealth = 'healthy';
            }
            if (action === 'restart') {
                newHealth = 'healthy';
            }
            return { ...c, status: newStatus, health: newHealth, logs: newLogs };
        }));

        addNotification(`Container ${targetName} ${action}ed successfully`, 'success');
        setConfirmation({ ...confirmation, isOpen: false });
    }
  };

  const handleCreateContainer = (containerData: Partial<Container>) => {
    const newId = Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().toISOString();
    const username = user?.username || 'System';
    
    // Optimistic creation
    const newContainer: Container = {
        id: newId,
        name: containerData.name || 'unnamed',
        image: containerData.image || 'unknown',
        status: ContainerStatus.RUNNING,
        health: 'healthy', 
        created: timestamp,
        uptime: 'Just now',
        port: containerData.port || '-',
        cpu: 0,
        cpuLimit: containerData.cpuLimit || 100,
        memory: 0,
        memoryLimit: containerData.memoryLimit || 512,
        logs: [
            `[audit] Container created by user '${username}' at ${timestamp}`,
            `[info] Container created at ${timestamp}`, 
        ],
        envVars: containerData.envVars || {},
        volumes: containerData.volumes || [],
        restartPolicy: containerData.restartPolicy || 'no'
    };

    setContainers(prev => [...prev, newContainer]);
    addNotification(`Container ${newContainer.name} deployed successfully`, 'success');
  };

  const handleUpdateContainer = (id: string, updates: Partial<Container>) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addNotification('Container configuration updated', 'success');
  };

  const handlePullImage = (imageInput: string) => {
     const [repo, tag] = imageInput.includes(':') ? imageInput.split(':') : [imageInput, 'latest'];
     
     const exists = images.some(img => img.repository === repo && img.tag === tag);
     if (exists) {
         addNotification(`Image ${repo}:${tag} is already up to date`, 'info');
         return;
     }

     const newImage: DockerImage = {
         id: `sha256:${Math.random().toString(16).substring(2, 10)}`,
         repository: repo,
         tag: tag,
         size: `0MB`,
         created: 'Just now'
     };

     setImages(prev => [newImage, ...prev]);
     addNotification(`Image ${repo}:${tag} pulled successfully`, 'success');
  };

  const handleDeleteImage = (id: string) => {
      setImages(prev => prev.filter(img => img.id !== id));
      addNotification('Image deleted successfully', 'info');
  };

  const handleDeleteVolume = (name: string) => {
      setVolumes(prev => prev.filter(vol => vol.name !== name));
      addNotification('Volume removed successfully', 'info');
  };

  const handleAddUser = (userData: Partial<User>) => {
      const newUser: User = {
          id: Math.random().toString(36).substring(2, 10),
          username: userData.username || 'user',
          role: userData.role || 'viewer',
          avatar: userData.avatar || '',
          password: userData.password || 'password',
          created: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      addNotification(`User ${newUser.username} created successfully`, 'success');
  };

  const handleUpdateUser = (userData: Partial<User>) => {
      setUsers(prev => prev.map(u => {
          if (u.id === userData.id) {
              const updated = { ...u, ...userData };
              if (!userData.password) updated.password = u.password;
              return updated;
          }
          return u;
      }));
      addNotification('User updated successfully', 'success');
  };

  const handleDeleteUser = (id: string) => {
      if (id === user?.id) {
          addNotification('You cannot delete your own account', 'error');
          return;
      }
      const targetUser = users.find(u => u.id === id);
      if (!targetUser) return;

      setConfirmation({
          isOpen: true,
          targetId: id,
          action: 'delete',
          targetName: targetUser.username,
          targetType: 'user'
      });
  };

  // Filtering and Sorting Logic
  const filteredAndSortedContainers = containers
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.image.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
            case 'cpu': comparison = a.cpu - b.cpu; break;
            case 'memory': comparison = a.memory - b.memory; break;
            case 'uptime': comparison = parseUptime(a.uptime) - parseUptime(b.uptime); break;
            case 'name': default: comparison = a.name.localeCompare(b.name); break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

  const activeCount = containers.filter(c => c.status === ContainerStatus.RUNNING).length;
  const errorCount = containers.filter(c => c.status === ContainerStatus.ERROR).length;
  
  const statusData = [
      { name: 'Running', value: activeCount, color: PIE_COLORS[ContainerStatus.RUNNING] },
      { name: 'Stopped', value: containers.filter(c => c.status === ContainerStatus.STOPPED).length, color: PIE_COLORS[ContainerStatus.STOPPED] },
      { name: 'Error', value: errorCount, color: PIE_COLORS[ContainerStatus.ERROR] },
  ].filter(d => d.value > 0);

  if (!user) {
    return <LoginComponent onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Box className="text-blue-500 mr-3" />
                <span className="font-bold text-lg text-white">Andorya Dashboard</span>
            </div>
            <nav className="p-4 space-y-2">
                <button 
                    onClick={() => setActiveView('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <Activity size={20} />
                    <span className="font-medium">Dashboard</span>
                </button>
                
                {user.role === 'admin' ? (
                    <>
                        <button 
                            onClick={() => setActiveView('images')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'images' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Server size={20} />
                            <span className="font-medium">Images</span>
                        </button>
                        <button 
                            onClick={() => setActiveView('volumes')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'volumes' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Box size={20} />
                            <span className="font-medium">Volumes</span>
                        </button>
                         <button 
                            onClick={() => setActiveView('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'users' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            <Users size={20} />
                            <span className="font-medium">Users</span>
                        </button>
                    </>
                ) : (
                    <div className="mt-4 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Lock size={14} />
                            <span className="text-xs font-bold uppercase">Restricted</span>
                        </div>
                        <p className="text-xs text-slate-500">Management features are disabled in viewer mode.</p>
                    </div>
                )}
            </nav>

            <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-4 rounded-xl border border-indigo-500/30 mb-4">
                    <div className="flex items-center gap-2 text-indigo-300 mb-2">
                        <Sparkles size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Gemini AI Active</span>
                    </div>
                    <p className="text-xs text-indigo-400/80">AI analysis available for container logs.</p>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative h-screen">
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
                <div className="pointer-events-auto">
                    {notifications.map(n => (
                        <Toast key={n.id} notification={n} onClose={removeNotification} />
                    ))}
                </div>
            </div>

            <Header user={user} onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Connection Error Banner */}
                    {connectionError && activeView === 'dashboard' && (
                         <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 text-amber-200 animate-fade-in">
                            <WifiOff className="shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold">Backend Unreachable</h4>
                                <p className="text-sm opacity-80 mt-1">
                                    Could not connect to Docker backend API at <code className="bg-amber-900/30 px-1 rounded text-xs">http://localhost:3001</code>. 
                                    Dashboard data may be empty. Please check the README for server installation instructions.
                                </p>
                            </div>
                         </div>
                    )}

                    {activeView === 'dashboard' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard title="Active Containers" value={activeCount} subtitle="Real-time" icon={Box} color="blue" />
                                <StatsCard title="Total CPU Load" value={`${containers.filter(c => c.status === 'RUNNING').reduce((a,c)=>a+c.cpu,0).toFixed(1)}%`} subtitle="System Usage" icon={Cpu} color="purple" />
                                <StatsCard title="Total Memory" value={`${(containers.filter(c => c.status === 'RUNNING').reduce((a,c)=>a+c.memory,0) / 1024).toFixed(1)} GB`} subtitle="Allocated RAM" icon={Activity} color="green" />
                                <StatsCard title="System Issues" value={errorCount} subtitle={errorCount > 0 ? "Requires Attention" : "All systems operational"} icon={Server} color="red" />
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* CPU Chart */}
                                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18} className="text-blue-400"/> CPU Trend</h3>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={metrics}>
                                                <defs>
                                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} unit="%" />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                                    itemStyle={{ color: '#60a5fa' }}
                                                />
                                                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Memory Chart */}
                                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Memory Trend</h3>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={metrics}>
                                                <defs>
                                                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} unit="MB" />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                                    itemStyle={{ color: '#34d399' }}
                                                />
                                                <Area type="monotone" dataKey="value2" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                                {/* Status Pie Chart */}
                                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><PieChartIcon size={18} className="text-purple-400"/> Status Distribution</h3>
                                    <div className="flex-1 flex items-center justify-center h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Legend 
                                                    verticalAlign="bottom" 
                                                    height={36}
                                                    formatter={(value) => <span className="text-slate-300 text-sm ml-1">{value}</span>}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Container List Header & Filter */}
                            <div>
                                <div className="flex flex-col xl:flex-row items-center justify-between mb-6 gap-4">
                                    <h2 className="text-xl font-bold text-white">Containers</h2>
                                    <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap">
                                        {/* Deploy Button */}
                                        {user.role === 'admin' && (
                                             <button 
                                                onClick={() => setIsCreateModalOpen(true)}
                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
                                             >
                                                <PlusCircle size={18} />
                                                Deploy
                                             </button>
                                        )}

                                        {/* Refresh Button */}
                                        <button 
                                            onClick={handleRefresh}
                                            className={`p-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white hover:bg-slate-700 transition-colors ${isRefreshing ? 'opacity-70 cursor-wait' : ''}`}
                                            title="Refresh Data"
                                            disabled={isRefreshing}
                                        >
                                            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                                        </button>

                                        {/* Sorting Controls */}
                                        <div className="flex items-center gap-1 bg-slate-800 rounded-lg border border-slate-700 p-1">
                                            <div className="relative">
                                                 <select
                                                    value={sortField}
                                                    onChange={(e) => setSortField(e.target.value as SortField)}
                                                    className="appearance-none bg-transparent text-slate-200 pl-3 pr-8 py-1 focus:outline-none cursor-pointer text-sm font-medium"
                                                >
                                                    <option value="name">Name</option>
                                                    <option value="cpu">CPU</option>
                                                    <option value="memory">Memory</option>
                                                    <option value="uptime">Uptime</option>
                                                </select>
                                                <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
                                            </div>
                                            <div className="w-px h-5 bg-slate-700 mx-1"></div>
                                            <button 
                                                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                                                title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                                            >
                                                {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                            </button>
                                        </div>

                                        {/* Status Filter */}
                                        <div className="relative">
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                                className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-8 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-sm"
                                            >
                                                <option value="ALL">All Status</option>
                                                <option value="RUNNING">Running</option>
                                                <option value="STOPPED">Stopped</option>
                                                <option value="ERROR">Error</option>
                                            </select>
                                            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                        </div>

                                        {/* Search */}
                                        <div className="relative flex-1 md:w-64 min-w-[200px]">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input 
                                                type="text" 
                                                placeholder="Search containers..." 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-600 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-1 min-h-[200px]">
                                    {filteredAndSortedContainers.length > 0 ? (
                                        filteredAndSortedContainers.map(container => (
                                            <ContainerRow 
                                                key={container.id} 
                                                container={container} 
                                                isAdmin={user.role === 'admin'}
                                                onAction={handleContainerAction}
                                                onViewLogs={setSelectedLogsContainerId}
                                                onRowClick={setSelectedDetailsContainerId}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                            <Box size={48} className="opacity-20 mb-4" />
                                            <p>{connectionError ? "Waiting for backend connection..." : "No containers found."}</p>
                                            {(searchQuery || statusFilter !== 'ALL') && !connectionError && (
                                                <button 
                                                    onClick={() => {setSearchQuery(''); setStatusFilter('ALL')}}
                                                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    Clear Filters
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'images' && (
                        <ImageList 
                            images={images} 
                            onDelete={handleDeleteImage} 
                            onPullClick={() => setIsPullModalOpen(true)}
                        />
                    )}

                    {activeView === 'volumes' && (
                        <VolumeList volumes={volumes} onDelete={handleDeleteVolume} />
                    )}
                    
                    {activeView === 'users' && (
                        <UserList 
                            users={users} 
                            onDelete={handleDeleteUser} 
                            onEdit={(u) => { setUserToEdit(u); setIsUserModalOpen(true); }}
                            onAdd={() => { setUserToEdit(null); setIsUserModalOpen(true); }}
                            currentUser={user}
                        />
                    )}

                </div>
            </main>
        </div>

        {/* Log/AI Modal */}
        {selectedLogsContainerId && (
            <LogModal 
                container={containers.find(c => c.id === selectedLogsContainerId) || null} 
                onClose={() => setSelectedLogsContainerId(null)} 
            />
        )}

        {/* Details Modal */}
        {selectedDetailsContainerId && (
            <ContainerDetailsModal 
                container={containers.find(c => c.id === selectedDetailsContainerId) || null} 
                onClose={() => setSelectedDetailsContainerId(null)} 
                onAction={handleContainerAction}
                onUpdate={handleUpdateContainer} // Pass the update handler
                isAdmin={user.role === 'admin'}
            />
        )}

        {/* Create Container Modal */}
        <CreateContainerModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateContainer}
            availableImages={images}
            existingContainerNames={containers.map(c => c.name)}
        />

        {/* Pull Image Modal */}
        <PullImageModal 
            isOpen={isPullModalOpen}
            onClose={() => setIsPullModalOpen(false)}
            onConfirm={handlePullImage}
        />

        {/* User Modal */}
        <UserModal 
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            onSubmit={(data) => {
                if (userToEdit) handleUpdateUser(data);
                else handleAddUser(data);
            }}
            userToEdit={userToEdit}
        />

        {/* Confirmation Modal */}
        {confirmation.isOpen && confirmation.action && (
          <ConfirmationModal 
            isOpen={confirmation.isOpen}
            onClose={() => !isProcessingAction && setConfirmation({ ...confirmation, isOpen: false })}
            onConfirm={handleConfirmAction}
            title={`Confirm ${confirmation.action === 'stop' ? 'Stop' : confirmation.action === 'start' ? 'Start' : confirmation.action === 'restart' ? 'Restart' : 'Delete'}`}
            message={`Are you sure you want to ${confirmation.action} ${confirmation.targetType === 'user' ? 'user' : 'container'} "${confirmation.targetName}"? ${confirmation.action === 'delete' ? 'This action is irreversible.' : 'This action might interrupt active services.'}`}
            action={confirmation.action}
            isLoading={isProcessingAction}
          />
        )}
    </div>
  );
}
