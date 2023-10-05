import
  React,
  {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
  } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { PluralFormatter } from "@components/PluralFormatter";
import { TableRowSeparator } from "@components/TableRowSeparator";
import {
  AppState,
  Routes,
  useAlertService,
  useLocalizationService,
  useLoggerService,
  useProjectService,
  useSessionLogService,
  useSessionService,
  useSessionStorageService,
} from "@config";
import { ColorPalette } from "@data";
import { GetResultActivity } from "@dto/Projects";
import { GetAllResultItem } from "@dto/SessionLogs";
import { SessionStorageKeys } from "@types";
import { getBackdropColorCode } from "@utils/ColorPaletteUtils";
import { useRoute } from "@utils/NavigationUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import {
  CurrentActivity,
  FilterModal,
  ReplaceModal,
  ReportViewItem,
  ReportViewItemPopupMenu,
  ReportViewItemPopupMenuMethods,
  ReportViewItemPopupMenuPressEventArgs,
  ReportViewItemPressEventArgs,
  Total,
} from "./Components";
import {
  ActivityModel,
  CurrentActivityModel,
  FilteredActivityModel,
  ReportItemModel,
  ReportViewStateModel,
} from "./Models";
import { ReportViewProps } from "./ReportViewProps";
import { reportViewStyles } from "./ReportViewStyles";

