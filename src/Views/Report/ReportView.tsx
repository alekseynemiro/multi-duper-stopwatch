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
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { PluralFormatter } from "@components/PluralFormatter";
import {
  useLocalizationService,
  useLoggerService,
  useSessionLogService,
} from "@config";
import { GetAllResultItem } from "@dto/SessionLogs";
import { getTimeSpan } from "@utils/TimeUtils";
import {
  CurrentActivity,
  FilterModal,
  ReportViewItem,
  ReportViewItemPressEventArgs,
  Separator,
  Total,
} from "./Components";
import { ActivityModel, CurrentActivityModel, FilteredActivityModel, ReportItemModel, ReportViewStateModel } from "./Models";
import { ReportViewProps } from "./ReportViewProps";
import { reportViewStyles } from "./ReportViewStyles";

export const ReportView = forwardRef((props: ReportViewProps, ref): JSX.Element => {
  const {
    sessionId,
    autoScrollToBottom,
    onLoad,
  } = props;

  const localization = useLocalizationService();
  const sessionLogService = useSessionLogService();
  const loggerService = useLoggerService();

  const scrollViewRef = useRef<ScrollView | null>(null);

  const [state, setState] = useState<ReportViewStateModel>({
    showLoadingIndicator: true,
    logs: [],
    outputLogs: [],
    groupedActivities: new Map<string, ActivityModel>(),
    filterByActivities: [],
    outputTotalTime: 0,
    totalTime: 0,
    currentActivity: undefined,
    showFilterModal: false,
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

      const data = await sessionLogService.getAll(sessionId);

      let totalTime = 0;

      const groupedActivities = new Map<string, ActivityModel>();
      const logs =  data.items.map(
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

      setState({
        ...state,
        logs,
        totalTime,
        groupedActivities,
        outputTotalTime: totalTime,
        outputLogs: logs,
        showLoadingIndicator: false,
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
      sessionLogService,
      loggerService,
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
      });
    },
    [
      state,
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ReportItemModel>): React.ReactElement => {
      return (
        <ReportViewItem
          activityId={item.activityId}
          activityColor={item.color}
          activityName={item.name}
          elapsedTime={item.elapsedTime}
          onPress={renderItemPressHandler}
        />
      );
    },
    [
      renderItemPressHandler,
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
          style={reportViewStyles.tableRowHeader}
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
    ]
  );

  const renderFooter = useCallback(
    (): JSX.Element => {
      return (
        <View
          style={reportViewStyles.footer}
        >
          {
            state.currentActivity
              && (
                <>
                  <Separator />
                  <CurrentActivity
                    activityId={state.currentActivity.id}
                    activityColor={state.currentActivity.color}
                    activityName={state.currentActivity.name}
                    onPress={renderItemPressHandler}
                  />
                </>
              )
          }
          <Separator />
          <Total
            activities={state.filterByActivities}
            realTimeUpdate={
              !!state.currentActivity
              && (
                state.filterByActivities.length === 0
                || state.filterByActivities.some(
                  (x: FilteredActivityModel): boolean => {
                    return x.id === state.currentActivity?.id;
                  }
                )
              )
            }
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
      style={reportViewStyles.container}
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
              ItemSeparatorComponent={Separator}
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
          setState({
            ...state,
            filterByActivities: [],
            outputLogs: state.logs,
            outputTotalTime: state.totalTime,
            showFilterModal: false,
          });

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
        }}
        onCancel={(): void => {
          setState({
            ...state,
            showFilterModal: false,
          });
        }}
      />
    </View>
  );
});
