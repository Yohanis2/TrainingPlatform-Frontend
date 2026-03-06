export type Role = 'ROLE_ADMIN' | 'ROLE_TRAINER' | 'ROLE_USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export type TrainingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type TrainingStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'ARCHIVED';

export interface Training {
  id: number;
  title: string;
  description: string;
  category?: Category | null;
  level: TrainingLevel;
  price: number;
  capacity: number;
  enrolledCount: number;
  startDate?: string | null;
  endDate?: string | null;
  status: TrainingStatus;
  createdAt: string;
  trainer: User;
  participants: User[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ConnectionRequest {
  id: number;
  sender: User;
  receiver: User;
  status: ConnectionStatus;
  createdAt: string;
}

export interface Message {
  id: number;
  sender: User;
  recipient: User;
  content: string;
  sentAt: string;
}

export type NotificationType = 'MESSAGE' | 'TRAINING' | 'CONNECTION' | 'REVIEW';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  comment?: string | null;
  createdAt: string;
}
