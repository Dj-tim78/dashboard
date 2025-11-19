
import React, { useState, useEffect } from 'react';
import { Container, ContainerStatus } from '../types';
import { X, Box, HardDrive, Terminal, List, Network, Play, Square, RotateCw, Activity, Power, AlertTriangle, Trash2, Settings, Save } from 'lucide-react';

interface ContainerDetailsModalProps {
  container: Container | null;
  onClose: () => void;
  onAction: (id: string, action: 'start' | 'stop' | 'restart' | 'delete') => void;
  onUpdate: (id: string, updates: Partial<Container>) => void;
  isAdmin: boolean;
}

export const ContainerDetailsModal: React.FC<ContainerDetailsModalProps> = ({ container, onClose, onAction, onUpdate, isAdmin }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'env' | 'volumes' | 'settings' | 'actions'>('overview');
  
  // Local state for settings form
  const [cpuLimit, setCpuLimit] = useState(0);
  const [memoryLimit, setMemoryLimit] = useState(0);

  useEffect(() => {
    if (container) {
      setCpuLimit(container.cpuLimit || 100);
      setMemoryLimit(container.memoryLimit || 512);
    }
  }, [container]);

  if (!container) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Box },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'env', label: 'Environment', icon: List },
    { id: 'volumes', label: 'Volumes', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'actions', label: 'Actions', icon: Activity },
  ];

  const handleSettingsSave = () => {
      onUpdate(container.id, {
          cpuLimit,
          memoryLimit
      });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center gap-4">
                    <div className={`h-4 w-4 rounded-full ${container.status === 'RUNNING' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'bg-slate-600'}`} />
                    <div>
                        <h2 className="text-2xl font-bold text-white">{container.name}</h2>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                            <span>{container.id}</span>
                            <span>•</span>
                            <span>{container.image}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'border-blue-500 text-blue-400' 
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900/30">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Performance</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div title={`Used ${container.cpu.toFixed(2)}% of ${container.cpuLimit}% allocated`} className="cursor-help">
                                        <div className="text-xs text-slate-500 mb-1">CPU Usage</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-mono text-white">{container.cpu.toFixed(2)}%</span>
                                            <span className="text-xs text-slate-500 mb-1">/ {container.cpuLimit}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (container.cpu / container.cpuLimit) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div title={`Used ${container.memory}MB of ${container.memoryLimit}MB allocated`} className="cursor-help">
                                        <div className="text-xs text-slate-500 mb-1">Memory Usage</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-mono text-white">{container.memory} MB</span>
                                            <span className="text-xs text-slate-500 mb-1">/ {container.memoryLimit} MB</span>
                                        </div>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (container.memory / container.memoryLimit) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Network & Ports */}
                             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Network</h3>
                                <div className="flex items-center gap-3 mb-2">
                                    <Network size={16} className="text-blue-400" />
                                    <span className="text-slate-300">Port Mapping:</span>
                                    <span className="font-mono bg-slate-900 px-2 py-1 rounded text-blue-300 text-xs">{container.port}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 text-center text-slate-500 text-xs font-bold">IP</div>
                                    <span className="text-slate-300">IP Address:</span>
                                    <span className="font-mono text-slate-400 text-sm">172.17.0.{Math.floor(Math.random() * 20) + 2} (Sim)</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">General Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                                        <span className="text-slate-500">Status</span>
                                        <span className={`font-bold ${container.status === 'RUNNING' ? 'text-emerald-400' : 'text-amber-400'}`}>{container.status}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                                        <span className="text-slate-500">Created At</span>
                                        <span className="text-slate-300">{new Date(container.created).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                                        <span className="text-slate-500">Uptime</span>
                                        <span className="text-slate-300">{container.uptime}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                                        <span className="text-slate-500">Platform</span>
                                        <span className="text-slate-300">linux/amd64</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-500">Restart Policy</span>
                                        <span className="text-slate-300 font-mono">{container.restartPolicy || 'no'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                     <div className="h-full flex flex-col">
                         <div className="flex-1 bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-y-auto border border-slate-800">
                            {container.logs.map((log, i) => (
                                <div key={i} className="mb-1 break-all hover:bg-slate-900/50 px-1 -mx-1 rounded">
                                    <span className="text-slate-600 mr-3 select-none">{i + 1}</span>
                                    {log}
                                </div>
                            ))}
                         </div>
                     </div>
                )}

                {activeTab === 'env' && (
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-800 text-slate-400 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Variable</th>
                                    <th className="px-6 py-3">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {Object.entries(container.envVars).map(([key, value]) => (
                                    <tr key={key} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-3 font-mono text-blue-300">{key}</td>
                                        <td className="px-6 py-3 font-mono text-slate-300 break-all">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {Object.keys(container.envVars).length === 0 && (
                            <div className="p-8 text-center text-slate-500 italic">No environment variables configured.</div>
                        )}
                    </div>
                )}

                {activeTab === 'volumes' && (
                     <div className="space-y-4">
                        {container.volumes.length === 0 ? (
                            <div className="p-12 text-center border border-dashed border-slate-700 rounded-xl text-slate-500">
                                <HardDrive className="mx-auto mb-2 opacity-50" size={32} />
                                <p>No volumes mounted</p>
                            </div>
                        ) : (
                            container.volumes.map((vol, idx) => (
                                <div key={idx} className="flex items-center p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg mr-4">
                                        <HardDrive size={20} />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase mb-1">Host Path</div>
                                            <div className="font-mono text-sm text-slate-300 break-all">{vol.hostPath}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase mb-1">Container Path</div>
                                            <div className="font-mono text-sm text-slate-300 break-all flex items-center justify-between">
                                                {vol.mountPath}
                                                <span className="ml-2 px-2 py-0.5 rounded bg-slate-700 text-xs text-slate-400 border border-slate-600 uppercase">{vol.mode}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                     </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto p-4">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <Settings size={20} className="text-blue-400" /> Resource Configuration
                            </h3>
                            <p className="text-slate-400 text-sm">Adjust the resource limits for this container. These settings control the maximum CPU and memory the container can consume.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">CPU Limit (%)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={cpuLimit}
                                                onChange={(e) => setCpuLimit(Number(e.target.value))}
                                                disabled={!isAdmin}
                                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">%</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Percentage of a single CPU core (e.g., 100 = 1 core).</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Memory Limit (MB)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={memoryLimit}
                                                onChange={(e) => setMemoryLimit(Number(e.target.value))}
                                                disabled={!isAdmin}
                                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">MB</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Maximum RAM allocation in Megabytes.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={handleSettingsSave}
                                    disabled={!isAdmin}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>

                            {!isAdmin && (
                                <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 text-sm">
                                    <AlertTriangle size={18} className="text-amber-500" />
                                    You must be an administrator to modify container resource limits.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        
                        {!isAdmin && (
                            <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-amber-200">
                                <AlertTriangle size={20} />
                                <p className="font-medium">Read Only Mode: You do not have permission to perform actions on this container.</p>
                            </div>
                        )}

                        {/* Status Banner */}
                        <div className={`mb-8 p-6 rounded-2xl border flex items-center justify-between ${
                            container.status === ContainerStatus.RUNNING 
                                ? 'bg-emerald-500/10 border-emerald-500/30' 
                                : container.status === ContainerStatus.STOPPED 
                                ? 'bg-slate-700/30 border-slate-600' 
                                : 'bg-rose-500/10 border-rose-500/30'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                                    container.status === ContainerStatus.RUNNING ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' :
                                    container.status === ContainerStatus.STOPPED ? 'bg-slate-600 text-slate-300' :
                                    'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                                }`}>
                                    <Power size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Current Status: {container.status}</h3>
                                    <p className="text-slate-400 text-sm">
                                        {container.status === 'RUNNING' ? 'The container is actively running.' : 'The container is currently halted.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Start Button */}
                            <button 
                                disabled={!isAdmin || container.status === ContainerStatus.RUNNING}
                                onClick={() => onAction(container.id, 'start')}
                                className="group relative p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl text-left"
                            >
                                <div className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 rounded-lg inline-block group-hover:scale-110 transition-transform">
                                    <Play size={24} className="fill-current" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">Start</h4>
                                <p className="text-xs text-slate-400">Resume container execution from stopped state.</p>
                            </button>

                            {/* Stop Button */}
                            <button 
                                disabled={!isAdmin || container.status !== ContainerStatus.RUNNING}
                                onClick={() => onAction(container.id, 'stop')}
                                className="group relative p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl text-left"
                            >
                                <div className="mb-4 p-3 bg-rose-500/10 text-rose-400 rounded-lg inline-block group-hover:scale-110 transition-transform">
                                    <Square size={24} className="fill-current" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">Stop</h4>
                                <p className="text-xs text-slate-400">Gracefully stop the running container process.</p>
                            </button>

                             {/* Restart Button */}
                             <button 
                                disabled={!isAdmin}
                                onClick={() => onAction(container.id, 'restart')}
                                className="group relative p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl text-left"
                            >
                                <div className="mb-4 p-3 bg-blue-500/10 text-blue-400 rounded-lg inline-block group-hover:scale-110 transition-transform">
                                    <RotateCw size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">Restart</h4>
                                <p className="text-xs text-slate-400">Stop and immediately start the container again.</p>
                            </button>

                             {/* Delete Button */}
                             <button 
                                disabled={!isAdmin || container.status === ContainerStatus.RUNNING}
                                onClick={() => onAction(container.id, 'delete')}
                                className="group relative p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-rose-900/10 hover:border-rose-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl text-left"
                            >
                                <div className="mb-4 p-3 bg-rose-500/10 text-rose-400 rounded-lg inline-block group-hover:scale-110 transition-transform">
                                    <Trash2 size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">Delete</h4>
                                <p className="text-xs text-slate-400">Permanently remove this container and its configuration.</p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
