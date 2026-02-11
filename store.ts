
import { create } from 'zustand';
import { 
  Clone, Renewal, UserConfig, LogEntry, AppNotification, 
  UserRole, CloneStatus, ServerStatus, NotificationLevel, RenewalType,
  ScheduledTask, TaskActionType 
} from './types';
import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { playSound } from './utils/sounds';
import { sendPushNotification } from './utils/notifications';
import { mockApi } from './services/mockApi';

interface AppState {
  isAuthenticated: boolean;
  user: UserConfig | null;
  clones: Clone[];
  renewals: Renewal[];
  logs: LogEntry[];
  notifications: AppNotification[];
  scheduledTasks: ScheduledTask[];
  loading: boolean;
  isCloudSyncing: boolean;
  syncProgress: number;
  
  init: () => Promise<void>;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  
  addLog: (level: LogEntry['level'], message: string) => Promise<void>;
  
  // Clones
  addClone: (clone: Partial<Clone>) => Promise<void>;
  updateClone: (id: string, updates: Partial<Clone>) => Promise<void>;
  removeClone: (id: string) => Promise<void>;
  syncClone: (id: string) => Promise<void>;
  syncAll: () => Promise<void>;
  runUpdate: (id: string) => Promise<void>;
  checkAllUpdates: () => Promise<void>;
  
  // Renewals
  addRenewal: (renewal: Partial<Renewal>) => Promise<void>;
  updateRenewal: (id: string, updates: Partial<Renewal>) => Promise<void>;
  removeRenewal: (id: string) => Promise<void>;
  
