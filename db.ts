
// Use named import for Dexie to ensure proper inheritance and access to instance methods like version() and transaction()
import { Dexie, type Table } from 'dexie';
import { Clone, Renewal, UserConfig, LogEntry, AppNotification, ScheduledTask } from './types';

// Defining the database class by extending the Dexie class. This ensures that all instance methods 
// inherited from Dexie (like version and transaction) are correctly typed and available.
export class ElJefazoDB extends Dexie {
  clones!: Table<Clone>;
  renewals!: Table<Renewal>;
  logs!: Table<LogEntry>;
  notifications!: Table<AppNotification>;
  config!: Table<UserConfig>;
  scheduledTasks!: Table<ScheduledTask>;

  constructor() {
    super('ElJefazoDB');
    // Using the inherited version() method to define the database schema.
    // The version number should be incremented if the schema changes.
    // Using named import for Dexie ensures 'version' and other instance methods are recognized by TypeScript.
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
