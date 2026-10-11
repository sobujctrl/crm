import React, { useState } from 'react';
import { Building2, Users2, Search, Check, X } from 'lucide-react';
import { Organization, Contact } from '../types';

interface AllAccountsViewProps {
  organizations: Organization[];
  contacts: Contact[];
  setActiveTab: (tab: string) => void;
}

export const AllAccountsView: React.FC<AllAccountsViewProps> = ({
  organizations,
  contacts,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine organizations and contacts into a unified list
  const combined = [
    ...organizations.map(o => ({
      id: o.id,
      type: 'organization' as const,
      icon: Building2,
      name: o.name,
      phone: o.phone,
      email: o.email,
      owner: o.owner,
      tags: o.tags,
      repeatCustomer: o.repeatCustomer,
      category: o.type
    })),
    ...contacts.map(c => ({
      id: c.id,
      type: 'contact' as const,
      icon: Users2,
      name: c.name,
      phone: c.phone,
      email: c.email,
      owner: c.owner,
      tags: c.tags,
      repeatCustomer: c.repeatCustomer,
      category: c.type
    }))
  ].filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#1A1A2E] text-slate-200 overflow-hidden">
      {/* Top Header & Tabs */}
      <div className="px-6 py-4 border-b border-[#2A2A48] flex flex-wrap items-center justify-between gap-4 bg-[#1E1E38]/50">
        <div className="flex items-center space-x-4">
          <div className="flex bg-[#16162B] p-1 rounded-xl border border-[#2A2A48]">
            <button
              onClick={() => setActiveTab('organizations')}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
            >
              All Accounts
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-6 py-3 border-b border-[#2A2A48] flex items-center justify-between bg-[#1E1E38]/30">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search all organizations & contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Total Combined Records: <span className="text-white font-semibold">{combined.length}</span>
        </div>
      </div>

      {/* Table with Horizontal Scroll */}
      <div className="flex-1 p-6 overflow-x-auto overflow-y-auto">
        <div className="bg-[#1E1E38] border border-[#2A2A48] rounded-2xl overflow-hidden shadow-xl min-w-[900px]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#16162B] text-slate-400 uppercase text-[11px] font-semibold border-b border-[#2A2A48]">
              <tr>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Owner</th>
                <th className="py-3.5 px-6">Tags</th>
                <th className="py-3.5 px-6">Repeat Customer?</th>
                <th className="py-3.5 px-6">Custom Field A</th>
                <th className="py-3.5 px-6">Custom Field B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A48]">
              {combined.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500 text-sm">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                combined.map((item) => {
                  const Icon = item.icon;
                  return (
                    <tr key={item.id} className="hover:bg-[#282846]/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          item.type === 'organization' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span className="capitalize">{item.type}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-white">{item.name}</td>
                      <td className="py-4 px-6 text-xs text-slate-300">{item.phone}</td>
                      <td className="py-4 px-6 text-xs text-slate-300">{item.email}</td>
                      <td className="py-4 px-6 text-xs">{item.owner}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-[#1A1A2E] text-slate-300 text-[10px] rounded border border-[#323254]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {item.repeatCustomer ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-slate-500 text-xs bg-[#1A1A2E] px-2 py-0.5 rounded-full">
                            <X className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 italic">N/A</td>
                      <td className="py-4 px-6 text-xs text-slate-500 italic">Standard</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
