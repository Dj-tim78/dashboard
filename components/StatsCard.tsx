import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-500/10",
    green: "text-emerald-400 bg-emerald-500/10",
    red: "text-rose-400 bg-rose-500/10",
    purple: "text-purple-400 bg-purple-500/10",
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};