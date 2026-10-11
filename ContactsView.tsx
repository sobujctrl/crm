import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Users2, 
  Trash2, 
  Edit, 
  Mail, 
  Phone, 
  Building2 
} from 'lucide-react';
import { Contact } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onOpenCreate: () => void;
  onEditContact: (con: Contact) => void;
  onDeleteContact: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onOpenCreate,
  onEditContact,
  onDeleteContact,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(con => {
    if (searchQuery && !con.name.toLowerCase().includes(searchQuery.toLowerCase()) && !con.email.toLowerCase().includes(searchQuery.toLowerCase())) {
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
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
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
        </div>

        <button
          onClick={onOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-md shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Contact</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-6 py-3 border-b border-[#2A2A48] flex items-center justify-between bg-[#1E1E38]/30">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-semibold">{filteredContacts.length}</span> contacts
        </div>
      </div>

      {/* Contacts Table */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-[#1E1E38] border border-[#2A2A48] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#16162B] text-slate-400 uppercase text-[11px] font-semibold border-b border-[#2A2A48]">
              <tr>
                <th className="py-3.5 px-6">Name & Type</th>
                <th className="py-3.5 px-6">Organization</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Owner</th>
                <th className="py-3.5 px-6">Tags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A48]">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 text-sm">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((con) => (
                  <tr key={con.id} className="hover:bg-[#282846]/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-white">
                      <div className="flex items-center space-x-2">
                        <Users2 className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{con.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal ml-6">
                        Type: {con.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {con.organizationName ? (
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{con.organizationName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No Organization</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-300 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{con.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{con.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs">{con.owner}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 items-center">
                        {con.tags.slice(0, 1).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#1A1A2E] border border-[#323254] text-slate-300 text-[10px] rounded">
                            {t}
                          </span>
                        ))}
                        {con.tags.length > 1 && (
                          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded">
                            +{con.tags.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEditContact(con)}
                          className="p-1.5 hover:bg-[#2A2A48] rounded text-slate-400 hover:text-white"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteContact(con.id)}
                          className="p-1.5 hover:bg-[#2A2A48] rounded text-slate-400 hover:text-rose-400"
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
      </div>
    </div>
  );
};