export const ReportView = forwardRef((props: ReportViewProps, ref: React.ForwardedRef<unknown>): JSX.Element => {
  const {
    sessionId,
    autoScrollToBottom,
    isActiveProject,
    onLoad,
    onReportItemDeleted,
  } = props;

  const route = useRoute();
  const localization = useLocalizationService();
  const projectService = useProjectService();
  const sessionService = useSessionService();
  const sessionLogService = useSessionLogService();
  const sessionStorageService = useSessionStorageService();
  const loggerService = useLoggerService();
  const alertService = useAlertService();

  const isHome = !route.path || route.path === Routes.Home;
  const colorized = useSelector((x: AppState): boolean => x.common.colorized);
  const color = useSelector((x: AppState): ColorPalette | null => x.common.color);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const reportViewItemPopupMenuRef = useRef<ReportViewItemPopupMenuMethods>();

  const [state, setState] = useState<ReportViewStateModel>({
    showLoadingIndicator: true,
    activities: [],
    logs: [],
    outputLogs: [],
    groupedActivities: new Map<string, ActivityModel>(),
    filterByActivities: [],
    outputTotalTime: 0,
    totalTime: 0,
    currentActivity: undefined,
    showFilterModal: false,
    showReplaceModal: false,
    selectedReportItem: undefined,
  });

  loggerService.debug(
    "ReportView",
    "render"
  );

  const scrollToBottom = useCallback(
    (): void => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    },
    [
      scrollViewRef,
    ]
  );

  const load = useCallback(
    async(): Promise<void> => {
      loggerService.debug(
        "ReportView",
        "load"
      );

      setState({
        ...state,
        showLoadingIndicator: true,
      });

      if (!sessionId) {
        throw new Error("'sessionId' is required. Value must not be empty.");
      }

      const session = await sessionService.get(sessionId);
      const project = await projectService.get(session.projectId);
      const data = await sessionLogService.getAll(sessionId);

      let totalTime = 0;

      const activities = project.activities?.map(
        (x: GetResultActivity): ActivityModel => {
          return {
            id: x.id,
            color: x.color,
            name: x.name,
          };
        }
      ) ?? [];

      const groupedActivities = new Map<string, ActivityModel>();
      const logs = data.items.map(
        (x: GetAllResultItem): ReportItemModel => {
          totalTime += x.elapsedTime;

          groupedActivities.set(
            x.activityId,
            {
              id: x.activityId,
              color: x.activityColor,
              name: x.activityName,
            }
          );

          return {
            id: x.id,
            activityId: x.activityId,
            name: x.activityName,
            color: x.activityColor,
            avgSpeed: x.avgSpeed,
            elapsedTime: x.elapsedTime,
            maxSpeed: x.maxSpeed,
            distance: x.distance,
            startDate: x.startDate,
            finishDate: x.finishDate,
          };
        }
      );

      let outputTotalTime = 0;
      let outputLogs: Array<ReportItemModel> = [];
      let filterByActivities: Array<FilteredActivityModel> = [];

      const storedFilters = sessionStorageService.getItem<SessionStorageKeys, Array<string>>(
        "activeProject.reportFilters"
      );

      if (isActiveProject && storedFilters?.length > 0) {
        filterByActivities = Array.from(groupedActivities.values())
          .filter(
            (x: ActivityModel): boolean => {
              return storedFilters.includes(x.id);
            }
          )
          .map(
            (x: ActivityModel): FilteredActivityModel => {
              return {
                id: x.id,
                color: x.color,
              };
            }
          );

          outputLogs = logs.filter(
            (x: ReportItemModel): boolean => {
              const filtered = storedFilters.includes(x.activityId);

              if (filtered) {
                outputTotalTime += x.elapsedTime;
                return true;
              }

              return false;
            }
          );
      } else {
        outputTotalTime = totalTime;
        outputLogs = logs;
      }

      setState({
        ...state,
        activities,
        logs,
        totalTime,
        groupedActivities,
        outputTotalTime,
        outputLogs,
        showLoadingIndicator: false,
        filterByActivities,
      });

      if (autoScrollToBottom) {
        scrollToBottom();
      }

      onLoad && onLoad();
    },
    [
      state,
      sessionId,
      autoScrollToBottom,
      projectService,
      sessionService,
      sessionLogService,
      sessionStorageService,
      loggerService,
      isActiveProject,
      onLoad,
      scrollToBottom,
    ]
  );

  const addItem = useCallback(
    (item: ReportItemModel): void => {
      loggerService.debug(
        "ReportView",
        "addItem",
        item
      );

      let newOutputLogs: Array<ReportItemModel> | undefined;
      let outputTotal = 0;

      const newLogs: Array<ReportItemModel> = [
        ...state.logs,
        {
          id: item.id,
          activityId: item.activityId,
          avgSpeed: item.avgSpeed,
          color: item.color,
          distance: item.distance,
          elapsedTime: item.elapsedTime,
          finishDate: item.finishDate,
          maxSpeed: item.maxSpeed,
          name: item.name,
          startDate: item.startDate,
        },
      ];

      if (state.filterByActivities.length > 0) {
        newOutputLogs = newLogs.filter(
          (x: ReportItemModel): boolean => {
            const filtered = state.filterByActivities.some(
              (xx: FilteredActivityModel): boolean => {
                return xx.id === x.activityId;
              }
            );

            if (filtered) {
              outputTotal += x.elapsedTime;
              return true;
            }

            return false;
          }
        );
      } else {
        outputTotal = state.totalTime + item.elapsedTime;
        newOutputLogs = newLogs;
      }

      const newGroupedActivities = new Map(
        Array.from(state.groupedActivities.values()).map(
          (x: ActivityModel): [string, ActivityModel] => {
            return [x.id, x];
          }
        )
      );

      newGroupedActivities.set(
        item.activityId,
        {
          id: item.activityId,
          color: item.color,
          name: item.name,
        }
      );

      setState({
        ...state,
        logs: newLogs,
        outputLogs: newOutputLogs,
        groupedActivities: newGroupedActivities,
        totalTime: state.totalTime + item.elapsedTime,
        outputTotalTime: outputTotal,
      });

      if (autoScrollToBottom) {
        scrollToBottom();
      }
    },
    [
      state,
      autoScrollToBottom,
      loggerService,
      scrollToBottom,
    ]
  );

  const addCurrentActivity = useCallback(
    (item: CurrentActivityModel): void => {
      loggerService.debug(
        "ReportView",
        "addCurrentActivity",
        item
      );

      setState({
        ...state,
        currentActivity: item,
      });
    },
    [
      state,
      loggerService,
    ]
  );

  const clearCurrentActivity = useCallback(
    (): void => {
      setState({
        ...state,
        currentActivity: undefined,
      });
    },
    [
      state,
    ]
  );

  const clearFilter = useCallback(
    (): void => {
      setState({
        ...state,
        filterByActivities: [],
        outputLogs: state.logs,
        outputTotalTime: state.totalTime,
        showFilterModal: false,
      });

      if (isActiveProject) {
        sessionStorageService.removeItem<SessionStorageKeys>("activeProject.reportFilters");
      }
    },
    [
      state,
      isActiveProject,
      sessionStorageService,
    ]
  );

  const renderItemPressHandler = useCallback(
    ({ activityId }: ReportViewItemPressEventArgs): void => {
      if (!state.groupedActivities.has(activityId)) {
        return;
      }

      // TODO: simplify
      let outputTotal = 0;

      const isFiltered = state.filterByActivities.some(
        (x: FilteredActivityModel): boolean => {
          return x.id === activityId;
        }
      );

      const newFilteredByActivities = isFiltered
        ? state.filterByActivities.filter(
            (x: FilteredActivityModel): boolean => {
              return x.id !== activityId;
            }
          )
        : [
          ...state.filterByActivities,
          {
            id: activityId,
            color: state.groupedActivities.get(activityId)?.color ?? null,
          },
        ];

      const newOutputLogs = newFilteredByActivities.length > 0
        ? state.logs
            .filter(
              (x: ReportItemModel): boolean => {
                const filtered = newFilteredByActivities.some(
                  (xx: FilteredActivityModel): boolean => {
                    return xx.id === x.activityId;
                  }
                );

                if (filtered) {
                  outputTotal += x.elapsedTime;
                  return true;
                }

                return false;
              }
            )
          : state.logs;

      if (newFilteredByActivities.length === 0) {
        outputTotal = state.totalTime;
      }

      setState({
        ...state,
        filterByActivities: newFilteredByActivities,
        outputLogs: newOutputLogs,
        outputTotalTime: outputTotal,
        showFilterModal: false,
      });
    },
    [
      state,
    ]
  );

  const renderItemLongPressHandler = useCallback(
    ({ id }: ReportViewItemPressEventArgs): void => {
      if (!reportViewItemPopupMenuRef.current) {
        throw new Error("Popup menu ref is empty.");
      }

      reportViewItemPopupMenuRef.current.open(id);
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ReportItemModel>): React.ReactElement => {
      return (
        <ReportViewItem
          id={item.id}
          activityId={item.activityId}
          activityColor={item.color}
          activityName={item.name}
          elapsedTime={item.elapsedTime}
          onPress={renderItemPressHandler}
          onLongPress={renderItemLongPressHandler}
        />
      );
    },
    [
      renderItemPressHandler,
      renderItemLongPressHandler,
    ]
  );

  const keyExtractor = useCallback(
    (item: ReportItemModel): string => {
      return item.id;
    },
    []
  );

  const getItemLayout = useCallback(
    (
      data: Array<ReportItemModel> | null | undefined,
      index: number
    ): { length: number, offset: number, index: number } => {
      return {
        index,
        length: reportViewStyles.tableRow.height,
        offset: reportViewStyles.tableRow.height * index,
      };
    },
    []
  );

  const renderHeader = useCallback(
    (): JSX.Element => {
      return (
        <View
          style={[
            reportViewStyles.tableRowHeader,
            isHome && colorized && color !== null
              ? {
                backgroundColor: getBackdropColorCode(color),
              }
              : undefined,
          ]}
        >
          <View
            style={reportViewStyles.nameCol}
          >
            <Text
              style={reportViewStyles.tableHeaderText}
            >
              {localization.get("report.activity")}
            </Text>
          </View>
          <View
            style={reportViewStyles.elapsedCol}
          >
            <Text
              style={reportViewStyles.tableHeaderText}
            >
              <Icon
                name="elapsed-time"
              />
              {" "}
              {localization.get("report.time")}
            </Text>
          </View>
        </View>
      );
    },
    [
      localization,
      colorized,
      color,
      isHome,
    ]
  );

  const renderFooter = useCallback(
    (): JSX.Element => {
      const realTimeUpdate = !!state.currentActivity
      && (
        state.filterByActivities.length === 0
        || state.filterByActivities.some(
          (x: FilteredActivityModel): boolean => {
            return x.id === state.currentActivity?.id;
          }
        )
      );

      return (
        <View
          style={reportViewStyles.footer}
        >
          {
            state.currentActivity
              && (
                <>
                  <TableRowSeparator />
                  <CurrentActivity
                    activityId={state.currentActivity.id}
                    activityColor={state.currentActivity.color}
                    activityName={state.currentActivity.name}
                    onPress={renderItemPressHandler}
                  />
                </>
              )
          }
          <TableRowSeparator />
          <Total
            activities={state.filterByActivities}
            realTimeUpdate={realTimeUpdate}
            basedOnElapsed={realTimeUpdate && state.filterByActivities.length > 0}
            elapsed={getTimeSpan(state.outputTotalTime)}
          />
          {
            state.filterByActivities.length > 0
            && (
              <View
                style={reportViewStyles.filter}
              >
                <View
                  style={reportViewStyles.filterTextContainer}
                >
                  <PluralFormatter
                    value={state.filterByActivities.length}
                    one={localization.get("report.filteredByOneActivity", { count: state.filterByActivities.length })}
                    few={localization.get("report.filteredByFewActivity", { count: state.filterByActivities.length })}
                    other={localization.get("report.filteredByOtherActivities", { count: state.filterByActivities.length })}
                    style={reportViewStyles.filterText}
                  />
                </View>
                <View
                  style={reportViewStyles.filterButtonsContainer}
                >
                  <Button
                    variant="light"
                    title={localization.get("report.changeFilter")}
                    style={reportViewStyles.filterButton}
                    onPress={(): void => {
                      setState({
                        ...state,
                        showFilterModal: true,
                      });
                    }}
                  />
                  <Button
                    variant="light"
                    title={localization.get("report.clearFilter")}
                    style={reportViewStyles.filterButton}
                    onPress={clearFilter}
                  />
                </View>
              </View>
            )
          }
          {
            state.filterByActivities.length === 0
            && state.logs.length > 0
            && (
              <View
                style={reportViewStyles.filter}
              >
                <Button
                  variant="light"
                  title={localization.get("report.setFilter")}
                  onPress={(): void => {
                    setState({
                      ...state,
                      showFilterModal: true,
                    });
                  }}
                />
              </View>
            )
          }
        </View>
      );
    },
    [
      state,
      localization,
      renderItemPressHandler,
      clearFilter,
    ]
  );

  const deleteItem = useCallback(
    async(id: string): Promise<void> => {
      if (!id) {
        throw new Error("'id' cannot be empty.");
      }

      const logEntry = state.logs.find(
        (x: ReportItemModel): boolean => {
          return x.id === id;
        }
      );

      if (!logEntry) {
        throw new Error(`Log entry #${id} not found.`);
      }

      await sessionLogService.delete(id!);

      let newTotalTime = 0;
      let newOutputTotalTime = 0;
      let newOutputLogs: Array<ReportItemModel> = [];

      const newFilterByActivities: Array<FilteredActivityModel> = [];
      const newGroupedActivities = new Map<string, ActivityModel>();
      const newLogs = [...state.logs]
        .filter(
          (x: ReportItemModel): boolean => {
            if (x.id === id) {
              return false;
            }

            newGroupedActivities.set(
              x.activityId,
              {
                id: x.activityId,
                color: x.color,
                name: x.name,
              }
            );

            if (
              state.filterByActivities.some(
                (xx: FilteredActivityModel): boolean => xx.id === x.activityId
              )
              && !newFilterByActivities.some(
                (xx: FilteredActivityModel): boolean => xx.id === x.activityId
              )
            ) {
              newFilterByActivities.push({
                id: x.activityId,
                color: x.color,
              });
            }

            newTotalTime += x.elapsedTime;

            return true;
          }
        );

      if (newFilterByActivities.length > 0) {
        newOutputLogs = newLogs.filter(
          (x: ReportItemModel): boolean => {
            const filtered = newFilterByActivities.some(
              (xx: FilteredActivityModel): boolean => {
                return xx.id === x.activityId;
              }
            );

            if (filtered) {
              newOutputTotalTime += x.elapsedTime;
              return true;
            }

            return false;
          }
        );
      } else {
        newOutputLogs = newLogs;
        newOutputTotalTime = newTotalTime;
      }

      setState({
        ...state,
        logs: newLogs,
        totalTime: newTotalTime,
        groupedActivities: newGroupedActivities,
        filterByActivities: newFilterByActivities,
        outputLogs: newOutputLogs,
        outputTotalTime: newOutputTotalTime,
      });

      onReportItemDeleted && onReportItemDeleted({
        id,
        elapsedTime: logEntry.elapsedTime,
      });
    },
    [
      state,
      sessionLogService,
      onReportItemDeleted,
    ]
  );

  const requestToDeleteReportItem = useCallback(
    (id: string): void => {
      if (!state.logs.length) {
        throw new Error("Log is empty.");
      }

      const logEntry = state.logs.find(
        (x: ReportItemModel): boolean => {
          return x.id === id;
        }
      );

      if (!logEntry) {
        throw new Error(`Log entry #${id} not found.`);
      }

      alertService.show(
        localization.get("report.reportItemDeleteConfirmation.title"),
        localization.get(
          "report.reportItemDeleteConfirmation.message",
          {
            activityName: logEntry.name,
            elapsedTime: getTimeSpan(logEntry.elapsedTime).displayValue,
          }
        ),
        [
          {
            text: localization.get("report.reportItemDeleteConfirmation.cancel"),
            variant: "secondary",
          },
          {
            text: localization.get("report.reportItemDeleteConfirmation.delete"),
            variant: "danger",
            onPress: (): Promise<void> => {
              return deleteItem(id);
            },
          },
        ]
      );
    },
    [
      state,
      localization,
      alertService,
      deleteItem,
    ]
  );

  const replaceWithActivity = useCallback(
    async(reportItemId: string, newActivityId: string): Promise<void> => {
      await sessionLogService.replaceWithActivity(reportItemId, newActivityId);

      const newActivity = state.activities.find(
        (x: ActivityModel): boolean => {
          return x.id === newActivityId;
        }
      );

      if (!newActivity) {
        throw new Error(`Activity #${newActivityId} not found.`);
      }

      const newLogs = [...state.logs].map(
        (x: ReportItemModel): ReportItemModel => {
          if (x.id === reportItemId) {
            return {
              ...x,
              activityId: newActivityId,
              color: newActivity.color,
              name: newActivity.name,
            };
          }

          return x;
        }
      );

      let newOutputLogs: Array<ReportItemModel> = [];
      let newOutputTotalTime = 0;

      const newGroupedActivities = new Map<string, ActivityModel>();
      const newFilterByActivities: Array<FilteredActivityModel> = [];

      newLogs.forEach(
        (x: ReportItemModel): void => {
          if (!newGroupedActivities.has(x.activityId)) {
            newGroupedActivities.set(
              x.activityId,
              {
                id: x.activityId,
                color: x.color,
                name: x.name,
              }
            );
          }
        }
      );

      state.filterByActivities.forEach(
        (x: FilteredActivityModel): void => {
          if (newGroupedActivities.has(x.id)) {
            newFilterByActivities.push({
              id: x.id,
              color: x.color,
            });
          }
        }
      );

      if (newFilterByActivities.length > 0) {
        newOutputLogs = newLogs.filter(
          (x: ReportItemModel): boolean => {
            const filtered = newFilterByActivities.some(
              (xx: FilteredActivityModel): boolean => {
                return xx.id === x.activityId;
              }
            );

            if (filtered) {
              newOutputTotalTime += x.elapsedTime;
              return true;
            }

            return false;
          }
        );
      } else {
        newOutputLogs = newLogs;
        newOutputTotalTime = state.totalTime;
      }

      setState({
        ...state,
        logs: newLogs,
        outputLogs: newOutputLogs,
        outputTotalTime: newOutputTotalTime,
        groupedActivities: newGroupedActivities,
        filterByActivities: newFilterByActivities,
        showReplaceModal: false,
      });
    },
    [
      state,
      sessionLogService,
    ]
  );

  const handleReportItemPopupMenuItemPress = useCallback(
    (e: ReportViewItemPopupMenuPressEventArgs): void => {
      switch (e.action) {
        case "replace": {
          setState({
            ...state,
            selectedReportItem: state.logs.find(
              (x: ReportItemModel): boolean => {
                return x.id === e.id;
              }
            ),
            showReplaceModal: true,
          });
          break;
        }
        case "delete": {
          requestToDeleteReportItem(e.id!);
          break;
        }
        case "delete-forced": {
          deleteItem(e.id!);
          break;
        }
        default: {
          throw new Error(`Unknown action ${e.action}.`);
        }
      }
    },
    [
      state,
      requestToDeleteReportItem,
      deleteItem,
    ]
  );

  useImperativeHandle(
    ref,
    (): ReportViewProps => {
      return {
        sessionId,
        load,
        addItem,
        addCurrentActivity,
        clearCurrentActivity,
      };
    }
  );

  useEffect(
    (): void => {
      load();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (state.showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <View
      style={[
        reportViewStyles.container,
        isHome && colorized && color !== null
          ? {
            backgroundColor: getBackdropColorCode(color),
          }
          : undefined,
      ]}
    >
      {
        state.outputLogs.length > 0
        && (
          <View
            style={reportViewStyles.table}
          >
            <FlatList<ReportItemModel>
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={20}
              initialNumToRender={20}
              data={state.outputLogs}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              renderItem={renderItem}
              ItemSeparatorComponent={TableRowSeparator}
              ListHeaderComponent={renderHeader}
              stickyHeaderIndices={[0]}
            />
          </View>
        )
      }

      {
        state.outputLogs.length === 0
        && (
          <View
            style={reportViewStyles.noData}
          >
            <Text
              style={reportViewStyles.noDataText}
            >
              {localization.get("report.noData")}
            </Text>
            {
              state.logs.length === 0
              && (
                <Text
                  style={reportViewStyles.noDataText}
                >
                  {localization.get("report.finishAnyActivity")}
                </Text>
              )
            }
            {
              state.filterByActivities.length > 0
              && state.logs.length > 0
              && (
                <>
                  <Text
                    style={reportViewStyles.noDataText}
                  >
                    {localization.get("report.tryToResetFilter")}
                  </Text>
                  <Button
                    variant="secondary"
                    title={localization.get("report.resetFilter")}
                    onPress={clearFilter}
                  />
                </>
              )
            }
          </View>
        )
      }

      {renderFooter()}

      <FilterModal
        show={state.showFilterModal}
        activities={Array.from(state.groupedActivities.values())}
        selected={
          state.filterByActivities.map(
            (x: FilteredActivityModel): string => {
              return x.id;
            }
          )
        }
        onSave={(activities: Array<string>): void => {
          if (activities.length === 0) {
            clearFilter();
            return;
          }

          let outputTotal = 0;

          const newFilteredByActivities = Array.from(state.groupedActivities.values())
            .filter(
              (x: ActivityModel): boolean => {
                return activities.includes(x.id);
              }
            )
            .map<FilteredActivityModel>(
              (x: ActivityModel): FilteredActivityModel => {
                return {
                  color: x.color,
                  id: x.id,
                };
              }
            );

          const newOutputLogs = state.logs.filter(
            (x: ReportItemModel): boolean => {
              const filtered = newFilteredByActivities.some(
                (xx: FilteredActivityModel): boolean => {
                  return xx.id === x.activityId;
                }
              );

              if (filtered) {
                outputTotal += x.elapsedTime;
                return true;
              }

              return false;
            }
          );

          setState({
            ...state,
            filterByActivities: newFilteredByActivities,
            outputLogs: newOutputLogs,
            outputTotalTime: outputTotal,
            showFilterModal: false,
          });

          if (isActiveProject) {
            sessionStorageService.setItem<SessionStorageKeys>(
              "activeProject.reportFilters",
              newFilteredByActivities.map(
                (x: FilteredActivityModel): string => {
                  return x.id;
                }
              )
            );
          }
        }}
        onCancel={(): void => {
          setState({
            ...state,
            showFilterModal: false,
          });
        }}
      />

      {
        state.showReplaceModal
        && (
          <ReplaceModal
            reportItem={state.selectedReportItem!}
            activities={state.activities}
            onReplace={replaceWithActivity}
            onCancel={(): void => {
              setState({
                ...state,
                showReplaceModal: false,
              });
            }}
          />
        )
      }

      <ReportViewItemPopupMenu
        ref={reportViewItemPopupMenuRef}
        onPress={handleReportItemPopupMenuItemPress}
      />
    </View>
  );
});
