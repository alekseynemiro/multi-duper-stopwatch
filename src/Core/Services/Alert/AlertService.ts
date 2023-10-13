import { NativeEventSubscription } from "react-native";
import { ServiceIdentifier } from "@config";
import { AlertButton } from "@dto/Alert/AlertButton";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { AlertServiceEventArgs } from "./AlertServiceEventArgs";
import { AlertServiceEvents } from "./AlertServiceEvents";
import { AlertServiceEventType } from "./AlertServiceEventType";
import { IAlertService } from "./IAlertService";

@injectable()
export class AlertService implements IAlertService {

  private readonly _loggerService: ILoggerService;

  private _listeners = new Map<AlertServiceEventType, Array<AlertServiceEvents<any>>>();

  constructor(
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._loggerService = loggerService;
  }

  public show(title: string, message: string, buttons?: Array<AlertButton>): void {
    this._loggerService.debug(
      AlertService.name,
      this.show.name,
      "title",
      title,
      "message",
      message,
      "buttons",
      buttons
    );

    this.on(
      "show",
      {
        title,
        message,
        buttons: buttons?.map(x => {
          return {
            ...x,
            onPress: (): void => {
              x.onPress && x.onPress();
              this.close();
            },
          };
        }),
      }
    );
  }

  public close(): void {
    this._loggerService.debug(
      AlertService.name,
      this.close.name
    );

    this.on("close");
  }

  public addEventListener<TEventArgs extends AlertServiceEventArgs | undefined>(type: AlertServiceEventType, callback: AlertServiceEvents<TEventArgs>): NativeEventSubscription {
    this._loggerService.debug(
      AlertService.name,
      this.addEventListener.name,
      type
    );

    const eventType = this._listeners.get(type);

    this._listeners.set(
      type,
      [
        ...eventType ?? [],
        callback as AlertServiceEvents<TEventArgs>,
      ]
    );

    return {
      remove: (): void => {
        this.removeEventListener(type, callback);
      },
    };
  }

  public removeEventListener<TEventArgs extends AlertServiceEventArgs | undefined>(type: AlertServiceEventType, callback: AlertServiceEvents<TEventArgs>): void {
    this._loggerService.debug(
      AlertService.name,
      this.removeEventListener.name,
      type
    );

    const eventType = this._listeners.get(type) ?? [];
    const index = eventType?.indexOf(callback as AlertServiceEvents<TEventArgs>);

    if (index === -1) {
      throw new Error("Listener not found.");
    }

    eventType.splice(index, 1);
  }

  private on<TEventArgs = AlertServiceEventArgs>(type: AlertServiceEventType, args?: TEventArgs): void {
    this._loggerService.debug(
      AlertService.name,
      this.on.name,
      "type",
      type
    );

    const listeners = this._listeners.get(type);

    if (listeners) {
      for (const listener of listeners) {
        listener(args as AlertServiceEventArgs);
      }
    }
  }

}
