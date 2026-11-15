export type OfficialLinkId =
  | 'pmjdy'
  | 'rbiEducation'
  | 'rbiFame'
  | 'npciFraud'
  | 'npciUpiFaq'
  | 'cybercrime'
  | 'rbiComplaints'
  | 'rbiCms'
  | 'janSuraksha';

export interface OfficialLink {
  id: OfficialLinkId;
  url: string;
  labelKey: string;
  lastReviewedAt: string;
}

export const CYBER_HELPLINE = '1930';

export const CYBER_HELPLINE_TEL = `tel:${CYBER_HELPLINE}`;

export const OFFICIAL_LINKS: Record<OfficialLinkId, OfficialLink> = {
  pmjdy: {
    id: 'pmjdy',
    url: 'https://www.pmjdy.gov.in/scheme',
    labelKey: 'officialLinks.pmjdy',
    lastReviewedAt: '2026-11-13',
  },
  rbiEducation: {
    id: 'rbiEducation',
    url: 'https://www.rbi.org.in/financialeducation/',
    labelKey: 'officialLinks.rbiEducation',
    lastReviewedAt: '2026-11-13',
  },
  rbiFame: {
    id: 'rbiFame',
    url: 'https://www.rbi.org.in/FinancialEducation/fame.aspx',
    labelKey: 'officialLinks.rbiFame',
    lastReviewedAt: '2026-11-13',
  },
  npciFraud: {
    id: 'npciFraud',
    url: 'https://www.npci.org.in/fraud-awareness',
    labelKey: 'officialLinks.npciFraud',
    lastReviewedAt: '2026-11-13',
  },
  npciUpiFaq: {
    id: 'npciUpiFaq',
    url: 'https://www.npci.org.in/what-we-do/upi/faqs',
    labelKey: 'officialLinks.npciUpiFaq',
    lastReviewedAt: '2026-11-13',
  },
  cybercrime: {
    id: 'cybercrime',
    url: 'https://cybercrime.gov.in/',
    labelKey: 'officialLinks.cybercrime',
    lastReviewedAt: '2026-11-13',
  },
  rbiComplaints: {
    id: 'rbiComplaints',
    url: 'https://www.rbi.org.in/Scripts/Complaints.aspx',
    labelKey: 'officialLinks.rbiComplaints',
    lastReviewedAt: '2026-11-13',
  },
  rbiCms: {
    id: 'rbiCms',
    url: 'https://cms.rbi.org.in/',
    labelKey: 'officialLinks.rbiCms',
    lastReviewedAt: '2026-11-13',
  },
  janSuraksha: {
    id: 'janSuraksha',
    url: 'https://jansuraksha.gov.in',
    labelKey: 'officialLinks.janSuraksha',
    lastReviewedAt: '2026-11-13',
  },
};

export const OFFICIAL_LINKS_LIST: OfficialLink[] = Object.values(OFFICIAL_LINKS);

export function getOfficialLink(id: OfficialLinkId): OfficialLink {
  return OFFICIAL_LINKS[id];
}

