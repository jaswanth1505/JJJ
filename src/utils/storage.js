// ============================================================================
// IndexedDB Storage Utility for Storing Jaya's Custom Photos Locally in Browser
// No external services, 100% private, persists on reload!
// ============================================================================

const DB_NAME = 'JayaBirthdayMemoriesDB';
const DB_VERSION = 1;
const STORE_NAME = 'memories';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getStoredMemories() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => {
        resolve([]);
      };
    });
  } catch (err) {
    console.warn('Could not read IndexedDB, checking localStorage fallback:', err);
    try {
      const raw = localStorage.getItem('jaya_memories_fallback');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export async function saveStoredMemories(memories) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();

      memories.forEach((mem) => {
        store.put(mem);
      });

      tx.oncomplete = () => {
        try {
          // Keep lightweight metadata in localStorage
          const metaOnly = memories.map((m) => ({ id: m.id, caption: m.caption, rotation: m.rotation }));
          localStorage.setItem('jaya_memories_meta', JSON.stringify(metaOnly));
        } catch (_) {}
        resolve(true);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed saving to IndexedDB, fallback saving:', err);
    try {
      localStorage.setItem('jaya_memories_fallback', JSON.stringify(memories));
      return true;
    } catch {
      return false;
    }
  }
}

export async function clearStoredMemories() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    localStorage.removeItem('jaya_memories_fallback');
    localStorage.removeItem('jaya_memories_meta');
  } catch (err) {
    console.error('Error clearing storage:', err);
  }
}
