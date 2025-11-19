
import React, { useState, useEffect } from 'react';
import { DockerImage, Container, ContainerStatus, RestartPolicy } from '../types';
import { X, Plus, Trash2, Box, Layers, Network, List, HardDrive, Rocket, AlertTriangle, RefreshCcw, CheckCircle, ArrowLeft, Cpu, Activity } from 'lucide-react';

interface CreateContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (containerData: Partial<Container>) => void;
  availableImages: DockerImage[];
  existingContainerNames: string[];
}

interface EnvVarRow {
  key: string;
  value: string;
}

interface VolumeRow {
  hostPath: string;
  mountPath: string;
}

export const CreateContainerModal: React.FC<CreateContainerModalProps> = ({ isOpen, onClose, onSubmit, availableImages, existingContainerNames }) => {
  const [step, setStep] = useState<'form' | 'review'>('form');
  
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [port, setPort] = useState('');
  const [cpuLimit, setCpuLimit] = useState(50); // Default limit
  const [memoryLimit, setMemoryLimit] = useState(512); // Default limit
  const [restartPolicy, setRestartPolicy] = useState<RestartPolicy>('no');
  const [error, setError] = useState<string | null>(null);
  
  const [envVars, setEnvVars] = useState<EnvVarRow[]>([{ key: '', value: '' }]);
  const [volumes, setVolumes] = useState<VolumeRow[]>([{ hostPath: '', mountPath: '' }]);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setName('');
      setImage('');
      setPort('');
      setCpuLimit(50);
      setMemoryLimit(512);
      setRestartPolicy('no');
      setEnvVars([{ key: '', value: '' }]);
      setVolumes([{ hostPath: '', mountPath: '' }]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddEnv = () => setEnvVars([...envVars, { key: '', value: '' }]);
  const handleRemoveEnv = (index: number) => setEnvVars(envVars.filter((_, i) => i !== index));
  const handleEnvChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEnv = [...envVars];
    newEnv[index][field] = value;
    setEnvVars(newEnv);
  };

  const handleAddVolume = () => setVolumes([...volumes, { hostPath: '', mountPath: '' }]);
  const handleRemoveVolume = (index: number) => setVolumes(volumes.filter((_, i) => i !== index));
  const handleVolumeChange = (index: number, field: 'hostPath' | 'mountPath', value: string) => {
    const newVols = [...volumes];
    newVols[index][field] = value;
    setVolumes(newVols);
  };

  // Validate and move to review step
  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation Logic
    const nameRegex = /^[a-zA-Z0-9-]+$/;
    if (!nameRegex.test(name)) {
        setError('Container name can only contain alphanumeric characters (a-z, 0-9) and hyphens (-).');
        return;
    }

    if (existingContainerNames.includes(name)) {
        setError(`A container with the name "${name}" already exists. Please choose a unique name.`);
        return;
    }

    if (!image) {
        setError('Please select or enter a valid container image.');
        return;
    }
    
    setStep('review');
  };

  // Final submission
  const handleFinalSubmit = () => {
    // Convert Env Vars array to Record
    const envRecord: Record<string, string> = {};
    envVars.forEach(row => {
      if (row.key) envRecord[row.key] = row.value;
    });

    // Filter empty volumes and format
    const formattedVolumes = volumes
      .filter(v => v.hostPath && v.mountPath)
      .map(v => ({ ...v, mode: 'rw' }));

    const newContainer: Partial<Container> = {
      name: name,
      image: image || 'unknown',
      port: port || '-',
      envVars: envRecord,
      volumes: formattedVolumes,
      cpu: 0.1, // Starting CPU Usage
      cpuLimit: cpuLimit, // Set CPU Limit
      memory: 20, // Starting Mem Usage
      memoryLimit: memoryLimit, // Set Mem Limit
      status: ContainerStatus.RUNNING,
      restartPolicy: restartPolicy
    };

    onSubmit(newContainer);
    onClose();
  };

  const renderReviewStep = () => {
    const validEnvCount = envVars.filter(e => e.key).length;
    const validVolCount = volumes.filter(v => v.hostPath && v.mountPath).length;

    return (
      <div className="space-y-6 animate-fade-in">
         <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
            <div>
                <h4 className="text-sm font-bold text-blue-300">Review Configuration</h4>
                <p className="text-xs text-blue-200/70 mt-1">Please review the details below before confirming deployment. This action will start the container immediately.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Core Info */}
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Core Details</h5>
                <div className="space-y-3">
                    <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Name</span>
                        <span className="text-sm font-bold text-white">{name}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Image</span>
                        <span className="text-sm font-mono text-slate-300 break-all">{image}</span>
                    </div>
                     <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Restart Policy</span>
                        <span className="text-sm text-slate-300">{restartPolicy}</span>
                    </div>
                </div>
             </div>

             {/* Network & Resources */}
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Resources & Network</h5>
                <div className="space-y-3">
                    <div>
                        <span className="block text-[10px] text-slate-500 uppercase">Port Mapping</span>
                        <span className="text-sm font-mono text-slate-300">{port || 'No ports exposed'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                             <span className="block text-[10px] text-slate-500 uppercase flex items-center gap-1"><Cpu size={10}/> CPU Limit</span>
                             <span className="text-sm font-mono text-slate-300">{cpuLimit}%</span>
                        </div>
                        <div>
                             <span className="block text-[10px] text-slate-500 uppercase flex items-center gap-1"><Activity size={10}/> Mem Limit</span>
                             <span className="text-sm font-mono text-slate-300">{memoryLimit} MB</span>
                        </div>
                    </div>
                </div>
             </div>
        </div>

        {/* Config Summary */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
            <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase">Environment Variables</h5>
                <span className="text-sm text-slate-300">{validEnvCount} variables configured</span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="text-right">
                <h5 className="text-xs font-bold text-slate-500 uppercase">Volume Mounts</h5>
                <span className="text-sm text-slate-300">{validVolCount} volumes mounted</span>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Box size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{step === 'review' ? 'Confirm Deployment' : 'Deploy New Container'}</h2>
              <p className="text-xs text-slate-400">{step === 'review' ? 'Review configuration details' : 'Configure your container instance'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'form' ? (
            <form id="create-container-form" onSubmit={handleReview} className="space-y-8">
            
            {/* Error Display */}
            {error && (
                <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 flex items-start gap-3 animate-shake">
                    <AlertTriangle className="text-rose-500 shrink-0" size={20} />
                    <div>
                        <h4 className="text-sm font-bold text-rose-400">Validation Error</h4>
                        <p className="text-sm text-rose-200 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* General Info */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Layers size={14} /> General Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Container Name</label>
                    <input 
                    type="text" 
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="e.g., my-web-server"
                    className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-slate-200 focus:ring-2 outline-none ${error && (existingContainerNames.includes(name) || !/^[a-zA-Z0-9-]*$/.test(name)) ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-blue-500'}`}
                    required
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Only alphanumeric chars and hyphens allowed.</p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Image</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            list="images-list"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="e.g., nginx:latest"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <datalist id="images-list">
                            {availableImages.map(img => (
                                <option key={img.id} value={`${img.repository}:${img.tag}`} />
                            ))}
                        </datalist>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Restart Policy</label>
                    <div className="relative">
                        <RefreshCcw className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <select 
                            value={restartPolicy}
                            onChange={(e) => setRestartPolicy(e.target.value as RestartPolicy)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        >
                            <option value="no">No (Do not restart automatically)</option>
                            <option value="on-failure">On Failure (Restart if exits with non-zero code)</option>
                            <option value="always">Always (Always restart)</option>
                            <option value="unless-stopped">Unless Stopped (Restart unless manually stopped)</option>
                        </select>
                    </div>
                </div>
                </div>
            </section>

            {/* Network & Resources */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Network size={14} /> Network & Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Port Mapping</label>
                    <input 
                    type="text" 
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="8080:80"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">CPU Limit (%)</label>
                    <input 
                    type="number" 
                    value={cpuLimit}
                    onChange={(e) => setCpuLimit(Number(e.target.value))}
                    min="1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Memory Limit (MB)</label>
                    <input 
                    type="number" 
                    value={memoryLimit}
                    onChange={(e) => setMemoryLimit(Number(e.target.value))}
                    min="4"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                </div>
            </section>

            {/* Environment Variables */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                        <List size={14} /> Environment Variables
                    </h3>
                    <button type="button" onClick={handleAddEnv} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300">
                        <Plus size={12} /> Add Variable
                    </button>
                </div>
                <div className="space-y-2">
                    {envVars.map((row, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input 
                                type="text" 
                                placeholder="KEY" 
                                value={row.key}
                                onChange={(e) => handleEnvChange(idx, 'key', e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                            />
                            <span className="text-slate-500">=</span>
                            <input 
                                type="text" 
                                placeholder="VALUE" 
                                value={row.value}
                                onChange={(e) => handleEnvChange(idx, 'value', e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                            />
                            <button type="button" onClick={() => handleRemoveEnv(idx)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Volumes */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                        <HardDrive size={14} /> Volumes
                    </h3>
                    <button type="button" onClick={handleAddVolume} className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300">
                        <Plus size={12} /> Add Volume
                    </button>
                </div>
                <div className="space-y-2">
                    {volumes.map((row, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input 
                                type="text" 
                                placeholder="Host Path (e.g. /data)" 
                                value={row.hostPath}
                                onChange={(e) => handleVolumeChange(idx, 'hostPath', e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                            />
                            <span className="text-slate-500">:</span>
                            <input 
                                type="text" 
                                placeholder="Container Path (e.g. /app/data)" 
                                value={row.mountPath}
                                onChange={(e) => handleVolumeChange(idx, 'mountPath', e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                            />
                            <button type="button" onClick={() => handleRemoveVolume(idx)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            </form>
          ) : (
            renderReviewStep()
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
            {step === 'form' ? (
                <>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors font-medium">
                        Cancel
                    </button>
                    <button 
                        onClick={handleReview} 
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
                    >
                        Review & Deploy
                    </button>
                </>
            ) : (
                <>
                    <button 
                        onClick={() => setStep('form')} 
                        className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Edit
                    </button>
                    <button 
                        onClick={handleFinalSubmit} 
                        className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
                    >
                        <Rocket size={18} /> Confirm & Deploy
                    </button>
                </>
            )}
        </div>

      </div>
    </div>
  );
};
