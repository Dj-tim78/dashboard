
import React, { useState } from 'react';
import { DockerVolume } from '../types';
import { Search, Trash2, HardDrive, Database, FolderOpen } from 'lucide-react';

interface VolumeListProps {
  volumes: DockerVolume[];
  onDelete: (name: string) => void;
}

export const VolumeList: React.FC<VolumeListProps> = ({ volumes, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVolumes = volumes.filter(vol => 
    vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vol.mountpoint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HardDrive className="text-emerald-400" /> Local Volumes
        </h2>
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search volumes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-600"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredVolumes.map(vol => (
            <div key={vol.name} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between hover:border-slate-600 transition-all">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                        <FolderOpen size={24} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-lg truncate max-w-[200px]">{vol.name}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-md font-bold uppercase ${vol.status === 'in-use' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                                {vol.status}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-1 truncate max-w-[300px]" title={vol.mountpoint}>
                            {vol.mountpoint}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500 uppercase font-bold">Driver</span>
                        <span className="text-slate-300 font-mono">{vol.driver}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500 uppercase font-bold">Created</span>
                        <span className="text-slate-300">{vol.created}</span>
                    </div>
                    <button 
                        onClick={() => onDelete(vol.name)}
                        disabled={vol.status === 'in-use'}
                        className={`p-2 rounded-lg transition-colors ${
                            vol.status === 'in-use' 
                            ? 'text-slate-700 cursor-not-allowed' 
                            : 'text-slate-500 hover:text-rose-400 hover:bg-rose-400/10'
                        }`}
                        title={vol.status === 'in-use' ? 'Cannot delete volume in use' : 'Delete Volume'}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
        
        {filteredVolumes.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                No volumes found matching your search.
            </div>
        )}
      </div>
    </div>
  );
};
