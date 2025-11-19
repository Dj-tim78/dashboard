
import React, { useState, useEffect } from 'react';
import { X, DownloadCloud, Loader2, Layers, Tag, Globe } from 'lucide-react';

interface PullImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (imageName: string) => void;
}

export const PullImageModal: React.FC<PullImageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [registry, setRegistry] = useState('Docker Hub');
  const [repository, setRepository] = useState('');
  const [tag, setTag] = useState('latest');
  const [isPulling, setIsPulling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRegistry('Docker Hub');
      setRepository('');
      setTag('latest');
      setIsPulling(false);
      setProgress(0);
      setStatusText('');
    }
  }, [isOpen]);

  const handlePull = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repository) return;

    setIsPulling(true);
    setStatusText(`Connecting to ${registry}...`);

    // Simulate pull process with steps
    const steps = [
        { pct: 10, msg: 'Authenticating...' },
        { pct: 25, msg: `Requesting manifest from ${registry}...` },
        { pct: 45, msg: 'Downloading layers...' },
        { pct: 70, msg: 'Extracting content...' },
        { pct: 90, msg: 'Verifying checksums...' },
        { pct: 100, msg: 'Pull complete' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);
            setTimeout(() => {
                const fullImageName = `${repository}:${tag}`;
                onConfirm(fullImageName);
                onClose();
            }, 600);
            return;
        }

        const step = steps[currentStep];
        setProgress(step.pct);
        setStatusText(step.msg);
        currentStep++;

    }, 500); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <DownloadCloud size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pull Image</h2>
              <p className="text-xs text-slate-400">Download from container registry</p>
            </div>
          </div>
          {!isPulling && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} />
              </button>
          )}
        </div>

        <div className="p-6">
            {!isPulling ? (
                <form onSubmit={handlePull} className="space-y-5">
                    
                    {/* Registry Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Registry</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <select 
                                value={registry}
                                onChange={(e) => setRegistry(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm"
                            >
                                <option>Docker Hub</option>
                                <option>GitHub Container Registry (ghcr.io)</option>
                                <option>AWS ECR</option>
                                <option>Quay.io</option>
                                <option>Google Artifact Registry</option>
                            </select>
                        </div>
                    </div>

                    {/* Repository Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Repository / Image Name</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text" 
                                value={repository}
                                onChange={(e) => setRepository(e.target.value)}
                                placeholder="e.g. nginx, redis, library/postgres"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    {/* Tag Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tag</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text" 
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                placeholder="latest"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium text-sm">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 text-sm">
                            <DownloadCloud size={16} /> Pull Image
                        </button>
                    </div>
                </form>
            ) : (
                <div className="py-6 space-y-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
                            <Loader2 className="relative animate-spin text-blue-500" size={48} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Pulling {repository}:{tag}</h3>
                            <p className="text-sm text-slate-400 font-mono mt-2 flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {statusText}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500 font-medium uppercase">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
