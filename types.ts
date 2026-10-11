export type EntityType = 'customer' | 'partner' | 'prospect' | 'lead';

export interface Organization {
  id: string;
  name: string;
  type: 'Customer' | 'Partner' | 'Prospect';
  phone: string;
  email: string;
  owner: string;
  website: string;
  tags: string[];
  repeatCustomer: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  type: 'Customer' | 'Lead' | 'Partner';
  phone: string;
  email: string;
  organizationId?: string;
  organizationName?: string;
  owner: string;
  tags: string[];
  repeatCustomer: boolean;
  createdAt: string;
}

export type OpportunityStage = 'New' | 'Qualification' | 'Proposal' | 'Negotiation';

export interface Opportunity {
  id: string;
  name: string;
  organizationId: string;
  organizationName: string;
  contactId: string;
  contactName: string;
  amount: number;
  stage: OpportunityStage;
  source: string;
  owner: string;
  tags: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'archived' | 'won' | 'lost';
  hasOverdueActivities?: boolean;
  hasTodayActivities?: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  type: 'Task' | 'Meeting' | 'Call' | 'Delivery' | 'Inspection';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  calendar: string; // 'Company Calendar' | 'Sales Team' | 'Personal'
  opportunityId?: string;
  opportunityName?: string;
  contactId?: string;
  contactName?: string;
  description: string;
  completed: boolean;
  isOverdue?: boolean;
  isToday?: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'phone' | 'email' | 'dropdown' | 'agreement';
  required: boolean;
  options?: string[]; // For dropdown
}

export interface WebForm {
  id: string;
  title: string;
  description: string;
  pipelineStage: OpportunityStage;
  defaultSource: string;
  fields: FormField[];
  submissionsCount: number;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  data: Record<string, any>;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  submittedAt: string;
  opportunityId?: string;
  contactId?: string;
}

export interface GoogleFormSyncConfig {
  scriptUrl: string;
  autoSync: boolean;
  lastSyncedAt: string | null;
  totalImported: number;
  importedRowIds: string[];
  fieldMapping: {
    nameKey: string;
    phoneKey: string;
    emailKey: string;
    productKey: string;
    notesKey: string;
  };
}
