export type VaccinationStatus = 'completed' | 'due' | 'overdue';

export type UserType = 'parent' | 'healthPractitioner';

export type NotificationType = 'reminder' | 'alert' | 'info';

export type View = 'dashboard' | 'my-children' | 'patients' | 'education' | 'reports' | 'notifications' | 'settings' | 'analysis';

export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  userType: UserType;
}

export interface Vaccination {
  name: string;
  date: string | null;
  status: VaccinationStatus;
  nextDue: string | null;
}

export interface Infant {
  id: number;
  name:string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  avatar: string;
  parentName: string;
  phoneNumber: string;
  vaccinations: Vaccination[];
  completionRate: number;
}

export interface EducationalContent {
  id: number;
  title: string;
  content: string;
  category: string;
  readTime: string;
  keyPoints?: string[];
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  urgent: boolean;
  time: string;
}

export interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}