import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Building2, 
  Users2, 
  Trash2, 
  Edit, 
  Globe, 
  Mail, 
  Phone, 
  ChevronDown,
  CheckSquare,
  Square
} from 'lucide-react';
import { Organization } from '../types';

interface OrganizationsViewProps {
  organizations: Organization[];
  onOpenCreate: () => void;
  onEditOrganization: (org: Organization) => void;
  onDeleteOrganization: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  setActiveTab: (tab: string) => void;
}

export const OrganizationsView: React.FC<OrganizationsViewProps> = ({
  organizations,
  onOpenCreate,
  onEditOrganization,
  onDeleteOrganization,
  onBulkDelete,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewFilter, setViewFilter] = useState('Primary');

  const filteredOrgs = organizations.filter(org => {
    if (searchQuery && !org.name.toLowerCase().includes(searchQuery.toLowerCase()) && !org.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredOrgs.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Type', 'Phone', 'Email', 'Owner', 'Website', 'Tags'];
    const rows = filteredOrgs.map(o => [o.id, o.name, o.type, o.phone, o.email, o.owner, o.website, o.tags.join(';')]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'organizations_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1A1A2E] text-slate-200 overflow-hidden">
      {/* Top Header & Tabs */}
      <div className="px-6 py-4 border-b border-[#2A2A48] flex flex-wrap items-center justify-between gap-4 bg-[#1E1E38]/50">
        <div className="flex items-center space-x-4">
          <div className="flex bg-[#16162B] p-1 rounded-xl border border-[#2A2A48]">
            <button
              onClick={() => setActiveTab('organizations')}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
            >
              Organizations
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('all-accounts')}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              All Accounts
            </button>
          </div>

          <select
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value)}
            className="bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-1.5 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Primary">Primary View</option>
            <option value="All">All Views</option>
            <option value="Customers">Customers Only</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => { onBulkDelete(selectedIds); setSelectedIds([]); }}
              className="px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-medium hover:bg-rose-600/30 transition-all flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="p-2 bg-[#2A2A48] hover:bg-[#323254] text-slate-300 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Organization</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-6 py-3 border-b border-[#2A2A48] flex items-center justify-between bg-[#1E1E38]/30">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizations by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-semibold">{filteredOrgs.length}</span> organizations
        </div>
      </div>

      {/* Organizations Table */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-[#1E1E38] border border-[#2A2A48] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#16162B] text-slate-400 uppercase text-[11px] font-semibold border-b border-[#2A2A48]">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredOrgs.length > 0 && selectedIds.length === filteredOrgs.length}
                    className="w-4 h-4 rounded border-[#323254] text-blue-600 bg-[#1A1A2E]"
                  />
                </th>
                <th className="py-3.5 px-6">Name & Type</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Owner</th>
                <th className="py-3.5 px-6">Website</th>
                <th className="py-3.5 px-6">Tags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A48]">
              {filteredOrgs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 text-sm">
                    No organizations found.
                  </td>
                </tr>
              ) : (
                filteredOrgs.map((org) => {
                  const isSelected = selectedIds.includes(org.id);
                  return (
                    <tr key={org.id} className="hover:bg-[#282846]/50 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(org.id)}
                          className="w-4 h-4 rounded border-[#323254] text-blue-600 bg-[#1A1A2E]"
                        />
                      </td>
                      <td className="py-4 px-6 font-medium text-white">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>{org.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal ml-6">
                          Type: {org.type} {org.repeatCustomer ? '• Repeat Customer' : ''}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{org.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300 text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{org.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs">{org.owner}</td>
                      <td className="py-4 px-6 text-xs">
                        <a href={org.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center space-x-1">
                          <Globe className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{org.website.replace('https://', '')}</span>
                        </a>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {org.tags.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-[#1A1A2E] border border-[#323254] text-slate-300 text-[10px] rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEditOrganization(org)}
                            className="p-1.5 hover:bg-[#2A2A48] rounded text-slate-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteOrganization(org.id)}
                            className="p-1.5 hover:bg-[#2A2A48] rounded text-slate-400 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400 px-2">
          <span>Page 1 of 1 (Total {filteredOrgs.length} records)</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-[#1E1E38] border border-[#2A2A48] rounded-lg text-slate-300 hover:bg-[#282846]" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-[#1E1E38] border border-[#2A2A48] rounded-lg text-slate-300 hover:bg-[#282846]" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
