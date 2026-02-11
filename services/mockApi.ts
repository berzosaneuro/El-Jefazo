
import { Clone, MarketplaceClone, CloneStatus, ServerStatus } from '../types';

const MOCK_CLONES: MarketplaceClone[] = [
  { 
    id: 'cl_001', 
    name: 'CRM_NEON', 
    description: 'Advanced customer management with cyber-link.', 
    category: 'BUSINESS', 
    version: '2.4.0', 
    size: '150MB',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'cl_002', 
    name: 'LOGISTIC_GRID', 
    description: 'Supply chain management through the mainframe.', 
    category: 'LOGISTICS', 
    version: '1.2.1', 
    size: '210MB',
    imageUrl: 'https://images.unsplash.com/photo-1580674271108-0335c9105281?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'cl_003', 
    name: 'CRYPTO_VAULT', 
    description: 'High-security digital asset guardian.', 
    category: 'SECURITY', 
    version: '4.0.5', 
    size: '85MB',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'cl_004', 
    name: 'SENTINEL_AI', 
    description: 'Neural network monitoring system.', 
    category: 'AI', 
    version: '0.9.8', 
    size: '500MB',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80'
  },
];

export const mockApi = {
  fetchClones: async (): Promise<Clone[]> => {
    return []; // Start empty, loaded from DB
  },
  
  fetchMarketplaceClones: async (): Promise<MarketplaceClone[]> => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_CLONES;
  },

  checkUpdates: async (clones: Clone[]): Promise<{id: string, newVersion: string}[]> => {
    await new Promise(r => setTimeout(r, 1200));
    return clones.map(c => {
      // Simulate that some clones have updates
      if (Math.random() > 0.5) {
        const [major, minor, patch] = c.versionInstalled.split('.').map(Number);
        return { id: c.id, newVersion: `${major}.${minor}.${patch + 1}` };
      }
      return { id: c.id, newVersion: c.versionInstalled };
    });
  },

  runUpdate: async (id: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 2000));
    return 'SUCCESS';
  }
};
