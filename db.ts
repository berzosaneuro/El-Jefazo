
// Using default import for Dexie to ensure proper inheritance and access to instance methods in TypeScript
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { Clone, Renewal, UserConfig, LogEntry, AppNotification, ScheduledTask } from './types';

// Defining the database class by extending the Dexie class.
export class ElJefazoDB extends Dexie {
  clones!: Table<Clone>;
  renewals!: Table<Renewal>;
  logs!: Table<LogEntry>;
  notifications!: Table<AppNotification>;
  config!: Table<UserConfig>;
  scheduledTasks!: Table<ScheduledTask>;

  constructor() {
    super('ElJefazoDB');
    // Defining the database schema using the inherited version method from the Dexie base class.
    // This allows properties like 'version' and 'transaction' to be correctly recognized by the compiler.
    this.version(3).stores({
      clones: 'id, name, status',
      renewals: 'id, name, renewalDate',
      logs: 'id, timestamp, level',
      notifications: 'id, timestamp, level, read',
      config: 'id',
      scheduledTasks: 'id, name, action, enabled'
    });
  }
}

// Export a single instance of the database to be used throughout the application.
export const db = new ElJefazoDB();
