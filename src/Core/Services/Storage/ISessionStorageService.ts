export interface ISessionStorageService {

  setItem<TKey extends string, TValue = unknown>(key: TKey, value: TValue): void;

  getItem<TKey extends string, TValue = unknown>(key: TKey): TValue;

  removeItem<TKey extends string>(key: TKey): void;

  clear(): void;

}
