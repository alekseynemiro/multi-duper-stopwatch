import { ServiceIdentifier } from "@config";
import { Goal, GoalInProject, IDatabaseService, Project } from "@data";
import {
  CreateProjectRequest,
  GetAllResult,
  GetAllResultItem,
  GetResult,
  GetResultGoal,
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
              goalsInProjects: true,
            },
          });

        const goals = project.goalsInProjects
          ?.sort((a, b): number => {
            return a.position - b.position;
          })
          ?.map<GetResultGoal>(x => {
            return {
              id: x.goal.id,
              color: x.goal.color,
              name: x.goal.name,
            };
          }) ?? [];

        const result: GetResult = {
          id: project.id,
          name: project.name,
          createdDate: project.createdDate,
          goals,
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
        const now = this._dateTimeService.now;
        const project = new Project();

        project.id = request.id;
        project.name = request.name;
        project.createdDate = now;

        await this._databaseService.projects().save(project);

        if (request.goals?.length > 0) {
          for (const goal of request.goals) {
            const globalGoal = goal.id
            ? await this._databaseService.goals().findOneByOrFail({ id: goal.id, isGlobal: true })
            : undefined;

            if (globalGoal) {
              const goalInProject = new GoalInProject();

              goalInProject.id = this._guidService.newGuid();
              goalInProject.project = project;
              goalInProject.goal = globalGoal;
              goalInProject.position = goal.position;

              await this._databaseService.goalsInProjects().save(goalInProject);
            } else {
              const newGoal = new Goal();

              newGoal.id = this._guidService.newGuid();
              newGoal.color = goal.color;
              newGoal.name = goal.name;
              newGoal.isGlobal = false;
              newGoal.createdDate = now;

              const createdGoal = await this._databaseService.goals().save(newGoal);

              const goalInProject = new GoalInProject();

              goalInProject.id = this._guidService.newGuid();
              goalInProject.project = project;
              goalInProject.goal = createdGoal;
              goalInProject.position = goal.position;

              await this._databaseService.goalsInProjects().save(goalInProject);
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
              goalsInProjects: true,
            },
          });

        project.name = request.name;

        await this._databaseService.projects().save(project);

        if (request.goalsToDelete?.length) {
          // delete references
          const goalsInProjectsToDelete = await this._databaseService.goalsInProjects().find({
            where: {
              projectId: project.id,
              goalId: In(request.goalsToDelete),
            },
          });

          await this._databaseService.goalsInProjects().delete(
            goalsInProjectsToDelete.map(
              (x: GoalInProject): string => {
                return x.id;
              }
            )
          );

          // delete private goals
          const privateGoalsToDelete = await this._databaseService.goals().find({
            where: {
              id: In(request.goalsToDelete),
              isGlobal: false,
            },
          });

          await this._databaseService.goals().delete(
            privateGoalsToDelete.map((x: Goal): string => x.id)
          );
        }

        if (request.goals?.length > 0) {
          for (const goal of request.goals) {
            const goalInProject = project.goalsInProjects?.find(
              (x: GoalInProject): boolean => {
                return x.goal.id === goal.id;
              }
            );

            const linked = !!goalInProject;

            const globalGoal = goal.id && !linked
              ? await this._databaseService.goals().findOneByOrFail({ id: goal.id, isGlobal: true })
              : undefined;

            if (globalGoal) {
              const newGoalInProject = new GoalInProject();

              newGoalInProject.id = this._guidService.newGuid();
              newGoalInProject.projectId = project.id;
              newGoalInProject.goalId = globalGoal.id;
              newGoalInProject.position = goal.position;

              await this._databaseService.goalsInProjects().save(newGoalInProject);
            } else {
              if (linked) {
                // update an existing reference
                goalInProject.goal.color = goal.color;
                goalInProject.goal.name = goal.name;
                goalInProject.position = goal.position;

                await this._databaseService.goalsInProjects().save(goalInProject);
                await this._databaseService.goals().save(goalInProject.goal);
              } else {
                // create new goal and reference
                const newGoal = new Goal();

                newGoal.id = this._guidService.newGuid();
                newGoal.color = goal.color;
                newGoal.name = goal.name;
                newGoal.isGlobal = false;
                newGoal.createdDate = now;

                const createdGoal = await this._databaseService.goals().save(newGoal);

                const newGoalInProject = new GoalInProject();

                newGoalInProject.id = this._guidService.newGuid();
                newGoalInProject.projectId = project.id;
                newGoalInProject.goalId = createdGoal.id;
                newGoalInProject.position = goal.position;

                await this._databaseService.goalsInProjects().save(newGoalInProject);
              }
            }
          }
        }
      }
    );
  }

}
