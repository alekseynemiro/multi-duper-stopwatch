import { ServiceIdentifier } from "@config";
import {
  Activity,
  ActivityInProject,
  IDatabaseService,
  Project,
} from "@data";
import {
  AddActivityRequest,
  CreateProjectRequest,
  GetAllResult,
  GetAllResultItem,
  GetResult,
  GetResultActivity,
  UpdateActivityRequest,
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
              activitiesInProjects: true,
            },
          });

        const activities = project.activitiesInProjects
          ?.sort(
            (a: ActivityInProject, b: ActivityInProject): number => {
              return a.position - b.position;
            }
          )
          ?.map<GetResultActivity>(
            (x: ActivityInProject): GetResultActivity => {
              return {
                id: x.activity.id,
                color: x.activity.color ?? null,
                name: x.activity.name,
                position: x.position,
              };
            }
          ) ?? [];

        const result: GetResult = {
          id: project.id,
          name: project.name,
          createdDate: project.createdDate,
          activities,
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
      "activities",
      request.activities.length
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

        if (request.activities?.length > 0) {
          for (const activity of request.activities) {
            const globalActivity = activity.id
              ? await this._databaseService.activities().findOneByOrFail({ id: activity.id, isGlobal: true })
              : undefined;

            if (globalActivity) {
              const activityInProject = new ActivityInProject();

              activityInProject.id = this._guidService.newGuid();
              activityInProject.project.id = project.id;
              activityInProject.activityId = globalActivity.id;
              activityInProject.position = activity.position;

              await this._databaseService.activitiesInProjects().save(activityInProject);
            } else {
              const newActivity = new Activity();

              newActivity.id = this._guidService.newGuid();
              newActivity.color = activity.color ?? null;
              newActivity.name = activity.name;
              newActivity.isGlobal = false;
              newActivity.isDeleted = false;
              newActivity.createdDate = now;

              const createdActivity = await this._databaseService.activities().save(newActivity);

              const activityInProject = new ActivityInProject();

              activityInProject.id = this._guidService.newGuid();
              activityInProject.projectId = project.id;
              activityInProject.activityId = createdActivity.id;
              activityInProject.position = activity.position;

              await this._databaseService.activitiesInProjects().save(activityInProject);
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
              activitiesInProjects: true,
            },
          });

        project.isDeleted = true;

        await this._databaseService.projects().save(project);

        if (project.activitiesInProjects && project.activitiesInProjects.length > 0) {
          this._loggerService.debug(
            ProjectService.name,
            this.delete.name,
            "projectId",
            id,
            `Include ${project.activitiesInProjects.length} relations.`
          );

          await this._databaseService.activitiesInProjects().delete(
            project.activitiesInProjects.map(
              (x: ActivityInProject): string => {
                return x.id;
              }
            )
          );

          const activities = project.activitiesInProjects
            .map(
              (x: ActivityInProject): Activity => {
                return x.activity;
              }
            )
            .filter(
              (x: Activity): boolean => {
                return !x.isGlobal && !x.isDeleted;
              }
            );

          activities.forEach(
            (x: Activity): void => {
              x.isDeleted = true;
            }
          );

          if (activities?.length > 0) {
            this._loggerService.debug(
              ProjectService.name,
              this.delete.name,
              "projectId",
              id,
              `Include ${activities.length} activities.`
            );
          }

          await this._databaseService.activities().save(activities);
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
              activitiesInProjects: true,
            },
          });

        project.name = request.name;

        await this._databaseService.projects().save(project);

        if (request.activitiesToDelete?.length) {
          // delete references
          const activitiesInProjectsToDelete = await this._databaseService.activitiesInProjects().find({
            where: {
              projectId: project.id,
              activityId: In(request.activitiesToDelete),
            },
          });

          await this._databaseService.activitiesInProjects().delete(
            activitiesInProjectsToDelete.map(
              (x: ActivityInProject): string => {
                return x.id;
              }
            )
          );

          // mark as deleted private activities
          const privateActivitiesToDelete = await this._databaseService.activities().find({
            where: {
              id: In(request.activitiesToDelete),
              isGlobal: false,
            },
          });

          privateActivitiesToDelete.forEach(
            (x: Activity): void => {
              x.isDeleted = true;
            }
          );

          await this._databaseService.activities().save(privateActivitiesToDelete);
        }

        if (request.activities?.length > 0) {
          for (const activity of request.activities) {
            const activityInProject = project.activitiesInProjects?.find(
              (x: ActivityInProject): boolean => {
                return x.activity.id === activity.id;
              }
            );

            const linked = !!activityInProject;

            const globalActivity = activity.id && !linked
              ? await this._databaseService.activities().findOneByOrFail({ id: activity.id, isGlobal: true })
              : undefined;

            if (globalActivity) {
              const newActivityInProject = new ActivityInProject();

              newActivityInProject.id = this._guidService.newGuid();
              newActivityInProject.projectId = project.id;
              newActivityInProject.activityId = globalActivity.id;
              newActivityInProject.position = activity.position;

              await this._databaseService.activitiesInProjects().save(newActivityInProject);
            } else {
              if (linked) {
                // update an existing reference
                activityInProject.activity.color = activity.color ?? null;
                activityInProject.activity.name = activity.name;
                activityInProject.position = activity.position;

                await this._databaseService.activitiesInProjects().save(activityInProject);
                await this._databaseService.activities().save(activityInProject.activity);
              } else {
                // create new activity and reference
                const newActivity = new Activity();

                newActivity.id = this._guidService.newGuid();
                newActivity.color = activity.color ?? null;
                newActivity.name = activity.name;
                newActivity.isGlobal = false;
                newActivity.isDeleted = false;
                newActivity.createdDate = now;

                const createdActivity = await this._databaseService.activities().save(newActivity);

                const newActivityInProject = new ActivityInProject();

                newActivityInProject.id = this._guidService.newGuid();
                newActivityInProject.projectId = project.id;
                newActivityInProject.activityId = createdActivity.id;
                newActivityInProject.position = activity.position;

                await this._databaseService.activitiesInProjects().save(newActivityInProject);
              }
            }
          }
        }
      },
      `${ProjectService.name}.${this.update.name}`
    );
  }

  public addActivity(request: AddActivityRequest): Promise<void> {
    this._loggerService.debug(
      ProjectService.name,
      this.addActivity.name,
      "projectId",
      request.projectId,
      "activityId",
      request.activityId,
      "activityName",
      request.activityName,
      "activityColor",
      request.activityColor,
    );

    return this._databaseService.execute(
      async (): Promise<void> => {
        const activitiesInProject = await this._databaseService.activitiesInProjects()
          .find({
            where: {
              projectId: request.projectId,
            },
          });

        const activity = new Activity();

        activity.id = request.activityId;
        activity.color = request.activityColor ?? null;
        activity.name = request.activityName;
        activity.isDeleted = false;
        activity.isGlobal = false;
        activity.createdDate = this._dateTimeService.now;

        const activityInProject = new ActivityInProject();

        activityInProject.id = this._guidService.newGuid();
        activityInProject.activityId = request.activityId;
        activityInProject.projectId = request.projectId;
        activityInProject.position = activitiesInProject.length;

        await this._databaseService.activities().insert(activity);
        await this._databaseService.activitiesInProjects().insert(activityInProject);
      }
    );
  }

  public updateActivity(request: UpdateActivityRequest): Promise<void> {
    this._loggerService.debug(
      ProjectService.name,
      this.updateActivity.name,
      "projectId",
      request.projectId,
      "activityId",
      request.activityId,
      "activityName",
      request.activityName,
      "activityColor",
      request.activityColor,
    );

    return this._databaseService.execute(
      async (): Promise<void> => {
        const activity = await this._databaseService.activities().findOneOrFail({
          where: {
            id: request.activityId,
          },
        });

        activity.color = request.activityColor ?? null;
        activity.name = request.activityName;

        await this._databaseService.activities().save(activity);
      }
    );
  }

}
