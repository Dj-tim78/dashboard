
import React, { useState } from 'react';
import { DockerImage } from '../types';
import { Search, Trash2, Tag, Database, Layers, Calendar, DownloadCloud } from 'lucide-react';

interface ImageListProps {
  images: DockerImage[];
  onDelete: (id: string) => void;
  onPullClick: () => void;
}

export const ImageList: React.FC<ImageListProps> = ({ images, onDelete, onPullClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredImages = images.filter(img => 
    img.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 whitespace-nowrap">
                <Layers className="text-blue-400" /> Local Images
            </h2>
            <button 
                onClick={onPullClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30"
            >
                <DownloadCloud size={16} />
                <span>Pull Image</span>
            </button>
        </div>

        <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search images..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-600"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredImages.map(img => (
            <div key={img.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between hover:border-slate-600 transition-all group">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-12 w-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                        <Database size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-lg">{img.repository}</h3>
                            <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-md font-mono flex items-center gap-1">
                                <Tag size={10} /> {img.tag}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-1">{img.id}</div>
                    </div>
                </div>

                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500 uppercase font-bold">Size</span>
                        <span className="text-slate-300 font-mono">{img.size}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1"><Calendar size={10}/> Created</span>
                        <span className="text-slate-300">{img.created}</span>
                    </div>
                    <button 
                        onClick={() => onDelete(img.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        title="Delete Image"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
        
        {filteredImages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <Layers className="text-slate-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-300 mb-2">No Images Found</h3>
                <p className="text-sm text-slate-500 mb-6">
                    {searchQuery ? 'Try adjusting your search criteria' : 'Get started by pulling your first container image'}
                </p>
                <button 
                    onClick={onPullClick}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
                >
                    <DownloadCloud size={18} />
                    <span>Pull New Image</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
