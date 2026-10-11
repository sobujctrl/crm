import { Organization, Contact, Opportunity, Activity, WebForm, FormSubmission } from './types';

export const initialOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: '[Sample] Bridge to Learning',
    type: 'Customer',
    phone: '+1 (555) 234-5678',
    email: 'contact@bridgetolearning.org',
    owner: 'Alex Morgan',
    website: 'https://bridgetolearning.org',
    tags: ['Education', 'VIP'],
    repeatCustomer: true,
    createdAt: '2026-09-10'
  },
  {
    id: 'org-2',
    name: '[Sample] Dunder Mifflin Paper Company',
    type: 'Customer',
    phone: '+1 (555) 432-8765',
    email: 'sales@dundermifflin.com',
    owner: 'Dwight Schrute',
    website: 'https://dundermifflin.com',
    tags: ['Paper', 'Wholesale'],
    repeatCustomer: true,
    createdAt: '2026-09-12'
  },
  {
    id: 'org-3',
    name: '[Sample] Golden Grains Agriculture',
    type: 'Partner',
    phone: '+1 (555) 789-0123',
    email: 'info@goldengrains.ag',
    owner: 'Alex Morgan',
    website: 'https://goldengrains.ag',
    tags: ['Agriculture', 'Supply'],
    repeatCustomer: false,
    createdAt: '2026-09-15'
  },
  {
    id: 'org-4',
    name: '[Sample] Landmark Developments',
    type: 'Prospect',
    phone: '+1 (555) 345-6789',
    email: 'projects@landmarkdev.com',
    owner: 'Sarah Connor',
    website: 'https://landmarkdev.com',
    tags: ['Real Estate', 'Construction'],
    repeatCustomer: false,
    createdAt: '2026-09-20'
  },
  {
    id: 'org-5',
    name: '[Sample] Pawsome Pals Animal Rescue',
    type: 'Customer',
    phone: '+1 (555) 890-1234',
    email: 'help@pawsomepals.org',
    owner: 'Alex Morgan',
    website: 'https://pawsomepals.org',
    tags: ['Non-Profit', 'Charity'],
    repeatCustomer: true,
    createdAt: '2026-09-22'
  }
];

