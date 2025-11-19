
import React from 'react';
import { Container, ContainerStatus } from '../types';
import { Play, Square, RotateCw, Terminal, Clock, Hash, Layers, Network, HeartPulse, AlertTriangle, Hourglass, Activity, Trash2, Calendar } from 'lucide-react';

interface ContainerRowProps {
  container: Container;
  onAction: (id: string, action: 'start' | 'stop' | 'restart' | 'delete') => void;
  onViewLogs: (id: string) => void;
  onRowClick: (id: string) => void;
  isAdmin: boolean;
}

export const ContainerRow: React.FC<ContainerRowProps> = ({ container, onAction, onViewLogs, onRowClick, isAdmin }) => {
  const statusColor = {
    [ContainerStatus.RUNNING]: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    [ContainerStatus.STOPPED]: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    [ContainerStatus.ERROR]: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    [ContainerStatus.EXITED]: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };

  const statusDotClass = {
    [ContainerStatus.RUNNING]: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]",
    [ContainerStatus.STOPPED]: "bg-slate-500",
    [ContainerStatus.ERROR]: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]",
    [ContainerStatus.EXITED]: "bg-amber-500",
  };

  const renderHealthStatus = () => {
      switch(container.health) {
          case 'healthy':
              return (
                  <div className="flex items-center gap-1.5 text-emerald-400" title="Health: Healthy">
                      <HeartPulse size={16} className="animate-pulse" />
                      <span className="text-xs font-medium hidden sm:inline">Healthy</span>
                  </div>
              );
          case 'unhealthy':
               return (
                  <div className="flex items-center gap-1.5 text-rose-400" title="Health: Unhealthy">
                      <AlertTriangle size={16} />
                      <span className="text-xs font-medium hidden sm:inline">Unhealthy</span>
                  </div>
              );
          case 'starting':
              return (
                  <div className="flex items-center gap-1.5 text-amber-400" title="Health: Starting">
                      <Hourglass size={16} className="animate-spin-slow" />
                      <span className="text-xs font-medium hidden sm:inline">Starting</span>
                  </div>
              );
          default:
               return (
                  <div className="flex items-center gap-1.5 text-slate-600" title="Health: Unknown">
                      <Activity size={16} />
                      <span className="text-xs font-medium hidden sm:inline">-</span>
                  </div>
              );
      }
  };

  return (
    <div 
      onClick={() => onRowClick(container.id)}
      className="group flex flex-col bg-slate-800 border border-slate-700 rounded-lg mb-3 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      
      {/* Top Row: Main Info & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-800 relative z-10">
        
        {/* Info Section */}
        <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
          <div className={`h-3 w-3 rounded-full flex-shrink-0 transition-colors duration-300 ${statusDotClass[container.status]}`} />
          <div>
            <div className="flex items-center gap-3">
                <h4 className="font-bold text-slate-100 text-lg group-hover:text-blue-400 transition-colors">
                    {container.name}
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${statusColor[container.status]}`}>
                    {container.status}
                </span>

                {/* Quick Actions Next to Status (Admin Only) */}
                {isAdmin && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1" onClick={(e) => e.stopPropagation()}>
                        {container.status === ContainerStatus.RUNNING ? (
                            <button
                                onClick={() => onAction(container.id, 'stop')}
                                className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                                title="Quick Stop"
                            >
                                <Square size={14} className="fill-current" />
                            </button>
                        ) : (
                            <button
                                onClick={() => onAction(container.id, container.status === ContainerStatus.ERROR ? 'restart' : 'start')}
                                className={`p-1 text-slate-500 rounded transition-colors ${
                                    container.status === ContainerStatus.ERROR 
                                    ? 'hover:text-blue-400 hover:bg-blue-500/10' 
                                    : 'hover:text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                                title={container.status === ContainerStatus.ERROR ? "Quick Restart" : "Quick Start"}
                            >
                                {container.status === ContainerStatus.ERROR ? <RotateCw size={14} /> : <Play size={14} className="fill-current" />}
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-300">{container.image}</span>
              <span className="flex items-center gap-1"><Network size={10}/> {container.port}</span>
            </div>
          </div>
        </div>

        {/* Metrics & Health Section */}
        <div className="flex items-center gap-4 lg:gap-8 w-full sm:w-auto justify-between sm:justify-end">
            
          {/* Created Date Column (New) - Visible on Large Screens */}
          <div className="hidden xl:flex flex-col items-end border-r border-slate-700/50 pr-4 mr-4 min-w-[90px]">
             <div className="flex items-center gap-1 text-xs text-slate-500 font-medium uppercase mb-0.5">
                <Calendar size={10} /> Created
             </div>
             <div className="text-xs font-mono text-slate-300">
                 {new Date(container.created).toLocaleDateString()}
             </div>
          </div>

          {/* Health Column */}
          <div className="w-24 flex justify-center border-r border-slate-700/50 pr-4 mr-4 hidden lg:flex">
            {renderHealthStatus()}
          </div>
           <div className="lg:hidden">
            {renderHealthStatus()}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right cursor-help" title={`Used ${container.cpu.toFixed(1)}% of ${container.cpuLimit}% CPU limit`}>
              <div className="text-xs text-slate-400 font-medium">CPU</div>
              <div className="text-sm font-mono text-slate-200">{container.cpu.toFixed(1)}%</div>
            </div>
            <div className="text-right cursor-help" title={`Used ${container.memory}MB of ${container.memoryLimit}MB Memory limit`}>
              <div className="text-xs text-slate-400 font-medium">MEM</div>
              <div className="text-sm font-mono text-slate-200">{container.memory} MB</div>
            </div>
          </div>

          {/* Actions (Right Side) */}
          <div 
            className="flex items-center gap-2 border-l border-slate-700 pl-4 ml-4"
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
          >
              {isAdmin && (
                  <>
                      {container.status === ContainerStatus.RUNNING ? (
                          <button onClick={() => onAction(container.id, 'stop')} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Stop">
                              <Square size={18} className="fill-current" />
                          </button>
                      ) : (
                          <button onClick={() => onAction(container.id, 'start')} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Start">
                              <Play size={18} className="fill-current" />
                          </button>
                      )}
                      <button onClick={() => onAction(container.id, 'restart')} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Restart">
                          <RotateCw size={18} />
                      </button>
                      {container.status !== ContainerStatus.RUNNING && (
                         <button onClick={() => onAction(container.id, 'delete')} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                        </button>
                      )}
                  </>
              )}
              <button onClick={() => onViewLogs(container.id)} className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors" title="Logs & AI">
                  <Terminal size={18} />
              </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Expanded Details on Hover */}
      <div className="max-h-0 group-hover:max-h-40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out bg-slate-900/50 border-t border-slate-700/50 px-4 overflow-hidden">
          <div className="py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-4 text-xs">
              
              {/* Uptime */}
              <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} className="text-blue-400" />
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">Uptime</span>
                      <span className="text-slate-200 font-mono">{container.uptime}</span>
                  </div>
              </div>
              
              {/* Created - Full Date Time */}
              <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} className="text-emerald-400" />
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">Created</span>
                      <span className="text-slate-200 font-mono">{new Date(container.created).toLocaleString()}</span>
                  </div>
              </div>

              {/* Image */}
              <div className="flex items-center gap-2 text-slate-400">
                  <Layers size={14} className="text-purple-400" />
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">Image</span>
                      <span className="text-slate-200 font-mono truncate max-w-[120px]" title={container.image}>{container.image}</span>
                  </div>
              </div>

              {/* ID */}
              <div className="flex items-center gap-2 text-slate-400">
                  <Hash size={14} className="text-indigo-400" />
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">ID</span>
                      <span className="text-slate-200 font-mono" title={container.id}>{container.id.substring(0, 12)}</span>
                  </div>
              </div>

               {/* Ports */}
               <div className="flex items-center gap-2 text-slate-400">
                  <Network size={14} className="text-orange-400" />
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">Ports</span>
                      <span className="text-slate-200 font-mono truncate max-w-[100px]" title={container.port}>{container.port}</span>
                  </div>
              </div>

               {/* Restart Policy */}
               <div className="flex items-center gap-2 text-slate-400">
                  <RotateCw size={14} className="text-cyan-400" />
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">Restart</span>
                      <span className="text-slate-200 font-mono">{container.restartPolicy}</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
