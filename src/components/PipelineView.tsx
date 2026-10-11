import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  Kanban, 
  List, 
  Archive, 
  MoreVertical, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign,
  ChevronRight,
  User,
  Trash2,
  Edit
} from 'lucide-react';
import { Opportunity, OpportunityStage } from '../types';

interface PipelineViewProps {
  opportunities: Opportunity[];
  onOpenCreate: () => void;
  onEditOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
  onUpdateStage: (id: string, newStage: OpportunityStage) => void;
  onToggleArchive: (id: string) => void;
  onJumpToActivities?: (opportunityId: string, filterType: 'today' | 'overdue') => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  opportunities,
  onOpenCreate,
  onEditOpportunity,
  onDeleteOpportunity,
  onUpdateStage,
  onToggleArchive,
  onJumpToActivities,
}) => {
  const [subTab, setSubTab] = useState<'kanban' | 'active' | 'archived' | 'all'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedOwner, setSelectedOwner] = useState('All');
  const [defaultFilter, setDefaultFilter] = useState('All');
  const [activeChip, setActiveChip] = useState<'all' | 'today' | 'no_act' | 'overdue'>('all');
  const [pipelineName, setPipelineName] = useState('Main Sales Pipeline');

  // Drag and drop state
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);

  const stages: { key: OpportunityStage; label: string; headerColor: string; badgeColor: string; bgCol: string }[] = [
    { key: 'New', label: 'New', headerColor: 'bg-blue-50 text-blue-700 border-blue-200', badgeColor: 'bg-blue-100 text-blue-800', bgCol: 'bg-slate-50/50' },
    { key: 'Qualification', label: 'Qualification', headerColor: 'bg-purple-50 text-purple-700 border-purple-200', badgeColor: 'bg-purple-100 text-purple-800', bgCol: 'bg-slate-50/50' },
    { key: 'Proposal', label: 'Proposal', headerColor: 'bg-amber-50 text-amber-800 border-amber-200', badgeColor: 'bg-amber-100 text-amber-900', bgCol: 'bg-slate-50/50' },
    { key: 'Negotiation', label: 'Negotiation', headerColor: 'bg-pink-50 text-pink-700 border-pink-200', badgeColor: 'bg-pink-100 text-pink-800', bgCol: 'bg-slate-50/50' },
  ];

  const owners = Array.from(new Set(opportunities.map(o => o.owner)));
  const sources = Array.from(new Set(opportunities.map(o => o.source)));

  const filteredOpps = opportunities.filter(o => {
    if (subTab === 'active' && o.status !== 'active') return false;
    if (subTab === 'archived' && o.status !== 'archived') return false;
    if (subTab === 'kanban' && o.status === 'archived') return false;

    if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase()) && !o.organizationName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedSource !== 'All' && o.source !== selectedSource) {
      return false;
    }
    if (selectedStage !== 'All' && o.stage !== selectedStage) {
      return false;
    }
    if (selectedOwner !== 'All' && o.owner !== selectedOwner) {
      return false;
    }
    if (activeChip === 'today' && !o.hasTodayActivities) return false;
    if (activeChip === 'overdue' && !o.hasOverdueActivities) return false;
    if (activeChip === 'no_act' && (o.hasTodayActivities || o.hasOverdueActivities)) return false;

    return true;
  });

  const todayCount = opportunities.filter(o => o.hasTodayActivities && o.status !== 'archived').length;
  const overdueCount = opportunities.filter(o => o.hasOverdueActivities && o.status !== 'archived').length;
  const noActCount = opportunities.filter(o => !o.hasTodayActivities && !o.hasOverdueActivities && o.status !== 'archived').length;

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedOppId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: OpportunityStage) => {
    e.preventDefault();
    if (draggedOppId) {
      onUpdateStage(draggedOppId, targetStage);
      setDraggedOppId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] text-slate-800 overflow-hidden">
      {/* Top Header Bar for Pipeline */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <select
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="Main Sales Pipeline">Sales Pipeline: Main Pipeline</option>
            <option value="Enterprise Pipeline">Sales Pipeline: Enterprise B2B</option>
          </select>

          {/* Sub Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSubTab('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subTab === 'kanban' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setSubTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subTab === 'active' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setSubTab('archived')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subTab === 'archived' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Archived
            </button>
            <button
              onClick={() => setSubTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subTab === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Opportunities
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center space-x-2 shadow-md shadow-blue-600/20 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>
          <div className="flex items-center space-x-1 border-l border-slate-200 pl-3 text-slate-500">
            <button className="p-2 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar & Chips */}
      <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search opportunity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-44"
            />
          </div>

          {/* Default Filter */}
          <select
            value={defaultFilter}
            onChange={(e) => setDefaultFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">Default: All</option>
            <option value="High">High Value (&gt;$20k)</option>
            <option value="Recent">Recent (Last 7 Days)</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">Source: All</option>
            {sources.map(src => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">Stage: All</option>
            <option value="New">New</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
          </select>

          {/* Owner Filter */}
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="All">Owner: All</option>
            {owners.map(own => (
              <option key={own} value={own}>{own}</option>
            ))}
          </select>
        </div>

        {/* Clickable Filter Chips */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveChip(activeChip === 'today' ? 'all' : 'today')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeChip === 'today' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3 h-3 text-blue-500 shrink-0" />
            <span>Today's Activities</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeChip === 'today' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700'}`}>
              {todayCount}
            </span>
          </button>

          <button
            onClick={() => setActiveChip(activeChip === 'overdue' ? 'all' : 'overdue')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeChip === 'overdue' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
            <span>Overdue</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeChip === 'overdue' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-700'}`}>
              {overdueCount}
            </span>
          </button>

          <button
            onClick={() => setActiveChip(activeChip === 'no_act' ? 'all' : 'no_act')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeChip === 'no_act' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>No Activities</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeChip === 'no_act' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-700'}`}>
              {noActCount}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-x-auto overflow-y-auto">
        {subTab === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-[1050px] h-full items-start">
            {stages.map((stage) => {
              const stageOpps = filteredOpps.filter(o => o.stage === stage.key);
              const totalAmount = stageOpps.reduce((sum, o) => sum + o.amount, 0);

              return (
                <div 
                  key={stage.key}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.key)}
                  className={`bg-slate-100 border border-slate-200 rounded-2xl flex flex-col h-full max-h-[calc(100vh-220px)] shadow-sm`}
                >
                  {/* Column Header */}
                  <div className={`p-3.5 border-b border-slate-200 flex items-center justify-between rounded-t-2xl font-semibold text-sm ${stage.headerColor}`}>
                    <div className="flex items-center space-x-2">
                      <span>{stage.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stage.badgeColor}`}>
                        {stageOpps.length}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {stageOpps.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs italic border-2 border-dashed border-slate-200 rounded-xl">
                        Drop items here or create opportunity
                      </div>
                    ) : (
                      stageOpps.map((opp) => (
                        <div
                          key={opp.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, opp.id)}
                          className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-sm transition-all group relative cursor-grab active:cursor-grabbing"
                        >
                          {/* Card Top */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 
                              onClick={() => onEditOpportunity(opp)}
                              className="font-bold text-sm text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-2"
                            >
                              {opp.name}
                            </h4>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditOpportunity(opp)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteOpportunity(opp.id)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {opp.tags.map((tag, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Organization & Contact */}
                          <div className="text-xs text-slate-600 space-y-0.5 mb-3">
                            <p className="truncate font-semibold text-slate-800">{opp.organizationName}</p>
                            <p className="truncate text-slate-500">{opp.contactName}</p>
                          </div>

                          {/* Start Date > End Date */}
                          <div className="text-[11px] text-slate-500 mb-3 flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-medium text-slate-700">{opp.startDate} &gt; {opp.endDate}</span>
                          </div>

                          {/* Amount & Owner */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs mb-2">
                            <span className="font-extrabold text-emerald-600 text-sm">
                              ${opp.amount.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-1.5" title={`Owner: ${opp.owner}`}>
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                                {opp.owner.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                          </div>

                          {/* Activity Links (Overdue / Today's) - Single Line & Equal Gap */}
                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold whitespace-nowrap gap-2">
                            <button
                              onClick={() => onJumpToActivities?.(opp.id, 'overdue')}
                              className="text-rose-600 hover:underline flex items-center space-x-1 shrink-0"
                            >
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>Overdue Activities</span>
                            </button>
                            <button
                              onClick={() => onJumpToActivities?.(opp.id, 'today')}
                              className="text-blue-600 hover:underline flex items-center space-x-1 shrink-0"
                            >
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>Today's Activities</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View for Active, Archived, or All */
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Opportunity Name</th>
                  <th className="py-3.5 px-6">Organization</th>
                  <th className="py-3.5 px-6">Contact</th>
                  <th className="py-3.5 px-6">Stage</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Owner</th>
                  <th className="py-3.5 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOpps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                      No opportunities found.
                    </td>
                  </tr>
                ) : (
                  filteredOpps.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {opp.name}
                        <div className="flex gap-1 mt-1 font-normal">
                          {opp.tags.map((t, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">{opp.organizationName}</td>
                      <td className="py-4 px-6">{opp.contactName}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {opp.stage}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-600">${opp.amount.toLocaleString()}</td>
                      <td className="py-4 px-6">{opp.owner}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditOpportunity(opp)}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onToggleArchive(opp.id)}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-amber-600"
                            title={opp.status === 'archived' ? 'Restore' : 'Archive'}
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteOpportunity(opp.id)}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
