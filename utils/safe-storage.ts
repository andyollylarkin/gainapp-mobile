import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";
import type { StateStorage } from "zustand/middleware";

const memoryFallback = new Map<string, string>();
const fallbackFile = new File(Paths.document, "safe-storage.json");

let fileCache: Record<string, string> | null = null;

async function readFileCache(): Promise<Record<string, string>> {
  if (fileCache) {
    return fileCache;
  }

  try {
    if (!fallbackFile.exists) {
      fileCache = {};
      return fileCache;
    }

    const content = await fallbackFile.text();
    fileCache = content ? (JSON.parse(content) as Record<string, string>) : {};
  } catch {
    fileCache = {};
  }

  return fileCache;
}

async function writeFileCache(next: Record<string, string>): Promise<void> {
  fileCache = next;

  try {
    if (!fallbackFile.exists) {
      fallbackFile.create({ overwrite: true, intermediates: true });
    }

    fallbackFile.write(JSON.stringify(next));
  } catch {
    // Keep in-memory cache if filesystem write is unavailable.
  }
}

function getLocalStorage(): Storage | null {
  try {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
      return globalThis.localStorage;
    }
  } catch {
    return null;
  }

  return null;
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    const localStorage = getLocalStorage();
    if (localStorage) {
      return localStorage.getItem(key);
    }

    const cachedFromFile = await readFileCache();
    if (key in cachedFromFile) {
      return cachedFromFile[key];
    }

    return memoryFallback.get(key) ?? null;
  }
}

export async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
    return;
  } catch {
    const localStorage = getLocalStorage();
    if (localStorage) {
      localStorage.setItem(key, value);
      return;
    }

    const cachedFromFile = await readFileCache();
    await writeFileCache({ ...cachedFromFile, [key]: value });

    memoryFallback.set(key, value);
  }
}

export async function safeRemoveItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
    return;
  } catch {
    const localStorage = getLocalStorage();
    if (localStorage) {
      localStorage.removeItem(key);
      return;
    }

    const cachedFromFile = await readFileCache();
    if (key in cachedFromFile) {
      const { [key]: _removed, ...next } = cachedFromFile;
      await writeFileCache(next);
    }

    memoryFallback.delete(key);
  }
}

export const safeStateStorage: StateStorage = {
  getItem: (name) => safeGetItem(name),
  setItem: (name, value) => safeSetItem(name, value),
  removeItem: (name) => safeRemoveItem(name),
};
