import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Opportunity, Organization, Contact, Activity, OpportunityStage } from '../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'opportunity' | 'organization' | 'contact' | 'activity' | null;
  organizations: Organization[];
  contacts: Contact[];
  opportunities?: Opportunity[];
  onSaveOpportunity: (opp: Partial<Opportunity>) => void;
  onSaveOrganization: (org: Partial<Organization>) => void;
  onSaveContact: (con: Partial<Contact>) => void;
  onSaveActivity: (act: Partial<Activity>) => void;
  editItem?: any;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  type,
  organizations,
  contacts,
  opportunities = [],
  onSaveOpportunity,
  onSaveOrganization,
  onSaveContact,
  onSaveActivity,
  editItem
}) => {
  // Opportunity state
  const [oppName, setOppName] = useState('');
  const [oppOrgId, setOppOrgId] = useState('');
  const [oppContactId, setOppContactId] = useState('');
  const [oppAmount, setOppAmount] = useState('10000');
  const [oppStage, setOppStage] = useState<OpportunityStage>('New');
  const [oppSource, setOppSource] = useState('Website');
  const [oppOwner, setOppOwner] = useState('Alex Morgan');
  const [oppTags, setOppTags] = useState('Furniture, Technology');
  const [oppStartDate, setOppStartDate] = useState('2026-10-11');
  const [oppEndDate, setOppEndDate] = useState('2026-11-11');

  // Organization state
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<'Customer' | 'Partner' | 'Prospect'>('Customer');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgTags, setOrgTags] = useState('VIP');
  const [orgRepeat, setOrgRepeat] = useState(false);

  // Contact state
  const [conName, setConName] = useState('');
  const [conType, setConType] = useState<'Customer' | 'Lead' | 'Partner'>('Lead');
  const [conPhone, setConPhone] = useState('');
  const [conEmail, setConEmail] = useState('');
  const [conOrgId, setConOrgId] = useState('');
  const [conTags, setConTags] = useState('Inbound, MQL');

  // Activity state
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState<'Task' | 'Meeting' | 'Call' | 'Delivery' | 'Inspection'>('Meeting');
  const [actDate, setActDate] = useState('2026-10-11');
  const [actTime, setActTime] = useState('12:00');
  const [actCalendar, setActCalendar] = useState('Company Calendar');
  const [actDesc, setActDesc] = useState('');
  const [actOppId, setActOppId] = useState('');

  useEffect(() => {
    if (editItem) {
      if (type === 'opportunity') {
        setOppName(editItem.name || '');
        setOppOrgId(editItem.organizationId || '');
        setOppContactId(editItem.contactId || '');
        setOppAmount(editItem.amount?.toString() || '10000');
        setOppStage(editItem.stage || 'New');
        setOppSource(editItem.source || 'Website');
        setOppOwner(editItem.owner || 'Alex Morgan');
        setOppTags(editItem.tags?.join(', ') || '');
        setOppStartDate(editItem.startDate || '2026-10-11');
        setOppEndDate(editItem.endDate || '2026-11-11');
      } else if (type === 'organization') {
        setOrgName(editItem.name || '');
        setOrgType(editItem.type || 'Customer');
        setOrgPhone(editItem.phone || '');
        setOrgEmail(editItem.email || '');
        setOrgWebsite(editItem.website || '');
        setOrgTags(editItem.tags?.join(', ') || '');
        setOrgRepeat(editItem.repeatCustomer || false);
      } else if (type === 'contact') {
        setConName(editItem.name || '');
        setConType(editItem.type || 'Lead');
        setConPhone(editItem.phone || '');
        setConEmail(editItem.email || '');
        setConOrgId(editItem.organizationId || '');
        setConTags(editItem.tags?.join(', ') || '');
      } else if (type === 'activity') {
        setActTitle(editItem.title || '');
        setActType(editItem.type || 'Meeting');
        setActDate(editItem.date || '2026-10-11');
        setActTime(editItem.time || '12:00');
        setActCalendar(editItem.calendar || 'Company Calendar');
        setActDesc(editItem.description || '');
        setActOppId(editItem.opportunityId || '');
      }
    } else {
      // reset defaults
      if (type === 'opportunity') {
        setOppName(''); setOppAmount('15000'); setOppStage('New');
      } else if (type === 'organization') {
        setOrgName(''); setOrgPhone(''); setOrgEmail('');
      } else if (type === 'contact') {
        setConName(''); setConPhone(''); setConEmail('');
      } else if (type === 'activity') {
        setActTitle(''); setActDesc('');
      }
    }
  }, [editItem, type, isOpen]);

  if (!isOpen || !type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'opportunity') {
      const org = organizations.find(o => o.id === oppOrgId);
      const con = contacts.find(c => c.id === oppContactId);
      onSaveOpportunity({
        id: editItem ? editItem.id : `opp-${Date.now()}`,
        name: oppName || 'New Opportunity',
        organizationId: oppOrgId || (organizations[0]?.id || ''),
        organizationName: org ? org.name : (organizations[0]?.name || 'Sample Org'),
        contactId: oppContactId || (contacts[0]?.id || ''),
        contactName: con ? con.name : (contacts[0]?.name || 'Sample Contact'),
        amount: parseFloat(oppAmount) || 10000,
        stage: oppStage,
        source: oppSource,
        owner: oppOwner,
        tags: oppTags.split(',').map(t => t.trim()).filter(Boolean),
        startDate: oppStartDate,
        endDate: oppEndDate,
        status: editItem ? editItem.status : 'active'
      });
    } else if (type === 'organization') {
      onSaveOrganization({
        id: editItem ? editItem.id : `org-${Date.now()}`,
        name: orgName || 'New Organization',
        type: orgType,
        phone: orgPhone || '+1 (555) 000-0000',
        email: orgEmail || 'info@company.com',
        owner: 'Alex Morgan',
        website: orgWebsite || 'https://example.com',
        tags: orgTags.split(',').map(t => t.trim()).filter(Boolean),
        repeatCustomer: orgRepeat,
        createdAt: editItem ? editItem.createdAt : '2026-10-11'
      });
    } else if (type === 'contact') {
      const org = organizations.find(o => o.id === conOrgId);
      onSaveContact({
        id: editItem ? editItem.id : `con-${Date.now()}`,
        name: conName || 'New Contact',
        type: conType,
        phone: conPhone || '+1 (555) 000-0000',
        email: conEmail || 'contact@example.com',
        organizationId: conOrgId,
        organizationName: org ? org.name : '',
        owner: 'Alex Morgan',
        tags: conTags.split(',').map(t => t.trim()).filter(Boolean),
        repeatCustomer: false,
        createdAt: editItem ? editItem.createdAt : '2026-10-11'
      });
    } else if (type === 'activity') {
      const opp = opportunities.find(o => o.id === actOppId);
      onSaveActivity({
        id: editItem ? editItem.id : `act-${Date.now()}`,
        title: actTitle || 'Follow-up Meeting',
        type: actType,
        date: actDate,
        time: actTime,
        calendar: actCalendar,
        opportunityId: actOppId,
        opportunityName: opp ? opp.name : '',
        description: actDesc,
        completed: editItem ? editItem.completed : false,
        isToday: actDate === '2026-10-11'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E1E38] border border-[#2A2A48] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A48] bg-[#16162B]">
          <h3 className="font-semibold text-white capitalize text-base">
            {editItem ? `Edit ${type}` : `Create New ${type}`}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {type === 'opportunity' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Opportunity Name *</label>
                <input
                  type="text"
                  required
                  value={oppName}
                  onChange={(e) => setOppName(e.target.value)}
                  placeholder="e.g. Enterprise Software License"
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Organization</label>
                  <select
                    value={oppOrgId}
                    onChange={(e) => setOppOrgId(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Organization</option>
                    {organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Contact</label>
                  <select
                    value={oppContactId}
                    onChange={(e) => setOppContactId(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Contact</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.organizationName || 'No Org'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={oppAmount}
                    onChange={(e) => setOppAmount(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Stage</label>
                  <select
                    value={oppStage}
                    onChange={(e) => setOppStage(e.target.value as OpportunityStage)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="New">New</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Source</label>
                  <select
                    value={oppSource}
                    onChange={(e) => setOppSource(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Website">Website</option>
                    <option value="Inbound Call">Inbound Call</option>
                    <option value="Partner Referral">Partner Referral</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Web Form">Web Form</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Owner</label>
                  <input
                    type="text"
                    value={oppOwner}
                    onChange={(e) => setOppOwner(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={oppTags}
                  onChange={(e) => setOppTags(e.target.value)}
                  placeholder="Furniture, Technology, VIP"
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={oppStartDate}
                    onChange={(e) => setOppStartDate(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={oppEndDate}
                    onChange={(e) => setOppEndDate(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'organization' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value as any)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Partner">Partner</option>
                    <option value="Prospect">Prospect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="info@acme.com"
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Website</label>
                  <input
                    type="text"
                    value={orgWebsite}
                    onChange={(e) => setOrgWebsite(e.target.value)}
                    placeholder="https://acme.com"
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags</label>
                <input
                  type="text"
                  value={orgTags}
                  onChange={(e) => setOrgTags(e.target.value)}
                  placeholder="VIP, Wholesale"
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="orgRepeat"
                  checked={orgRepeat}
                  onChange={(e) => setOrgRepeat(e.target.checked)}
                  className="w-4 h-4 rounded border-[#323254] text-blue-600 focus:ring-0 bg-[#1A1A2E]"
                />
                <label htmlFor="orgRepeat" className="text-xs text-slate-300">Repeat Customer</label>
              </div>
            </>
          )}

          {type === 'contact' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={conName}
                  onChange={(e) => setConName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                  <select
                    value={conType}
                    onChange={(e) => setConType(e.target.value as any)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Lead">Lead</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Organization</label>
                  <select
                    value={conOrgId}
                    onChange={(e) => setConOrgId(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">No Organization</option>
                    {organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={conPhone}
                    onChange={(e) => setConPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={conEmail}
                    onChange={(e) => setConEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags</label>
                <input
                  type="text"
                  value={conTags}
                  onChange={(e) => setConTags(e.target.value)}
                  placeholder="Inbound, MQL Lead"
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          {type === 'activity' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="Client call or meeting"
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                  <select
                    value={actType}
                    onChange={(e) => setActType(e.target.value as any)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Call</option>
                    <option value="Task">Task</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Calendar</label>
                  <select
                    value={actCalendar}
                    onChange={(e) => setActCalendar(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Company Calendar">Company Calendar</option>
                    <option value="Sales Team">Sales Team</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                  <input
                    type="time"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Related Opportunity</label>
                <select
                  value={actOppId}
                  onChange={(e) => setActOppId(e.target.value)}
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">None</option>
                  {/* We can pass opportunities or display */}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  placeholder="Notes or agenda..."
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#2A2A48]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#2A2A48] hover:bg-[#323254] text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-600/30 transition-all"
            >
              {editItem ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
