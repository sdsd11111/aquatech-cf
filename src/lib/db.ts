import Dexie, { type Table } from 'dexie';

export interface OutboxItem {
  id?: number;
  type: 'MESSAGE' | 'EXPENSE' | 'DAY_START' | 'DAY_END' | 'PHASE_COMPLETE' | 'MEDIA_UPLOAD';
  projectId: number;
  payload: any;
  timestamp: number;
  lat: number | null;
  lng: number | null;
  status: 'pending' | 'syncing' | 'failed';
}

export interface AuthCache {
  id: string; // 'last_session'
  username: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR';
  userId: string;
  lastLogin: number;
}

export class OfflineDatabase extends Dexie {
  outbox!: Table<OutboxItem>;
  auth!: Table<AuthCache>;

  constructor() {
    super('AquatechOfflineDB');
    this.version(2).stores({
      outbox: '++id, projectId, status, timestamp',
      auth: 'id'
    });
  }
}

export const db = new OfflineDatabase();
