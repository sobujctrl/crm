import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  BookOpen, 
  Users, 
  MoreHorizontal, 
  Kanban, 
  Calendar, 
  Building2, 
  Users2, 
  Layers, 
  FileText, 
  BarChart3, 
  Zap, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (mod: string) => void;
  activeCrmTab: string;
  setActiveCrmTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  activeCrmTab,
  setActiveCrmTab,
}) => {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard, badge: '' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '5' },
    { id: 'crm', label: 'CRM', icon: FolderKanban, active: true },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'team', label: 'My Team', icon: Users },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  const crmSubItems = [
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Users2 },
    { id: 'all-accounts', label: 'All Accounts', icon: Layers },
    { id: 'web-forms', label: 'Web forms', icon: FileText },
  ];

  const crmBottomItems = [
    { id: 'report', label: 'Report', icon: BarChart3 },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#1E1E38] text-slate-300 select-none shrink-0">
      {/* Main Left Navigation Bar */}
      <div className="w-16 bg-[#16162B] flex flex-col items-center py-4 border-r border-[#2A2A48]">
        {/* App Mini Logo */}
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg mb-6 cursor-pointer" title="CRM Pro">
          CP
        </div>

        <div className="flex flex-col space-y-3 w-full px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-[#23233F]'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium tracking-tight truncate max-w-[56px] px-0.5">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CRM Sub-menu Panel */}
      {activeModule === 'crm' && (
        <div className="w-60 bg-[#1E1E38] flex flex-col border-r border-[#2A2A48] py-4 px-3">
          <div className="px-3 mb-4 flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm tracking-wide">CRM Module</h2>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">Pro</span>
          </div>

          <div className="space-y-1 flex-1">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Sales & Management
            </div>
            {crmSubItems.map((sub) => {
              const Icon = sub.icon;
              const isActive = activeCrmTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveCrmTab(sub.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-300 hover:bg-[#282846] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{sub.label}</span>
                </button>
              );
            })}

            <div className="pt-6">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                Tools & Config
              </div>
              {crmBottomItems.map((sub) => {
                const Icon = sub.icon;
                const isActive = activeCrmTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveCrmTab(sub.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-[#282846] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User profile mini footer in sidebar */}
          <div className="pt-4 border-t border-[#2A2A48] flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
              AM
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">Alex Morgan</p>
              <p className="text-[10px] text-slate-400 truncate">alex@crmpro.io</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
