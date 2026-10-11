import React, { useState } from 'react';
import { Plus, Search, Bell, Calendar as CalendarIcon, Trash2, RotateCcw, ChevronDown, Sparkles, Sun, Moon } from 'lucide-react';

interface TopbarProps {
  onOpenCreateModal?: (type: 'opportunity' | 'organization' | 'contact' | 'activity') => void;
  onOpenCreate?: (type: 'opportunity' | 'organization' | 'contact' | 'activity') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  hasDemoData: boolean;
  onToggleDemoData: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenCreateModal,
  onOpenCreate,
  searchQuery,
  setSearchQuery,
  hasDemoData,
  onToggleDemoData,
  isDarkMode,
  onToggleTheme,
}) => {
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const triggerCreate = onOpenCreate || onOpenCreateModal || (() => {});

  return (
    <header className="h-16 bg-[#1E1E38] border-b border-[#2A2A48] flex items-center justify-between px-6 text-white shrink-0 relative z-20 shadow-md">
      {/* Left: Logo & Title */}
      <div className="flex items-center space-x-6 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-base shadow-md">
            CP
          </div>
          <span className="font-bold text-lg tracking-wide text-white whitespace-nowrap">CRM Pro</span>
        </div>

        {/* Global Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, orgs, contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Middle: Date & Next Event info */}
      <div className="hidden xl:flex items-center space-x-3 bg-[#1A1A2E] border border-[#323254] px-4 py-1.5 rounded-lg text-xs text-slate-300">
        <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold text-white">October 11, 2026</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">Next:</span>
        <span className="text-amber-300 font-medium truncate max-w-[200px]">Final inspection @ 2:30 PM</span>
      </div>

      {/* Right: Actions, Theme Toggle, Demo Data Toggle, Notifications, Avatar */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-300 hover:text-white hover:bg-[#1A1A2E] rounded-lg transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Demo Data Toggle Button */}
        <button
          onClick={onToggleDemoData}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            hasDemoData
              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title={hasDemoData ? 'Delete / Reset Demo Data' : 'Restore Demo Data'}
        >
          {hasDemoData ? (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete demo data</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore demo data</span>
            </>
          )}
        </button>

        {/* Create Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {showCreateDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1E1E38] border border-[#2A2A48] rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase">Quick Actions</div>
              <button
                onClick={() => { triggerCreate('opportunity'); setShowCreateDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#282846] flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>New Opportunity</span>
              </button>
              <button
                onClick={() => { triggerCreate('organization'); setShowCreateDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#282846] flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>New Organization</span>
              </button>
              <button
                onClick={() => { triggerCreate('contact'); setShowCreateDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#282846] flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>New Contact</span>
              </button>
              <button
                onClick={() => { triggerCreate('activity'); setShowCreateDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#282846] flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>New Activity</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-[#1A1A2E] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="flex items-center space-x-3 pl-2 border-l border-[#2A2A48]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow">
            AM
          </div>
        </div>
      </div>
    </header>
  );
};
