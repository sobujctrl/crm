import React, { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  Circle, 
  ListFilter, 
  MapPin, 
  User, 
  Briefcase,
  Trash2,
  Edit
} from 'lucide-react';
import { Activity } from '../types';

interface ActivitiesViewProps {
  activities: Activity[];
  onOpenCreate: () => void;
  onToggleComplete: (id: string) => void;
  onDeleteActivity: (id: string) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  onOpenCreate,
  onToggleComplete,
  onDeleteActivity,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'month' | 'week' | 'day'>('list');
  const [calendarFilter, setCalendarFilter] = useState<{ company: boolean; sales: boolean; personal: boolean }>({
    company: true,
    sales: true,
    personal: true
  });

  const filteredActivities = activities.filter(act => {
    if (act.calendar === 'Company Calendar' && !calendarFilter.company) return false;
    if (act.calendar === 'Sales Team' && !calendarFilter.sales) return false;
    if (act.calendar === 'Personal' && !calendarFilter.personal) return false;
    return true;
  });

  // Group by date for list view
  const groupedByDate: Record<string, Activity[]> = {};
  filteredActivities.forEach(act => {
    if (!groupedByDate[act.date]) {
      groupedByDate[act.date] = [];
    }
    groupedByDate[act.date].push(act);
  });

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="flex-1 flex flex-col bg-[#1A1A2E] text-slate-200 overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-[#2A2A48] flex flex-wrap items-center justify-between gap-4 bg-[#1E1E38]/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="p-1.5 bg-[#2A2A48] hover:bg-[#323254] rounded-lg text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white text-sm">October 2026</span>
            <button className="p-1.5 bg-[#2A2A48] hover:bg-[#323254] rounded-lg text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 bg-[#2A2A48] hover:bg-[#323254] rounded-lg text-xs font-medium text-slate-200">
              Today
            </button>
          </div>

          <div className="flex bg-[#16162B] p-1 rounded-xl border border-[#2A2A48]">
            {(['month', 'week', 'day', 'list'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  viewMode === m ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-md shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Activity</span>
        </button>
      </div>

      {/* Main Body with Mini Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Mini Calendar & Filters */}
        <div className="w-72 bg-[#1E1E38]/40 border-r border-[#2A2A48] p-5 hidden lg:flex flex-col space-y-6 overflow-y-auto">
          {/* Mini Calendar Widget */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">October 2026</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400 mb-1">
              <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isToday = day === 11;
                return (
                  <div
                    key={day}
                    className={`py-1.5 rounded-lg font-medium transition-colors ${
                      isToday
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-[#2A2A48]'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Calendars */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">My Calendars</h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={calendarFilter.company}
                  onChange={(e) => setCalendarFilter({ ...calendarFilter, company: e.target.checked })}
                  className="w-4 h-4 rounded border-[#323254] text-blue-600 bg-[#1A1A2E]"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Company Calendar</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={calendarFilter.sales}
                  onChange={(e) => setCalendarFilter({ ...calendarFilter, sales: e.target.checked })}
                  className="w-4 h-4 rounded border-[#323254] text-blue-600 bg-[#1A1A2E]"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-slate-300">Sales Team</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={calendarFilter.personal}
                  onChange={(e) => setCalendarFilter({ ...calendarFilter, personal: e.target.checked })}
                  className="w-4 h-4 rounded border-[#323254] text-blue-600 bg-[#1A1A2E]"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">Personal</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Activities Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {viewMode === 'list' ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {sortedDates.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  No activities found.
                </div>
              ) : (
                sortedDates.map((dateStr) => {
                  const dayActs = groupedByDate[dateStr];
                  return (
                    <div key={dateStr} className="bg-[#1E1E38] border border-[#2A2A48] rounded-2xl overflow-hidden shadow-lg">
                      {/* Date Header */}
                      <div className="bg-[#16162B] px-6 py-3 border-b border-[#2A2A48] flex items-center justify-between">
                        <span className="font-bold text-white text-xs uppercase tracking-wider">
                          {dateStr} {dateStr === '2026-10-11' ? '• Today' : ''}
                        </span>
                        <span className="text-xs text-slate-400">{dayActs.length} events</span>
                      </div>

                      {/* Activities List */}
                      <div className="divide-y divide-[#2A2A48]">
                        {dayActs.map((act) => (
                          <div 
                            key={act.id} 
                            className={`px-6 py-4 flex items-center justify-between transition-colors hover:bg-[#282846]/40 ${
                              act.completed ? 'opacity-60 bg-[#16162B]/30' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <button
                                onClick={() => onToggleComplete(act.id)}
                                className="mt-0.5 text-slate-400 hover:text-blue-500 transition-colors"
                              >
                                {act.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-500" />
                                )}
                              </button>

                              <div>
                                <h4 className={`font-semibold text-sm text-white ${act.completed ? 'line-through text-slate-400' : ''}`}>
                                  {act.title}
                                </h4>
                                <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                                    <span>{act.time}</span>
                                  </span>
                                  <span>•</span>
                                  <span className="px-2 py-0.5 rounded bg-[#2A2A48] text-slate-300 text-[10px]">
                                    {act.calendar}
                                  </span>
                                  {act.opportunityName && (
                                    <>
                                      <span>•</span>
                                      <span className="text-blue-400 font-medium">{act.opportunityName}</span>
                                    </>
                                  )}
                                </div>
                                {act.description && (
                                  <p className="text-xs text-slate-400 mt-1.5">{act.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                act.type === 'Meeting' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                act.type === 'Call' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                act.type === 'Delivery' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {act.type}
                              </span>
                              <button
                                onClick={() => onDeleteActivity(act.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-[#2A2A48] transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Month / Week / Day grid mock */
            <div className="bg-[#1E1E38] border border-[#2A2A48] rounded-2xl p-6 h-full flex flex-col justify-center items-center text-center shadow-xl">
              <CalendarIcon className="w-16 h-16 text-blue-500 mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white mb-2 capitalize">{viewMode} Calendar View</h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                Showing interactive calendar grid for {viewMode} view. Switch to List view for detailed event management and completion tracking.
              </p>
              <button
                onClick={() => setViewMode('list')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-600/30 transition-all"
              >
                Back to List View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
