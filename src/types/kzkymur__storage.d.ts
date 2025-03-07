declare module '@kzkymur/storage' {
  export default class StorageJs<T = unknown> {
    constructor(options: { name: string; storage: Storage });
    get(key: string): T | null;
    set(value: T, key: string): void;
  }
}

declare module '@kzkymur/storage/react' {
  export function useStorageUnique<T>(
    storage: StorageJs,
    key: string
  ): [T, (value: T) => void];
}