export const initialContacts: Contact[] = [
  {
    id: 'con-1',
    name: 'Angela Martin',
    type: 'Customer',
    phone: '+1 (555) 111-2233',
    email: 'amartin@dundermifflin.com',
    organizationId: 'org-2',
    organizationName: '[Sample] Dunder Mifflin Paper Company',
    owner: 'Dwight Schrute',
    tags: ['Accounting', 'VIP'],
    repeatCustomer: true,
    createdAt: '2026-09-12'
  },
  {
    id: 'con-2',
    name: 'Dwight Schrute',
    type: 'Customer',
    phone: '+1 (555) 222-3344',
    email: 'dschrute@dundermifflin.com',
    organizationId: 'org-2',
    organizationName: '[Sample] Dunder Mifflin Paper Company',
    owner: 'Alex Morgan',
    tags: ['Sales Lead', 'Inbound'],
    repeatCustomer: true,
    createdAt: '2026-09-13'
  },
  {
    id: 'con-3',
    name: 'Phyllis Lapin-Vance',
    type: 'Lead',
    phone: '+1 (555) 333-4455',
    email: 'pvance@vancerefrigeration.com',
    organizationId: 'org-4',
    organizationName: '[Sample] Landmark Developments',
    owner: 'Sarah Connor',
    tags: ['MQL Lead', 'Inbound'],
    repeatCustomer: false,
    createdAt: '2026-09-18'
  },
  {
    id: 'con-4',
    name: 'Stanley Hudson',
    type: 'Customer',
    phone: '+1 (555) 444-5566',
    email: 'shudson@dundermifflin.com',
    organizationId: 'org-2',
    organizationName: '[Sample] Dunder Mifflin Paper Company',
    owner: 'Dwight Schrute',
    tags: ['SQL Lead', 'Enterprise'],
    repeatCustomer: true,
    createdAt: '2026-09-20'
  },
  {
    id: 'con-5',
    name: 'Toby Flenderson',
    type: 'Partner',
    phone: '+1 (555) 555-6677',
    email: 'tflenderson@bridgetolearning.org',
    organizationId: 'org-1',
    organizationName: '[Sample] Bridge to Learning',
    owner: 'Alex Morgan',
    tags: ['HR', 'Partner'],
    repeatCustomer: true,
    createdAt: '2026-09-21'
  }
];

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    name: 'Office Furniture Upgrade',
    organizationId: 'org-2',
    organizationName: '[Sample] Dunder Mifflin Paper Company',
    contactId: 'con-2',
    contactName: 'Dwight Schrute',
    amount: 14500,
    stage: 'New',
    source: 'Website',
    owner: 'Alex Morgan',
    tags: ['Furniture', 'Technology'],
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    status: 'active',
    hasTodayActivities: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'opp-2',
    name: 'Bulk Paper Supply Contract Q4',
    organizationId: 'org-2',
    organizationName: '[Sample] Dunder Mifflin Paper Company',
    contactId: 'con-1',
    contactName: 'Angela Martin',
    amount: 28000,
    stage: 'Qualification',
    source: 'Inbound Call',
    owner: 'Dwight Schrute',
    tags: ['Paper', 'Free Shipping'],
    startDate: '2026-10-02',
    endDate: '2026-11-15',
    status: 'active',
    hasOverdueActivities: true,
    createdAt: '2026-10-02'
  },
  {
    id: 'opp-3',
    name: 'Agricultural IoT Sensors',
    organizationId: 'org-3',
    organizationName: '[Sample] Golden Grains Agriculture',
    contactId: 'con-3',
    contactName: 'Phyllis Lapin-Vance',
    amount: 45000,
    stage: 'Proposal',
    source: 'Partner Referral',
    owner: 'Alex Morgan',
    tags: ['Technology', 'IoT'],
    startDate: '2026-10-05',
    endDate: '2026-12-01',
    status: 'active',
    hasTodayActivities: true,
    createdAt: '2026-10-05'
  },
  {
    id: 'opp-4',
    name: 'Commercial Complex Launch',
    organizationId: 'org-4',
    organizationName: '[Sample] Landmark Developments',
    contactId: 'con-3',
    contactName: 'Phyllis Lapin-Vance',
    amount: 85000,
    stage: 'Negotiation',
    source: 'Exhibition',
    owner: 'Sarah Connor',
    tags: ['Real Estate', 'VIP'],
    startDate: '2026-09-25',
    endDate: '2026-10-25',
    status: 'active',
    hasOverdueActivities: true,
    createdAt: '2026-09-25'
  },
  {
    id: 'opp-5',
    name: 'Charity Gala Audio Systems',
    organizationId: 'org-5',
    organizationName: '[Sample] Pawsome Pals Animal Rescue',
    contactId: 'con-5',
    contactName: 'Toby Flenderson',
    amount: 8500,
    stage: 'New',
    source: 'Social Media',
    owner: 'Alex Morgan',
    tags: ['Non-Profit', 'Free Shipping'],
    startDate: '2026-10-10',
    endDate: '2026-10-28',
    status: 'active',
    hasTodayActivities: false,
    createdAt: '2026-10-10'
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Delivery of sample paper packs',
    type: 'Delivery',
    date: '2026-10-11',
    time: '10:00',
    calendar: 'Company Calendar',
    opportunityId: 'opp-2',
    opportunityName: 'Bulk Paper Supply Contract Q4',
    contactId: 'con-1',
    contactName: 'Angela Martin',
    description: 'Deliver 5 sample boxes to Dunder Mifflin main branch.',
    completed: false,
    isToday: true
  },
  {
    id: 'act-2',
    title: 'Final inspection of conference room',
    type: 'Inspection',
    date: '2026-10-11',
    time: '14:30',
    calendar: 'Sales Team',
    opportunityId: 'opp-1',
    opportunityName: 'Office Furniture Upgrade',
    contactId: 'con-2',
    contactName: 'Dwight Schrute',
    description: 'Inspect layout and measurements for new desks.',
    completed: false,
    isToday: true
  },
  {
    id: 'act-3',
    title: 'Follow-up call with potential customer',
    type: 'Call',
    date: '2026-10-09',
    time: '11:00',
    calendar: 'Company Calendar',
    opportunityId: 'opp-3',
    opportunityName: 'Agricultural IoT Sensors',
    contactId: 'con-3',
    contactName: 'Phyllis Lapin-Vance',
    description: 'Discuss pricing tiers and implementation timeline.',
    completed: false,
    isOverdue: true
  },
  {
    id: 'act-4',
    title: 'Meeting with the client',
    type: 'Meeting',
    date: '2026-10-12',
    time: '15:00',
    calendar: 'Sales Team',
    opportunityId: 'opp-4',
    opportunityName: 'Commercial Complex Launch',
    contactId: 'con-3',
    contactName: 'Phyllis Lapin-Vance',
    description: 'Finalize contract clauses.',
    completed: false
  },
  {
    id: 'act-5',
    title: 'Sales presentation for executive board',
    type: 'Task',
    date: '2026-10-14',
    time: '09:30',
    calendar: 'Company Calendar',
    opportunityId: 'opp-1',
    opportunityName: 'Office Furniture Upgrade',
    contactId: 'con-2',
    contactName: 'Dwight Schrute',
    description: 'Prepare slide deck and catalog.',
    completed: false
  },
  {
    id: 'act-6',
    title: 'Schedule a call with the client',
    type: 'Call',
    date: '2026-10-08',
    time: '16:00',
    calendar: 'Personal',
    opportunityId: 'opp-5',
    opportunityName: 'Charity Gala Audio Systems',
    contactId: 'con-5',
    contactName: 'Toby Flenderson',
    description: 'Quick check-in on requirements.',
    completed: true,
    isOverdue: true
  }
];

