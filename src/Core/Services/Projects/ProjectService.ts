import { ServiceIdentifier } from "@config";
import { Action, ActionInProject, IDatabaseService, Project } from "@data";
import {
  CreateProjectRequest,
  GetAllResult,
  GetAllResultItem,
  GetResult,
  GetResultAction,
  UpdateProjectRequest,
} from "@dto/Projects";
import { IDateTimeService } from "@services/DateTime";
import { IGuidService } from "@services/Guid";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { In } from "typeorm";
import { IProjectService } from "./IProjectService";
import { ProjectId } from "./Types";

@injectable()
export class ProjectService implements IProjectService {

  private readonly _databaseService: IDatabaseService;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _guidService: IGuidService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.GuidService) guidService: IGuidService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._databaseService = databaseService;
    this._dateTimeService = dateTimeService;
    this._guidService = guidService;
    this._loggerService = loggerService;
  }

  public get(id: ProjectId): Promise<GetResult> {
    return this._databaseService.execute(
      async(): Promise<GetResult> => {
        const project = await this._databaseService.projects()
          .findOneOrFail({
            where: { id },
            relations: {
              actionsInProjects: true,
            },
          });

        const actions = project.actionsInProjects
          ?.sort(
            (a: ActionInProject, b: ActionInProject): number => {
              return a.position - b.position;
            }
          )
          ?.map<GetResultAction>(
            (x: ActionInProject): GetResultAction => {
              return {
                id: x.action.id,
                color: x.action.color,
                name: x.action.name,
                position: x.position,
              };
            }
          ) ?? [];

        const result: GetResult = {
          id: project.id,
          name: project.name,
          createdDate: project.createdDate,
          actions,
        };

        return result;
      }
    );
  }

  public async getAll(): Promise<GetAllResult> {
    this._loggerService.debug(
      ProjectService.name,
      this.getAll.name
    );

    return this._databaseService.execute(
      async(): Promise<GetAllResult> => {
        const data = await this._databaseService.projects().find({
          where: {
            isDeleted: false,
          },
        });

        const items = data.map<GetAllResultItem>(
          (x: Project): GetAllResultItem => {
            return {
              id: x.id,
              name: x.name,
            };
          }
        );

        return {
          items,
        };
      }
    );
  }

  public async create(request: CreateProjectRequest): Promise<void> {
    this._loggerService.debug(
      ProjectService.name,
      this.create.name,
      "projectId",
      request.id,
      "projectName",
      request.name,
      "actions",
      request.actions.length
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        // TODO: Use transaction
        const now = this._dateTimeService.now;
        const project = new Project();

        project.id = request.id;
        project.name = request.name;
        project.isDeleted = false;
        project.createdDate = now;

        await this._databaseService.projects().save(project);

        if (request.actions?.length > 0) {
          for (const action of request.actions) {
            const globalAction = action.id
              ? await this._databaseService.actions().findOneByOrFail({ id: action.id, isGlobal: true })
              : undefined;

            if (globalAction) {
              const actionInProject = new ActionInProject();

              actionInProject.id = this._guidService.newGuid();
              actionInProject.project.id = project.id;
              actionInProject.actionId = globalAction.id;
              actionInProject.position = action.position;

              await this._databaseService.actionsInProjects().save(actionInProject);
            } else {
              const newAction = new Action();

              newAction.id = this._guidService.newGuid();
              newAction.color = action.color;
              newAction.name = action.name;
              newAction.isGlobal = false;
              newAction.isDeleted = false;
              newAction.createdDate = now;

              const createdAction = await this._databaseService.actions().save(newAction);

              const actionInProject = new ActionInProject();

              actionInProject.id = this._guidService.newGuid();
              actionInProject.projectId = project.id;
              actionInProject.actionId = createdAction.id;
              actionInProject.position = action.position;

              await this._databaseService.actionsInProjects().save(actionInProject);
            }
          }
        }
      }
    );
  }

  public async delete(id: ProjectId): Promise<void> {
    this._loggerService.debug(
      ProjectService.name,
      this.delete.name,
      "projectId",
      id
    );

    return this._databaseService.execute(
      async (): Promise<void> => {
        const project = await this._databaseService.projects()
          .findOneOrFail({
            where: {
              id,
            },
            relations: {
              actionsInProjects: true,
            },
          });

        project.isDeleted = true;

        await this._databaseService.projects().save(project);

        if (project.actionsInProjects && project.actionsInProjects.length > 0) {
          this._loggerService.debug(
            ProjectService.name,
            this.delete.name,
            "projectId",
            id,
            `Include ${project.actionsInProjects.length} relations.`
          );

          await this._databaseService.actionsInProjects().delete(
            project.actionsInProjects.map(
              (x: ActionInProject): string => {
                return x.id;
              }
            )
          );

          const actions = project.actionsInProjects
            .map(
              (x: ActionInProject): Action => {
                return x.action;
              }
            )
            .filter(
              (x: Action): boolean => {
                return !x.isGlobal && !x.isDeleted;
              }
            );

          actions.forEach(
            (x: Action): void => {
              x.isDeleted = true;
            }
          );

          if (actions?.length > 0) {
            this._loggerService.debug(
              ProjectService.name,
              this.delete.name,
              "projectId",
              id,
              `Include ${actions.length} actions.`
            );
          }

          await this._databaseService.actions().save(actions);
        }
      },
      `${ProjectService.name}.${this.delete.name}`
    );
  }

  public async update(request: UpdateProjectRequest): Promise<void> {
    this._loggerService.debug(
      ProjectService.name,
      this.update.name,
      "projectId",
      request.id
    );

    return this._databaseService.execute(
      async (): Promise<void> => {
        // TODO: Use transaction
        const now = this._dateTimeService.now;
        const project = await this._databaseService.projects()
          .findOneOrFail({
            where: {
              id: request.id,
            },
            relations: {
              actionsInProjects: true,
            },
          });

        project.name = request.name;

        await this._databaseService.projects().save(project);

        if (request.actionsToDelete?.length) {
          // delete references
          const actionsInProjectsToDelete = await this._databaseService.actionsInProjects().find({
            where: {
              projectId: project.id,
              actionId: In(request.actionsToDelete),
            },
          });

          await this._databaseService.actionsInProjects().delete(
            actionsInProjectsToDelete.map(
              (x: ActionInProject): string => {
                return x.id;
              }
            )
          );

          // mark as deleted private actions
          const privateActionsToDelete = await this._databaseService.actions().find({
            where: {
              id: In(request.actionsToDelete),
              isGlobal: false,
            },
          });

          privateActionsToDelete.forEach(
            (x: Action): void => {
              x.isDeleted = true;
            }
          );

          await this._databaseService.actions().save(privateActionsToDelete);
        }

        if (request.actions?.length > 0) {
          for (const action of request.actions) {
            const actionInProject = project.actionsInProjects?.find(
              (x: ActionInProject): boolean => {
                return x.action.id === action.id;
              }
            );

            const linked = !!actionInProject;

            const globalAction = action.id && !linked
              ? await this._databaseService.actions().findOneByOrFail({ id: action.id, isGlobal: true })
              : undefined;

            if (globalAction) {
              const newActionInProject = new ActionInProject();

              newActionInProject.id = this._guidService.newGuid();
              newActionInProject.projectId = project.id;
              newActionInProject.actionId = globalAction.id;
              newActionInProject.position = action.position;

              await this._databaseService.actionsInProjects().save(newActionInProject);
            } else {
              if (linked) {
                // update an existing reference
                actionInProject.action.color = action.color;
                actionInProject.action.name = action.name;
                actionInProject.position = action.position;

                await this._databaseService.actionsInProjects().save(actionInProject);
                await this._databaseService.actions().save(actionInProject.action);
              } else {
                // create new action and reference
                const newAction = new Action();

                newAction.id = this._guidService.newGuid();
                newAction.color = action.color;
                newAction.name = action.name;
                newAction.isGlobal = false;
                newAction.isDeleted = false;
                newAction.createdDate = now;

                const createdAction = await this._databaseService.actions().save(newAction);

                const newActionInProject = new ActionInProject();

                newActionInProject.id = this._guidService.newGuid();
                newActionInProject.projectId = project.id;
                newActionInProject.actionId = createdAction.id;
                newActionInProject.position = action.position;

                await this._databaseService.actionsInProjects().save(newActionInProject);
              }
            }
          }
        }
      },
      `${ProjectService.name}.${this.update.name}`
    );
  }

}
