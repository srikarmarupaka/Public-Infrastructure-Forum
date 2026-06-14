export type Language = 'EN' | 'HI';

export interface Agenda {
  id: string;
  title_en: string;
  title_hi: string;
  body_en: string;
  body_hi: string;
  icon: string;
  order: number;
}

export interface ResearchDoc {
  id: string;
  title_en: string;
  title_hi: string;
  type: string; // Dashboard, Report, Policy Document, Workshop, Podcast
  year: number;
  region: string;
  summary_en: string;
  summary_hi: string;
  url: string;
  timestamp: any; // Firestore Timestamp
}

export interface Dispatch {
  id: string;
  title_en: string;
  title_hi: string;
  content_en: string;
  content_hi: string;
  author: string;
  tags: string[];
  publishedAt: any; // Firestore Timestamp
  isDraft: boolean;
}

export interface CitizenAudit {
  id: string;
  userId: string;
  locationName: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  infraType: string; // "water", "roads", "waste", "electricity", "transport", "accessibility", "other"
  qualityScore: number; // 0 - 100
  climateScore: number; // 0 - 10
  images: string[];
  comments: string;
  approvedByAdmin: boolean;
  createdAt: any; // Firestore Timestamp
  likesCount?: number;
  dislikesCount?: number;
  reportsCount?: number;
}

export interface AuditComment {
  id: string;
  auditId: string;
  authorName: string;
  text: string;
  createdAt: any; // Firestore Timestamp
}

export interface Subscriber {
  email: string;
  subscribedAt: any; // Firestore Timestamp
  sourcePlatform: string;
}
