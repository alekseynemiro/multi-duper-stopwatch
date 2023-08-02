export interface IJsonService {

  serialize<T>(value: T): string;

  deserialize<T>(value: string): T;

}
