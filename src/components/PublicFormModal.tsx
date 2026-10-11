import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { WebForm, Opportunity, Contact, FormSubmission } from '../types';

interface PublicFormModalProps {
  form: WebForm | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitForm: (submission: FormSubmission, newOpp: Opportunity, newCon: Contact) => void;
}

export const PublicFormModal: React.FC<PublicFormModalProps> = ({
  form,
  isOpen,
  onClose,
  onSubmitForm,
}) => {
  if (!isOpen || !form) return null;

  const [formData, setFormData] = useState<Record<string, any>>({
    'Full Name': '',
    'Email Address': '',
    'Phone Number': '',
    'Service Interest': 'Office Furniture',
    'I agree to personal data processing': false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (label: string, value: any) => {
    setFormData({ ...formData, [label]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData['Full Name'] || 'New Lead';
    const email = formData['Email Address'] || 'lead@example.com';
    const phone = formData['Phone Number'] || '+1 (555) 000-0000';

    const newContact: Contact = {
      id: `con-${Date.now()}`,
      name,
      type: 'Lead',
      phone,
      email,
      owner: 'Alex Morgan',
      tags: ['Web Form', 'Inbound Lead'],
      repeatCustomer: false,
      createdAt: '2026-10-11'
    };

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      name: `${name} - Web Inquiry`,
      organizationId: '',
      organizationName: 'Inbound Web Lead',
      contactId: newContact.id,
      contactName: name,
      amount: 12000,
      stage: 'New',
      source: 'Web Form',
      owner: 'Alex Morgan',
      tags: ['Web Form', 'New Lead'],
      startDate: '2026-10-11',
      endDate: '2026-11-11',
      status: 'active',
      hasTodayActivities: true,
      createdAt: '2026-10-11'
    };

    const submission: FormSubmission = {
      id: `sub-${Date.now()}`,
      formId: form.id,
      formTitle: form.title,
      data: formData,
      utmSource: 'google_ads',
      utmMedium: 'cpc',
      utmCampaign: 'crm_pro_launch',
      submittedAt: '2026-10-11 15:30',
      opportunityId: newOpp.id,
      contactId: newContact.id
    };

    onSubmitForm(submission, newOpp, newContact);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E38] border border-[#2A2A48] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg z-10">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Thank You!</h3>
            <p className="text-sm text-slate-400">
              Your form has been successfully submitted. An automated contact and pipeline opportunity have been created in CRM Pro!
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              Close Test View
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-6">
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Public Embed Form View
              </span>
              <h2 className="text-xl font-bold text-white mt-2">{form.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{form.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Scott"
                  value={formData['Full Name']}
                  onChange={(e) => handleChange('Full Name', e.target.value)}
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="mscott@dundermifflin.com"
                  value={formData['Email Address']}
                  onChange={(e) => handleChange('Email Address', e.target.value)}
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData['Phone Number']}
                  onChange={(e) => handleChange('Phone Number', e.target.value)}
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Service Interest</label>
                <select
                  value={formData['Service Interest']}
                  onChange={(e) => handleChange('Service Interest', e.target.value)}
                  className="w-full bg-[#1A1A2E] border border-[#323254] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Office Furniture">Office Furniture</option>
                  <option value="Paper & Supplies">Paper & Supplies</option>
                  <option value="IoT Solutions">IoT Solutions</option>
                  <option value="Consulting">Consulting</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  required
                  id="consent"
                  checked={formData['I agree to personal data processing']}
                  onChange={(e) => handleChange('I agree to personal data processing', e.target.checked)}
                  className="w-4 h-4 rounded border-[#323254] text-blue-600 bg-[#1A1A2E]"
                />
                <label htmlFor="consent" className="text-xs text-slate-300">
                  I agree to personal data consent & privacy terms.
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Lead Form</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
