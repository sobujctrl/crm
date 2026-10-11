import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { PipelineView } from './components/PipelineView';
import { ActivitiesView } from './components/ActivitiesView';
import { OrganizationsView } from './components/OrganizationsView';
import { ContactsView } from './components/ContactsView';
import { AllAccountsView } from './components/AllAccountsView';
import { WebFormsView } from './components/WebFormsView';
import { CreateModal } from './components/CreateModal';
import { PublicFormModal } from './components/PublicFormModal';

import { 
  initialOrganizations, 
  initialContacts, 
  initialOpportunities, 
  initialActivities, 
  initialWebForms, 
  initialSubmissions 
} from './mockData';
import { Organization, Contact, Opportunity, Activity, WebForm, FormSubmission, OpportunityStage, GoogleFormSyncConfig } from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState('crm');
  const [activeCrmTab, setActiveCrmTab] = useState('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent State via localStorage
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('crm_pro_orgs');
    return saved ? JSON.parse(saved) : initialOrganizations;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('crm_pro_contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('crm_pro_opps');
    return saved ? JSON.parse(saved) : initialOpportunities;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('crm_pro_acts');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [webForms, setWebForms] = useState<WebForm[]>(() => {
    const saved = localStorage.getItem('crm_pro_forms');
    return saved ? JSON.parse(saved) : initialWebForms;
  });

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem('crm_pro_subs');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [googleSyncConfig, setGoogleSyncConfig] = useState<GoogleFormSyncConfig>(() => {
    const saved = localStorage.getItem('crm_pro_google_sync');
    return saved ? JSON.parse(saved) : {
      scriptUrl: '',
      autoSync: false,
      lastSyncedAt: null,
      totalImported: 0,
      importedRowIds: [],
      fieldMapping: {
        nameKey: 'Name',
        phoneKey: 'Phone',
        emailKey: 'Email',
        productKey: 'Product',
        notesKey: 'Message'
      }
    };
  });

  const [hasDemoData, setHasDemoData] = useState(true);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('crm_pro_orgs', JSON.stringify(organizations));
    localStorage.setItem('crm_pro_contacts', JSON.stringify(contacts));
    localStorage.setItem('crm_pro_opps', JSON.stringify(opportunities));
    localStorage.setItem('crm_pro_acts', JSON.stringify(activities));
    localStorage.setItem('crm_pro_forms', JSON.stringify(webForms));
    localStorage.setItem('crm_pro_subs', JSON.stringify(submissions));
    localStorage.setItem('crm_pro_google_sync', JSON.stringify(googleSyncConfig));
  }, [organizations, contacts, opportunities, activities, webForms, submissions, googleSyncConfig]);

  // Auto sync interval if enabled (every 60 seconds)
  useEffect(() => {
    if (!googleSyncConfig.autoSync || !googleSyncConfig.scriptUrl) return;
    const interval = setInterval(() => {
      handleSyncGoogleForm();
    }, 60000);
    return () => clearInterval(interval);
  }, [googleSyncConfig.autoSync, googleSyncConfig.scriptUrl, googleSyncConfig.importedRowIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleDemoData = () => {
    if (hasDemoData) {
      setOrganizations([]);
      setContacts([]);
      setOpportunities([]);
      setActivities([]);
      setWebForms([]);
      setSubmissions([]);
      setHasDemoData(false);
    } else {
      setOrganizations(initialOrganizations);
      setContacts(initialContacts);
      setOpportunities(initialOpportunities);
      setActivities(initialActivities);
      setWebForms(initialWebForms);
      setSubmissions(initialSubmissions);
      setHasDemoData(true);
    }
  };

  // Helper for case-insensitive field lookup
  const getFieldFlexible = (row: any, keywords: string[]) => {
    if (!row || typeof row !== 'object') return '';
    
    const cleanedRow: Record<string, any> = {};
    for (const rawKey of Object.keys(row)) {
      if (!rawKey) continue;
      const cleanKey = rawKey.trim().toLowerCase();
      cleanedRow[cleanKey] = row[rawKey];
    }

    for (const kw of keywords) {
      const target = kw.trim().toLowerCase();
      for (const cleanKey of Object.keys(cleanedRow)) {
        if (cleanKey === target || cleanKey.includes(target) || target.includes(cleanKey)) {
          const val = cleanedRow[cleanKey];
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            return String(val).trim();
          }
        }
      }
    }
    return '';
  };

  // Google Form Sync Execution
  const handleSyncGoogleForm = async (): Promise<{ success: boolean; count: number; message: string }> => {
    const rawUrl = googleSyncConfig.scriptUrl;
    if (!rawUrl || rawUrl.trim() === '') {
      return { success: false, count: 0, message: 'Please enter a valid Apps Script Web App URL.' };
    }

    const trimmedUrl = rawUrl.trim();
    const requestUrl = trimmedUrl.includes('?') 
      ? `${trimmedUrl}&t=${Date.now()}` 
      : `${trimmedUrl}?t=${Date.now()}`;

    try {
      console.log('[GoogleFormSync] Requesting exact URL:', requestUrl);
      const response = await fetch(requestUrl, {
        method: 'GET',
        redirect: 'follow'
      });

      console.log('[GoogleFormSync] Response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Failed to fetch from ${requestUrl}: HTTP status ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      console.log('[GoogleFormSync] Raw response text:', text);

      let rows: any[];
      try {
        const json = JSON.parse(text);
        rows = Array.isArray(json) ? json : (json.rows || json.data || []);
      } catch (err) {
        throw new Error(`Invalid JSON response from ${requestUrl}`);
      }

      console.log('[GoogleFormSync] Parsed rows array:', rows);

      if (!Array.isArray(rows) || rows.length === 0) {
        const nowStr = new Date().toLocaleString();
        setGoogleSyncConfig(prev => ({ ...prev, lastSyncedAt: nowStr }));
        return { success: true, count: 0, message: 'No new submissions' };
      }

      let newImportCount = 0;
      const updatedImportedRowIds = [...googleSyncConfig.importedRowIds];
      const newContacts = [...contacts];
      const newOpps = [...opportunities];
      const newSubs = [...submissions];

      for (const row of rows) {
        console.log('[GoogleFormSync] Processing row:', row);

        const rowId = row.rowId || row.id || getFieldFlexible(row, ['timestamp', 'date', 'time']) || JSON.stringify(row);
        if (updatedImportedRowIds.includes(rowId)) continue;

        const name = getFieldFlexible(row, ['name', 'full name', 'contact name', 'your name', 'naam']) || 'Unknown Lead';
        const phoneRaw = getFieldFlexible(row, ['phone', 'phone number', 'mobile', 'cell', 'telephone', 'contact number']);
        const phone = phoneRaw !== '' ? String(phoneRaw) : '';
        const email = getFieldFlexible(row, ['email', 'email address', 'mail', 'e-mail']);
        const product = getFieldFlexible(row, ['product', 'service interest', 'service', 'item', 'opportunity', 'package']) || 'General Inquiry';
        const message = getFieldFlexible(row, ['message', 'notes', 'description', 'comments', 'details', 'inquiry']) || '';
        const rawTimestamp = getFieldFlexible(row, ['timestamp', 'date', 'time', 'submitted at']);

        // Format Start Date (YYYY-MM-DD)
        let startDateStr = new Date().toISOString().split('T')[0];
        if (rawTimestamp) {
          const parsed = new Date(rawTimestamp);
          if (!isNaN(parsed.getTime())) {
            startDateStr = parsed.toISOString().split('T')[0];
          } else if (typeof rawTimestamp === 'string' && rawTimestamp.includes(' ')) {
            startDateStr = rawTimestamp.split(' ')[0];
          } else if (typeof rawTimestamp === 'string' && rawTimestamp.length >= 10) {
            startDateStr = rawTimestamp.substring(0, 10);
          }
        }

        // End Date = Start Date + 30 days
        const startMs = new Date(startDateStr).getTime();
        const endMs = startMs + 30 * 24 * 60 * 60 * 1000;
        const endDateStr = new Date(endMs).toISOString().split('T')[0];

        // Check existing contact by phone or email
        let existingContact = newContacts.find(c => (phone && c.phone === phone) || (email && c.email === email));
        let contactId = '';

        if (existingContact) {
          contactId = existingContact.id;
        } else {
          const createdCon: Contact = {
            id: `con-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name,
            type: 'Lead',
            phone,
            email,
            owner: 'Alex Morgan',
            tags: ['Google Form', 'Inbound'],
            repeatCustomer: false,
            createdAt: new Date().toISOString().split('T')[0]
          };
          newContacts.unshift(createdCon);
          contactId = createdCon.id;
          existingContact = createdCon;
        }

        const oppName = `${product} - ${name}`;
        const amount = 0;

        const createdOpp: Opportunity = {
          id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: oppName,
          organizationId: existingContact.organizationId || '',
          organizationName: existingContact.organizationName || 'Google Form Lead',
          contactId,
          contactName: name,
          amount,
          stage: 'New',
          source: 'Google Form',
          owner: 'Alex Morgan',
          tags: ['Google Form', 'New Lead'],
          startDate: startDateStr,
          endDate: endDateStr,
          status: 'active',
          hasTodayActivities: true,
          createdAt: new Date().toISOString().split('T')[0]
        };
        newOpps.unshift(createdOpp);

        const sub: FormSubmission = {
          id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          formId: 'google-form-sync',
          formTitle: 'Google Sheet Form Sync',
          data: { ...row, Notes: message },
          utmSource: 'google_sheets',
          utmMedium: 'form_sync',
          utmCampaign: 'auto_sync',
          submittedAt: new Date().toLocaleString(),
          opportunityId: createdOpp.id,
          contactId
        };
        newSubs.unshift(sub);

        updatedImportedRowIds.push(rowId);
        newImportCount++;
      }

      if (newImportCount > 0) {
        setContacts(newContacts);
        setOpportunities(newOpps);
        setSubmissions(newSubs);
        showToast(`${newImportCount} new lead${newImportCount > 1 ? 's' : ''} imported`);
      }

      const nowStr = new Date().toLocaleString();
      setGoogleSyncConfig(prev => ({
        ...prev,
        lastSyncedAt: nowStr,
        totalImported: prev.totalImported + newImportCount,
        importedRowIds: updatedImportedRowIds
      }));

      const msg = newImportCount > 0 ? `${newImportCount} new leads imported` : 'No new submissions';
      return { success: true, count: newImportCount, message: msg };
    } catch (err: any) {
      console.error('[GoogleFormSync] Error connecting to URL:', requestUrl, err);
      const errMsg = err.message || 'Failed to fetch';
      return { success: false, count: 0, message: errMsg };
    }
  };

  // Reset imported Google Form data handler
  const handleResetGoogleFormImport = () => {
    const cleanContacts = contacts.filter(c => !c.tags.includes('Google Form'));
    const cleanOpps = opportunities.filter(o => !o.tags.includes('Google Form') && o.source !== 'Google Form');
    const cleanSubs = submissions.filter(s => s.formId !== 'google-form-sync');
    setContacts(cleanContacts);
    setOpportunities(cleanOpps);
    setSubmissions(cleanSubs);
    setGoogleSyncConfig(prev => ({
      ...prev,
      totalImported: 0,
      importedRowIds: [],
      lastSyncedAt: null
    }));
    showToast('Google Form imported data has been reset.');
  };

  const handleJumpToActivities = (opportunityId: string, filterType: 'today' | 'overdue') => {
    setActiveCrmTab('activities');
  };

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<'opportunity' | 'organization' | 'contact' | 'activity' | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

  const [publicTestFormId, setPublicTestFormId] = useState<string | null>(null);

  const handleOpenCreate = (type: 'opportunity' | 'organization' | 'contact' | 'activity') => {
    setCreateType(type);
    setEditItem(null);
    setIsCreateOpen(true);
  };

  const handleEditItem = (type: 'opportunity' | 'organization' | 'contact', item: any) => {
    setCreateType(type);
    setEditItem(item);
    setIsCreateOpen(true);
  };

  const handleSaveOpportunity = (opp: Partial<Opportunity>) => {
    const exists = opportunities.some(o => o.id === opp.id);
    if (exists) {
      setOpportunities(opportunities.map(o => o.id === opp.id ? { ...o, ...opp } as Opportunity : o));
    } else {
      setOpportunities([opp as Opportunity, ...opportunities]);
    }
  };

  const handleSaveOrganization = (org: Partial<Organization>) => {
    const exists = organizations.some(o => o.id === org.id);
    if (exists) {
      setOrganizations(organizations.map(o => o.id === org.id ? { ...o, ...org } as Organization : o));
    } else {
      setOrganizations([org as Organization, ...organizations]);
    }
  };

  const handleSaveContact = (con: Partial<Contact>) => {
    const exists = contacts.some(c => c.id === con.id);
    if (exists) {
      setContacts(contacts.map(c => c.id === con.id ? { ...c, ...con } as Contact : c));
    } else {
      setContacts([con as Contact, ...contacts]);
    }
  };

  const handleSaveActivity = (act: Partial<Activity>) => {
    const exists = activities.some(a => a.id === act.id);
    if (exists) {
      setActivities(activities.map(a => a.id === act.id ? { ...a, ...act } as Activity : a));
    } else {
      setActivities([act as Activity, ...activities]);
    }
  };

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities(opportunities.filter(o => o.id !== id));
  };

  const handleUpdateStage = (id: string, newStage: OpportunityStage) => {
    setOpportunities(opportunities.map(o => o.id === id ? { ...o, stage: newStage } : o));
  };

  const handleToggleArchive = (id: string) => {
    setOpportunities(opportunities.map(o => {
      if (o.id === id) {
        return { ...o, status: o.status === 'archived' ? 'active' : 'archived' };
      }
      return o;
    }));
  };

  const handleDeleteOrganization = (id: string) => {
    setOrganizations(organizations.filter(o => o.id !== id));
  };

  const handleBulkDeleteOrgs = (ids: string[]) => {
    setOrganizations(organizations.filter(o => !ids.includes(o.id)));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleToggleCompleteActivity = (id: string) => {
    setActivities(activities.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleDeleteForm = (formId: string) => {
    setWebForms(webForms.filter(f => f.id !== formId));
  };

  const handleAddForm = () => {
    const newForm: WebForm = {
      id: `form-${Date.now()}`,
      title: 'New Lead Capture Form',
      description: 'Fill out this form to get in touch with our team.',
      pipelineStage: 'New',
      defaultSource: 'Web Form',
      fields: [
        { id: 'f-1', label: 'Full Name', type: 'text', required: true },
        { id: 'f-2', label: 'Email Address', type: 'email', required: true },
        { id: 'f-3', label: 'Phone Number', type: 'phone', required: false },
        { id: 'f-4', label: 'I agree to personal data processing', type: 'agreement', required: true }
      ],
      submissionsCount: 0,
      createdAt: '2026-10-11'
    };
    setWebForms([...webForms, newForm]);
  };

  const handleFormSubmission = (submission: FormSubmission, newOpp: Opportunity, newCon: Contact) => {
    setSubmissions([submission, ...submissions]);
    setOpportunities([newOpp, ...opportunities]);
    setContacts([newCon, ...contacts]);
    setWebForms(webForms.map(f => f.id === submission.formId ? { ...f, submissionsCount: f.submissionsCount + 1 } : f));
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isDarkMode ? 'bg-[#12121E] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeCrmTab={activeCrmTab}
        setActiveCrmTab={setActiveCrmTab}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onOpenCreate={handleOpenCreate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          hasDemoData={hasDemoData}
          onToggleDemoData={handleToggleDemoData}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Content routing */}
        {activeModule !== 'crm' ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-xl mb-4 shadow-sm">
              {activeModule.toUpperCase().slice(0, 2)}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 capitalize">{activeModule} Module</h2>
            <p className="text-sm max-w-md">
              This module is currently a placeholder. Click on <span className="text-blue-600 font-semibold">CRM</span> in the left sidebar to access the fully functional CRM Pro modules.
            </p>
          </div>
        ) : (
          <>
            {activeCrmTab === 'pipeline' && (
              <PipelineView
                key={opportunities.length}
                opportunities={opportunities}
                onOpenCreate={() => handleOpenCreate('opportunity')}
                onEditOpportunity={(opp) => handleEditItem('opportunity', opp)}
                onDeleteOpportunity={handleDeleteOpportunity}
                onUpdateStage={handleUpdateStage}
                onToggleArchive={handleToggleArchive}
                onJumpToActivities={handleJumpToActivities}
              />
            )}

            {activeCrmTab === 'activities' && (
              <ActivitiesView
                activities={activities}
                onOpenCreate={() => handleOpenCreate('activity')}
                onToggleComplete={handleToggleCompleteActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            )}

            {activeCrmTab === 'organizations' && (
              <OrganizationsView
                organizations={organizations}
                onOpenCreate={() => handleOpenCreate('organization')}
                onEditOrganization={(org) => handleEditItem('organization', org)}
                onDeleteOrganization={handleDeleteOrganization}
                onBulkDelete={handleBulkDeleteOrgs}
                setActiveTab={setActiveCrmTab}
              />
            )}

            {activeCrmTab === 'contacts' && (
              <ContactsView
                key={contacts.length}
                contacts={contacts}
                onOpenCreate={() => handleOpenCreate('contact')}
                onEditContact={(con) => handleEditItem('contact', con)}
                onDeleteContact={handleDeleteContact}
                setActiveTab={setActiveCrmTab}
              />
            )}

            {activeCrmTab === 'all-accounts' && (
              <AllAccountsView
                key={organizations.length + contacts.length}
                organizations={organizations}
                contacts={contacts}
                setActiveTab={setActiveCrmTab}
              />
            )}

            {activeCrmTab === 'web-forms' && (
              <WebFormsView
                webForms={webForms}
                submissions={submissions}
                googleSyncConfig={googleSyncConfig}
                onUpdateGoogleSyncConfig={setGoogleSyncConfig}
                onSyncGoogleForm={handleSyncGoogleForm}
                onResetGoogleFormImport={handleResetGoogleFormImport}
                onOpenBuilder={handleAddForm}
                onOpenPublicTest={(formId) => setPublicTestFormId(formId)}
                onDeleteForm={handleDeleteForm}
                toastMessage={toastMessage}
              />
            )}

            {['report', 'automation', 'settings'].includes(activeCrmTab) && (
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500 p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-xl mb-4 shadow-sm">
                  ⚙️
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 capitalize">{activeCrmTab} Settings</h2>
                <p className="text-sm max-w-md">
                  Configure your CRM Pro {activeCrmTab} workflows, rules, and preferences here.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Universal Create / Edit Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        type={createType}
        organizations={organizations}
        contacts={contacts}
        opportunities={opportunities}
        onSaveOpportunity={handleSaveOpportunity}
        onSaveOrganization={handleSaveOrganization}
        onSaveContact={handleSaveContact}
        onSaveActivity={handleSaveActivity}
        editItem={editItem}
      />

      {/* Public Test Form Submission Modal */}
      <PublicFormModal
        form={webForms.find(f => f.id === publicTestFormId) || null}
        isOpen={Boolean(publicTestFormId)}
        onClose={() => setPublicTestFormId(null)}
        onSubmitForm={handleFormSubmission}
      />
    </div>
  );
}
