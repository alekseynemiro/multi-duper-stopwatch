import { Container } from "inversify";
import { ILoggerService } from "../Core/Services/Logger";
import { LoggerService } from "../Core/Services/Logger/LoggerService";
import { ServiceIdentifier } from "./ServiceIdentifier";

const serviceProvider = new Container();

serviceProvider.bind<ILoggerService>(ServiceIdentifier.LoggerService).to(LoggerService).inSingletonScope();

export { serviceProvider };
