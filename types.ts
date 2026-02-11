
export enum CloneStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ServerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export interface Clone {
  id: string;
  name: string;
  description: string;
  type: string;
  versionInstalled: string;
  versionAvailable: string;
  status: CloneStatus;
  serverStatus: ServerStatus;
  lastSync: string;
  lastUpdate: string;
  autoUpdate: boolean;
  updateChannel: 'stable' | 'beta' | 'dev';
  logs: LogEntry[];
  settings: Record<string, any>;
  imageUrl?: string; // Visual signature of the clone
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
}

export enum NotificationLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface AppNotification {
  id: string;
  timestamp: string;
  level: NotificationLevel;
  title: string;
  message: string;
  read: boolean;
}

export enum RenewalType {
  DOMAIN = 'DOMAIN',
  HOSTING = 'HOSTING',
  SUBSCRIPTION = 'SUBSCRIPTION',
  API = 'API',
  OTHER = 'OTHER'
}

export enum RenewalUrgency {
  OK = 'OK',
  PROXIMO = 'PROXIMO',
  CRITICO = 'CRITICO',
  VENCIDO = 'VENCIDO'
}

export interface Renewal {
  id: string;
  name: string;
  type: RenewalType;
  renewalDate: string;
  price?: number;
  notes?: string;
  reminderEnabled: boolean;
  snoozeUntil?: string;
}

export type TaskActionType = 'SYNC_ALL' | 'CLEAN_LOGS' | 'HEALTH_CHECK' | 'NOTIFY_RENEWALS';

export interface ScheduledTask {
  id: string;
  name: string;
  action: TaskActionType;
  intervalSeconds: number;
  lastRun: string | null;
  enabled: boolean;
}

export interface UserConfig {
  id: string;
  username: string;
  role: UserRole;
  soundsEnabled: boolean;
  volume: number;
  vibrationEnabled: boolean;
  sirenEnabled: boolean;
  pushEnabled: boolean;
  globalAutoUpdate: boolean;
  emergencyMode: boolean;
  maintMode: boolean;
  darkMode: boolean;
  waNumber: string;
  waTemplate: string;
  emailPrimary: string;
  emailSubjectTemplate: string;
  emailBodyTemplate: string;
}

export interface MarketplaceClone {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  size: string;
  imageUrl?: string; // Preview image for the marketplace
}
