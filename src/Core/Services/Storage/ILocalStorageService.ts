export interface ILocalStorageService {

  setItem<TKey extends string, TValue = unknown>(key: TKey, value: TValue): Promise<void>;

  getItem<TKey extends string, TValue = unknown>(key: TKey): Promise<TValue>;

  removeItem<TKey extends string>(key: TKey): Promise<void>;

  clear(): Promise<void>;

}
