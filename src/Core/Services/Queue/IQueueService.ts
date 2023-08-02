export interface IQueueService {

  push(callback: { (): void | Promise<void> }): void;

}