export const initialWebForms: WebForm[] = [
  {
    id: 'form-1',
    title: 'Schedule a Consult',
    description: 'Book a free consultation with our expert sales team.',
    pipelineStage: 'New',
    defaultSource: 'Web Form',
    fields: [
      { id: 'f-1', label: 'Full Name', type: 'text', required: true },
      { id: 'f-2', label: 'Email Address', type: 'email', required: true },
      { id: 'f-3', label: 'Phone Number', type: 'phone', required: false },
      { id: 'f-4', label: 'Service Interest', type: 'dropdown', required: true, options: ['Office Furniture', 'Paper & Supplies', 'IoT Solutions', 'Consulting'] },
      { id: 'f-5', label: 'I agree to personal data processing', type: 'agreement', required: true }
    ],
    submissionsCount: 2,
    createdAt: '2026-09-25'
  }
];

export const initialSubmissions: FormSubmission[] = [
  {
    id: 'sub-1',
    formId: 'form-1',
    formTitle: 'Schedule a Consult',
    data: {
      'Full Name': 'Michael Scott',
      'Email Address': 'mscott@dundermifflin.com',
      'Phone Number': '+1 (555) 999-0000',
      'Service Interest': 'Office Furniture',
      'I agree to personal data processing': true
    },
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'fall_sale',
    submittedAt: '2026-10-08 14:22',
    opportunityId: 'opp-1',
    contactId: 'con-2'
  },
  {
    id: 'sub-2',
    formId: 'form-1',
    formTitle: 'Schedule a Consult',
    data: {
      'Full Name': 'Jim Halpert',
      'Email Address': 'jhalpert@dundermifflin.com',
      'Phone Number': '+1 (555) 888-7766',
      'Service Interest': 'Paper & Supplies',
      'I agree to personal data processing': true
    },
    utmSource: 'newsletter',
    utmMedium: 'email',
    utmCampaign: 'september_update',
    submittedAt: '2026-10-09 09:15',
    opportunityId: 'opp-2',
    contactId: 'con-1'
  }
];