  // Notifications
  addNotification: (level: NotificationLevel, title: string, message: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;

  // Scheduled Tasks
  addScheduledTask: (task: Partial<ScheduledTask>) => Promise<void>;
  updateScheduledTask: (id: string, updates: Partial<ScheduledTask>) => Promise<void>;
  removeScheduledTask: (id: string) => Promise<void>;
  checkScheduledTasks: () => Promise<void>;

  // Cloud Sync
  backupToCloud: () => Promise<void>;
  restoreFromCloud: () => Promise<void>;

  // Config & Actions
  updateUserConfig: (updates: Partial<UserConfig>) => Promise<void>;
  toggleEmergency: () => Promise<void>;
  exportBackup: () => void;
  importBackup: (json: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  clones: [],
  renewals: [],
  logs: [],
  notifications: [],
  scheduledTasks: [],
  loading: true,
  isCloudSyncing: false,
  syncProgress: 0,

  init: async () => {
    const [clones, renewals, logs, notifications, configs, scheduledTasks] = await Promise.all([
      db.clones.toArray(),
      db.renewals.toArray(),
      db.logs.orderBy('timestamp').reverse().limit(100).toArray(),
      db.notifications.orderBy('timestamp').reverse().limit(50).toArray(),
      db.config.toArray(),
      db.scheduledTasks.toArray()
    ]);

    let user = configs[0];
    if (!user) {
      user = {
        id: 'master_user',
        username: 'ELI',
        role: UserRole.SUPERADMIN,
        soundsEnabled: true,
        volume: 0.5,
        vibrationEnabled: true,
        sirenEnabled: true,
        pushEnabled: true,
        globalAutoUpdate: true,
        emergencyMode: false,
        maintMode: false,
        darkMode: true,
        waNumber: '',
        waTemplate: 'Alerta de sistema: {name}',
        emailPrimary: '',
        emailSubjectTemplate: 'EL JEFAZO: Notificación',
        emailBodyTemplate: 'Evento detectado en {name}'
      };
      await db.config.add(user);
    }
    
    set({ clones, renewals, logs, notifications, user, scheduledTasks, loading: false });
  },

  login: async (u, p) => {
    // Artificial delay for futuristic feeling
    await new Promise(r => setTimeout(r, 1000));
    if (u.toUpperCase() === 'ELI') {
      playSound('success');
      set({ isAuthenticated: true });
      return true;
    }
    playSound('error');
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  addLog: async (level, message) => {
    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level,
      message
    };
    await db.logs.add(entry);
    set(state => ({ logs: [entry, ...state.logs].slice(0, 100) }));
  },

  addNotification: async (level, title, message) => {
    const notification: AppNotification = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level,
      title,
      message,
      read: false
    };
    await db.notifications.add(notification);
    set(state => ({ notifications: [notification, ...state.notifications].slice(0, 50) }));
    if (get().user?.pushEnabled) {
      sendPushNotification(title, { body: message });
    }
  },

  markNotificationAsRead: async (id) => {
    await db.notifications.update(id, { read: true });
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  clearNotifications: async () => {
    await db.notifications.clear();
    set({ notifications: [] });
  },

  addClone: async (data) => {
    const newClone: Clone = {
      id: uuidv4(),
      name: data.name || 'NUEVO_CLON',
      description: data.description || '',
      type: data.type || 'WEB_APP',
      versionInstalled: data.versionInstalled || '1.0.0',
      versionAvailable: data.versionAvailable || '1.0.0',
      status: CloneStatus.ACTIVE,
      serverStatus: ServerStatus.ONLINE,
      lastSync: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      autoUpdate: false,
      updateChannel: 'stable',
      logs: [],
      settings: {},
      imageUrl: data.imageUrl
    };
    await db.clones.add(newClone);
    set(state => ({ clones: [...state.clones, newClone] }));
    get().addLog('INFO', `Módulo ${newClone.name} integrado al sistema.`);
    playSound('success');
  },

  updateClone: async (id, updates) => {
    await db.clones.update(id, updates);
    set(state => ({
      clones: state.clones.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  },

  removeClone: async (id) => {
    const clone = get().clones.find(c => c.id === id);
    if (!confirm(`¿PROCEDER CON LA DESINSTALACIÓN DE ${clone?.name}?`)) return;
    await db.clones.delete(id);
    set(state => ({ clones: state.clones.filter(c => c.id !== id) }));
    get().addLog('WARNING', `Clon ${clone?.name} purgado del mainframe.`);
    playSound('error');
  },

  syncClone: async (id) => {
    const clone = get().clones.find(c => c.id === id);
    if (!clone) return;
    set({ syncProgress: 0 });
    // Simulate sync
    for(let i=0; i<=100; i+=25) {
      set({ syncProgress: i });
      await new Promise(r => setTimeout(r, 200));
    }
    const now = new Date().toISOString();
    await get().updateClone(id, { lastSync: now, serverStatus: ServerStatus.ONLINE });
    get().addLog('INFO', `Handshake exitoso con ${clone.name}`);
    playSound('success');
    set({ syncProgress: 0 });
  },

  syncAll: async () => {
    playSound('click');
    get().addLog('INFO', 'Iniciando sincronización global...');
    for (const clone of get().clones) {
      await get().syncClone(clone.id);
    }
    get().addLog('INFO', 'Todos los nodos sincronizados.');
  },

  runUpdate: async (id) => {
    const clone = get().clones.find(c => c.id === id);
    if (!clone) return;
    get().addLog('WARNING', `Actualizando núcleo de ${clone.name}...`);
    playSound('click');
    await new Promise(r => setTimeout(r, 2000));
    await get().updateClone(id, { 
      versionInstalled: clone.versionAvailable, 
      lastUpdate: new Date().toISOString() 
    });
    get().addLog('INFO', `Clon ${clone.name} parcheado a v${clone.versionAvailable}`);
    playSound('success');
  },

  checkAllUpdates: async () => {
    get().addLog('INFO', 'Buscando actualizaciones en el repositorio maestro...');
    const results = await mockApi.checkUpdates(get().clones);
    for(const res of results) {
       await get().updateClone(res.id, { versionAvailable: res.newVersion });
    }
    get().addLog('INFO', 'Verificación de versiones completada.');
  },

  addRenewal: async (data) => {
    const renewal: Renewal = {
      id: uuidv4(),
      name: data.name || 'RENOVACIÓN',
      type: data.type || RenewalType.OTHER,
      renewalDate: data.renewalDate || new Date().toISOString(),
      price: data.price,
      notes: data.notes,
      reminderEnabled: true
    };
    await db.renewals.add(renewal);
    set(state => ({ renewals: [...state.renewals, renewal] }));
    get().addLog('INFO', `Nueva renovación registrada: ${renewal.name}`);
  },

  updateRenewal: async (id, updates) => {
    await db.renewals.update(id, updates);
    set(state => ({
      renewals: state.renewals.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  },

  removeRenewal: async (id) => {
    await db.renewals.delete(id);
    set(state => ({ renewals: state.renewals.filter(r => r.id !== id) }));
  },

  // Implementation of missing scheduled task methods
  addScheduledTask: async (data) => {
    const task: ScheduledTask = {
      id: uuidv4(),
      name: data.name || 'TASK',
      action: data.action || 'HEALTH_CHECK',
      intervalSeconds: data.intervalSeconds || 3600,
      lastRun: null,
      enabled: true
    };
    await db.scheduledTasks.add(task);
    set(state => ({ scheduledTasks: [...state.scheduledTasks, task] }));
    get().addLog('INFO', `Tarea programada ${task.name} activada.`);
  },

  updateScheduledTask: async (id, updates) => {
    await db.scheduledTasks.update(id, updates);
    set(state => ({
      scheduledTasks: state.scheduledTasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  },

  removeScheduledTask: async (id) => {
    await db.scheduledTasks.delete(id);
    set(state => ({ scheduledTasks: state.scheduledTasks.filter(t => t.id !== id) }));
  },

  checkScheduledTasks: async () => {
    const now = new Date();
    const tasks = get().scheduledTasks;
    for (const task of tasks) {
      if (!task.enabled) continue;
      const lastRunDate = task.lastRun ? new Date(task.lastRun) : new Date(0);
      const secondsSinceLastRun = (now.getTime() - lastRunDate.getTime()) / 1000;
      if (secondsSinceLastRun >= task.intervalSeconds) {
        switch(task.action) {
          case 'SYNC_ALL': await get().syncAll(); break;
          case 'HEALTH_CHECK': await get().addLog('INFO', 'Health check nominal.'); break;
        }
        await get().updateScheduledTask(task.id, { lastRun: now.toISOString() });
      }
    }
  },

  backupToCloud: async () => {
    set({ isCloudSyncing: true });
    get().addLog('INFO', 'Iniciando Uplink de Backup...');
    await new Promise(r => setTimeout(r, 3000));
    set({ isCloudSyncing: false });
    get().addLog('INFO', 'Backup subido a ELI_DRIVE con éxito.');
    playSound('success');
  },

  restoreFromCloud: async () => {
    set({ isCloudSyncing: true });
    get().addLog('WARNING', 'Restaurando configuración desde Cloud...');
    await new Promise(r => setTimeout(r, 2500));
    set({ isCloudSyncing: false });
    get().addLog('INFO', 'Sincronización de nube completada.');
    playSound('success');
  },

  updateUserConfig: async (updates) => {
    if (!get().user) return;
    const newUser = { ...get().user!, ...updates };
    await db.config.update(newUser.id, updates);
    set({ user: newUser });
    playSound('click');
  },

  toggleEmergency: async () => {
    const mode = !get().user?.emergencyMode;
    await get().updateUserConfig({ emergencyMode: mode });
    get().addLog(mode ? 'CRITICAL' : 'INFO', `MODO EMERGENCIA: ${mode ? 'ACTIVADO' : 'DESACTIVADO'}`);
    playSound(mode ? 'alert' : 'click');
  },

  exportBackup: () => {
    const data = { 
      clones: get().clones, 
      renewals: get().renewals, 
      config: get().user,
      logs: get().logs,
      tasks: get().scheduledTasks
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JEFAZO_CORE_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    get().addLog('INFO', 'Backup local generado.');
  },

  importBackup: async (json) => {
    try {
      const data = JSON.parse(json);
      // The transaction method is now correctly recognized as db is an instance of a class extending Dexie
      await db.transaction('rw', [db.clones, db.renewals, db.config, db.logs, db.scheduledTasks], async () => {
        if (data.clones) { await db.clones.clear(); await db.clones.bulkAdd(data.clones); }
        if (data.renewals) { await db.renewals.clear(); await db.renewals.bulkAdd(data.renewals); }
        if (data.config) { await db.config.clear(); await db.config.add(data.config); }
      });
      // Fixed: Log level 'SUCCESS' is not a valid LogEntry['level'], using 'INFO' for success messages
      get().addLog('INFO', 'Core restaurado. Reiniciando mainframe...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      alert('FALLO EN LA INTEGRIDAD DEL BACKUP.');
    }
  }
}));
