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
import { inject, injectable } from "inversify";
import { In } from "typeorm";
import { IProjectService } from "./IProjectService";
import { ProjectId } from "./Types";

@injectable()
export class ProjectService implements IProjectService {

  private readonly _databaseService: IDatabaseService;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _guidService: IGuidService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.GuidService) guidService: IGuidService
  ) {
    this._databaseService = databaseService;
    this._dateTimeService = dateTimeService;
    this._guidService = guidService;
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
          ?.sort((a, b): number => {
            return a.position - b.position;
          })
          ?.map<GetResultAction>(x => {
            return {
              id: x.action.id,
              color: x.action.color,
              name: x.action.name,
            };
          }) ?? [];

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
    return this._databaseService.execute(
      async(): Promise<GetAllResult> => {
        const data = await this._databaseService.projects().find();
        const items = data.map<GetAllResultItem>(x => {
          return {
            id: x.id,
            name: x.name,
          };
        });

        return {
          items,
        };
      }
    );
  }

  public async create(request: CreateProjectRequest): Promise<void> {
    return this._databaseService.execute(
      async(): Promise<void> => {
        // TODO: Use transaction
        const now = this._dateTimeService.now;
        const project = new Project();

        project.id = request.id;
        project.name = request.name;
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
    return this._databaseService.execute(
      async (): Promise<void> => {
        await this._databaseService.projects().delete(id);
      }
    );
  }

  public async update(request: UpdateProjectRequest): Promise<void> {
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

          // delete private actions
          const privateActionsToDelete = await this._databaseService.actions().find({
            where: {
              id: In(request.actionsToDelete),
              isGlobal: false,
            },
          });

          await this._databaseService.actions().delete(
            privateActionsToDelete.map((x: Action): string => x.id)
          );
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
      }
    );
  }

}
