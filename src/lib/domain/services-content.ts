export interface ServicePage {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  price?: string;
  duration?: string;
  location?: string;
  deliverables: string[];
  features?: string[];
  faq: { question: string; answer: string }[];
}

export const servicePages: ServicePage[] = [
  {
    slug: "bookkeeping-service",
    title: "Bookkeeping Service",
    tagline: "Efficient bookkeeping for financial stability",
    summary:
      "Secure your financial records with our professional bookkeeping service. From organizing transactions to preparing financial statements, our team ensures accuracy and efficiency in managing your accounts. Streamline your financial processes today!",
    price: "US$150",
    duration: "1 hr 30 min",
    location: "Dublin 8 / Remote Consultation",
    deliverables: [
      "Daily and monthly transaction recording & classification",
      "Bank reconciliation aligning statements with ledgers",
      "Accounts payable and receivable management",
      "Preparation of periodic profit & loss and balance sheet reports",
      "Cloud accounting software integration (Xero, QuickBooks, Big Red Cloud)",
      "Year-end file preparation for tax returns & CRO filing"
    ],
    features: [
      "Dedicated bookkeeping specialist",
      "100% cloud-based access",
      "Direct bank feed synchronization",
      "Secure document exchange"
    ],
    faq: [
      {
        question: "Which accounting software do you support?",
        answer: "We support Xero, QuickBooks, Sage, Big Red Cloud, and custom spreadsheets, ensuring smooth transitions without disruption."
      },
      {
        question: "How often are accounts reconciled?",
        answer: "Reconciliations are performed weekly or monthly depending on your transaction volume."
      }
    ]
  },
  {
    slug: "payroll-processing",
    title: "Payroll Processing",
    tagline: "Streamlined payroll processing for peace of mind",
    summary:
      "Outsource your payroll processing to us for hassle-free payroll management. From calculating wages to tax withholding, we handle all payroll tasks efficiently and accurately. Ensure timely payments and compliance with payroll regulations.",
    price: "US$120",
    duration: "1 hr",
    location: "Dublin 8 / Remote Consultation",
    deliverables: [
      "End-to-end gross-to-net payroll calculation",
      "PAYE Modernisation real-time reporting (RTR) to Revenue",
      "PRSI, USC, and Benefit-in-Kind (BIK) deductions",
      "Secure digital payslips issued directly to employees",
      "Pensions & auto-enrolment compliance support",
      "Statutory Sick Pay and maternity/paternity tracking"
    ],
    features: [
      "Full Revenue compliance guaranteed",
      "Multi-frequency payroll (weekly, bi-weekly, monthly)",
      "Employee self-service digital payslips",
      "Confidential executive payroll"
    ],
    faq: [
      {
        question: "How quickly can payroll runs be turned around?",
        answer: "We typically process and submit payroll within 24 to 48 hours of receiving timesheet/salary approval."
      },
      {
        question: "Do you handle Revenue payroll submissions?",
        answer: "Yes, we submit Revenue Payroll Notifications (RPNs) and real-time reports on or before each pay date automatically."
      }
    ]
  },
  {
    slug: "tax-consultation",
    title: "Tax Consultation",
    tagline: "Expert tax advice tailored to your needs",
    summary:
      "Schedule a one-on-one tax consultation with our expert accountants. Get personalized advice and guidance on tax planning, compliance, and optimizing your financial situation. Let us help you navigate the complexities of taxation with ease.",
    price: "US$100",
    duration: "1 hr",
    location: "Dublin 8 / Remote Consultation",
    deliverables: [
      "Strategic Corporation Tax (CT1) planning (12.5% / 15%)",
      "Income Tax returns (Form 11 self-assessed & Form 12)",
      "VAT compliance, registrations, and cross-border OSS handling",
      "Capital Gains Tax (CGT) and Capital Acquisitions Tax (CAT) relief optimization",
      "Director remuneration and extraction tax efficiency",
      "Revenue audit representation & compliance interventions"
    ],
    features: [
      "One-on-one consultation with certified tax professionals",
      "Tailored tax optimization roadmap",
      "Proactive deadline management",
      "Full audit defense support"
    ],
    faq: [
      {
        question: "Can you assist with startup tax reliefs like SURE or EIIS?",
        answer: "Yes, we advise on founder tax reliefs, seed capital schemes, and R&D tax credit claims."
      },
      {
        question: "What is required before our tax consultation session?",
        answer: "We recommend sharing your previous year tax returns or recent balance sheet so we can prepare tailored recommendations."
      }
    ]
  },
  {
    slug: "financial-reconciliation",
    title: "Financial Reconciliation",
    tagline: "Meticulous reconciliation for complete transparency",
    summary:
      "Our meticulous bank reconciliation services ensure that your financial records align with bank statements, providing transparency and accuracy in your financial reporting. Count on us for reliable reconciliation processes.",
    deliverables: [
      "Bank and credit card statement matching",
      "Payment gateway & stripe/merchant reconciliation",
      "Discrepancy and unresolved transaction investigations",
      "Inter-company loan account reconciliations",
      "Audit-ready schedules and documentation"
    ],
    faq: [
      {
        question: "Why is regular reconciliation critical?",
        answer: "It prevents fraud, detects banking errors, ensures accurate cash balances, and guarantees compliance with Irish statutory accounting rules."
      }
    ]
  },
  {
    slug: "personalized-consultation",
    title: "Personalized Consultation",
    tagline: "Dedicated financial guidance for your business growth",
    summary:
      "We offer individualized consultation services to address your specific financial concerns and goals. Our consultants work closely with you to provide personalized financial guidance and support for informed decision-making.",
    deliverables: [
      "Business model and cash-flow diagnostics",
      "Cost reduction and profit margin optimization",
      "Budgeting and 3-statement financial projections",
      "Grant funding advisory (Enterprise Ireland & Local Enterprise Office)",
      "Entity structuring and CRO registration guidance"
    ],
    faq: [
      {
        question: "Who is this consultation best suited for?",
        answer: "Small businesses, startups, entrepreneurs, and sole traders seeking clear financial direction and growth strategies."
      }
    ]
  },
  {
    slug: "company-secretarial",
    title: "Company Secretarial & Advisory",
    tagline: "Complete CRO compliance and governance",
    summary:
      "Company formation and ongoing CRO compliance, from annual returns (Form B1) to beneficial ownership filings (RBO).",
    deliverables: [
      "Company incorporation with the Companies Registration Office (CRO)",
      "Annual Return (Form B1) with 56-day iXBRL filing management",
      "Register of Beneficial Ownership (RBO) filings",
      "Statutory registers maintenance and director updates (Form B10)",
      "Share allotment, transfers, and corporate restructuring"
    ],
    faq: [
      {
        question: "What happens if an Annual Return is filed late?",
        answer: "Late filing incurs CRO fines and loss of the 2-year audit exemption. We track your ARD to ensure filings are always on time."
      }
    ]
  }
];

export function getServiceBySlug(slug: string): ServicePage | undefined {
  // Support aliases
  const normalized = slug.toLowerCase().replace(/^(our-|service-)/, "");
  return servicePages.find(
    (s) => s.slug === slug || s.slug === normalized || s.slug.includes(slug) || slug.includes(s.slug)
  );
}
