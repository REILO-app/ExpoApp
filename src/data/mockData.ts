// ─── Referrals ────────────────────────────────────────────────────────────────

export type Referral = {
  id: string;
  name: string;
  role: string;
  time: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusBorder: string;
  dotColor: string;
  // Detail fields
  company: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  notes: string;
};

export const MOCK_REFERRALS: Referral[] = [
  {
    id: '1',
    name: 'Nitin Pansare',
    role: 'Associate Director Quality, India',
    time: '2h',
    status: 'Accepted',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    statusBorder: '#D1FAE5',
    dotColor: '#10B981',
    company: 'Emerson',
    location: 'Pune, MH, India',
    email: 'prasadpansare19@gmail.com',
    phone: '+91 98765 43210',
    linkedin: 'https://linkedin.com/in/nitinpansare',
    notes:
      'He is my father, and he is willing to refer me. I have proved myself to him that i am worth it. So he is willing to refer to any upcoming jobs',
  },
  {
    id: '2',
    name: 'Yogesh',
    role: 'Software Dev',
    time: '1d',
    status: 'Accepted',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    statusBorder: '#D1FAE5',
    dotColor: '#10B981',
    company: 'TechCorp',
    location: 'Mumbai, MH, India',
    email: 'yogesh@example.com',
    phone: '+91 91234 56789',
    linkedin: 'https://linkedin.com/in/yogesh',
    notes: 'A colleague from a previous project. Open to referring.',
  },
  {
    id: '3',
    name: 'Bhavik Mer',
    role: 'VP Engineering',
    time: '3d',
    status: 'Pending',
    statusColor: '#D97706',
    statusBg: '#FFFBEB',
    statusBorder: '#FEF3C7',
    dotColor: '#FBBF24',
    company: 'InnovateTech',
    location: 'Bangalore, KA, India',
    email: 'bhavik@example.com',
    phone: '+91 99876 54321',
    linkedin: 'https://linkedin.com/in/bhavikmer',
    notes: 'Met at a conference. Awaiting his response.',
  },
  {
    id: '4',
    name: 'Ajay Joshi',
    role: 'Global Tech Lead',
    time: '4d',
    status: 'No Response',
    statusColor: '#64748B',
    statusBg: '#F8FAFC',
    statusBorder: '#E2E8F0',
    dotColor: '#CBD5E1',
    company: 'GlobalSoft',
    location: 'Hyderabad, TS, India',
    email: 'ajay@example.com',
    phone: '+91 90000 11111',
    linkedin: 'https://linkedin.com/in/ajayjoshi',
    notes: 'Reached out via LinkedIn. No response yet.',
  },
  {
    id: '5',
    name: 'Giridhar S.',
    role: 'Software Dev',
    time: '1w',
    status: 'Declined',
    statusColor: '#E11D48',
    statusBg: '#FFF1F2',
    statusBorder: '#FFE4E6',
    dotColor: '#F43F5E',
    company: 'DevHouse',
    location: 'Chennai, TN, India',
    email: 'giridhar@example.com',
    phone: '+91 88888 22222',
    linkedin: 'https://linkedin.com/in/giridhar',
    notes: 'Declined due to company referral policy.',
  },
];

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export type Job = {
  id: string;
  role: string;
  company: string;
  time: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusBorder: string;
  dotColor: string;
  referrer: string;
  // Detail fields
  jobId: string;
  jd: string;
  link: string;
  location: string;
  type: string;
};

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    role: 'Senior Frontend Engineer',
    company: 'Emerson',
    time: '2h',
    status: 'Email Sent',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    statusBorder: '#D1FAE5',
    dotColor: '#10B981',
    referrer: 'Nitin Pansare',
    jobId: 'EMR-2026-FE-4812',
    jd: `We are looking for a Senior Frontend Engineer to join our growing team at Emerson.\n\nResponsibilities:\n• Build and maintain high-quality web and mobile applications\n• Collaborate with designers and backend engineers\n• Write clean, maintainable, and well-tested code\n• Mentor junior engineers and conduct code reviews\n• Drive technical decisions for frontend architecture\n\nRequirements:\n• 5+ years of experience in frontend development\n• Strong proficiency in React, TypeScript, and modern CSS\n• Experience with React Native is a plus\n• Excellent problem-solving and communication skills\n• Bachelor's degree in Computer Science or equivalent`,
    link: 'https://careers.emerson.com/jobs/senior-frontend-engineer',
    location: 'Pune, India (Hybrid)',
    type: 'Full-time',
  },
  {
    id: '2',
    role: 'Software Engineer II',
    company: 'Amazon',
    time: '1d',
    status: 'Pending AI Draft',
    statusColor: '#D97706',
    statusBg: '#FFFBEB',
    statusBorder: '#FEF3C7',
    dotColor: '#FBBF24',
    referrer: 'Yogesh',
    jobId: 'AMZ-SDE2-2026-001',
    jd: `Amazon is seeking a Software Engineer II to build customer-facing products at global scale.\n\nResponsibilities:\n• Design, develop and deploy scalable software services\n• Work in an agile environment with fast iteration cycles\n• Participate in on-call rotations and drive incident resolution\n• Write high quality technical documentation\n\nRequirements:\n• 3+ years of software development experience\n• Strong knowledge of data structures and algorithms\n• Experience with distributed systems and microservices\n• Proficiency in at least one OOP language (Java, Python, Go)\n• Strong verbal and written communication skills`,
    link: 'https://www.amazon.jobs/en/jobs/software-engineer-ii',
    location: 'Bangalore, India (On-site)',
    type: 'Full-time',
  },
];
