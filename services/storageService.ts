import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, addDoc, onSnapshot, collection, query, orderBy, serverTimestamp, getDocs, writeBatch, Firestore } from 'firebase/firestore';
import { Result } from '../types';

// Use a safe global augmentation for the provided config strings
declare global {
    interface Window {
        __firebase_config?: string;
        __initial_auth_token?: string;
        __app_id?: string;
    }
}

const LOCAL_STORAGE_KEY = 'cda_local_history';

class StorageService {
    private db: Firestore | null = null;
    private authUser: User | null = null;
    private isOfflineMode = false;
    private appId = 'default';
    // Lista de funções para avisar quando o histórico mudar localmente
    private localListeners: ((history: Result[]) => void)[] = [];

    constructor() {
        // Attempt initialization
        try {
            const fbConfigStr = typeof window !== 'undefined' ? window.__firebase_config : null;
            this.appId = (typeof window !== 'undefined' ? window.__app_id : undefined) || 'default';

            if (fbConfigStr) {
                const config = JSON.parse(fbConfigStr);
                const app = initializeApp(config);
                this.db = getFirestore(app);
                const auth = getAuth(app);
                
                const token = typeof window !== 'undefined' ? window.__initial_auth_token : null;
                
                if (token) {
                    signInWithCustomToken(auth, token).catch(e => console.warn("Auth error", e));
                } else {
                    signInAnonymously(auth).catch(e => console.warn("Auth error", e));
                }

                onAuthStateChanged(auth, (user) => {
                    this.authUser = user;
                });
            } else {
                this.isOfflineMode = true;
            }
        } catch (e) {
            console.warn("Firebase init failed, falling back to offline mode", e);
            this.isOfflineMode = true;
        }
    }

    public isOffline() {
        return this.isOfflineMode;
    }

    public getUserId() {
        return this.authUser?.uid || 'offline-user';
    }

    public async saveResult(result: Omit<Result, 'id'>): Promise<Result> {
        if (this.isOfflineMode || !this.db || !this.authUser) {
            const newResult: Result = {
                ...result,
                id: Date.now(),
                date: new Date().toISOString()
            };
            const currentHistory = this.getLocalHistory();
            const newHistory = [newResult, ...currentHistory];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
            
            // Avisa a tela que o histórico mudou
            this.notifyLocalListeners();
            
            return newResult;
        }

        try {
            const docRef = await addDoc(collection(this.db, 'artifacts', this.appId, 'users', this.authUser.uid, 'cda_tests'), {
                ...result,
                date: serverTimestamp()
            });
            // Return a local-friendly version immediately for UI update
            return {
                ...result,
                id: docRef.id,
                date: new Date().toISOString()
            };
        } catch (error) {
            console.error("Error saving to cloud", error);
            throw error;
        }
    }

    public subscribeHistory(callback: (history: Result[]) => void): () => void {
        if (this.isOfflineMode || !this.db || !this.authUser) {
            // 1. Retorna o histórico atual imediatamente
            callback(this.getLocalHistory());
            
            // 2. Adiciona essa função na lista de "ouvintes" para ser chamada em futuras atualizações
            this.localListeners.push(callback);
            
            // 3. Retorna função para cancelar a inscrição (limpar memória)
            return () => {
                this.localListeners = this.localListeners.filter(listener => listener !== callback);
            };
        }

        try {
            const q = query(
                collection(this.db, 'artifacts', this.appId, 'users', this.authUser.uid, 'cda_tests'), 
                orderBy('date', 'desc')
            );
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const history = snapshot.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id,
                        ...data,
                        // Normalize timestamp
                        date: data.date?.toDate ? data.date.toDate().toISOString() : (data.date || new Date().toISOString())
                    } as Result;
                });
                callback(history);
            });
            return unsubscribe;
        } catch (e) {
            console.warn("Subscription failed", e);
            callback(this.getLocalHistory());
            return () => {};
        }
    }

    public async clearHistory(): Promise<void> {
        if (this.isOfflineMode || !this.db || !this.authUser) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            this.notifyLocalListeners();
            return;
        }

        try {
            const q = query(collection(this.db, 'artifacts', this.appId, 'users', this.authUser.uid, 'cda_tests'));
            const snapshot = await getDocs(q);
            const batch = writeBatch(this.db);
            snapshot.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
        } catch (e) {
            console.error("Error clearing history", e);
            throw e;
        }
    }

    private getLocalHistory(): Result[] {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    private notifyLocalListeners() {
        const history = this.getLocalHistory();
        this.localListeners.forEach(callback => callback(history));
    }
}

export const storageService = new StorageService();