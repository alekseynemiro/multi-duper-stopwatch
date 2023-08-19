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
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { useLocalizationService, useLoggerService, useSessionLogService } from "@config";
import { GetAllResultItem } from "@dto/SessionLogs";
import { getTimeSpan } from "@utils/TimeUtils";
import {
  CurrentActivity,
  ReportViewItem,
  ReportViewItemPressEventArgs,
  Separator,
  Total,
} from "./Components";
import { CurrentActivityModel, ReportItemModel, ReportViewStateModel } from "./Models";
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
    filterByActivity: undefined,
    outputTotalTime: 0,
    totalTime: 0,
    currentActivity: undefined,
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

      const logs =  data.items.map(
        (x: GetAllResultItem): ReportItemModel => {
          totalTime += x.elapsedTime;

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

      if (state.filterByActivity) {
        if (state.filterByActivity?.id === item.activityId) {
          newOutputLogs = newLogs.filter(
            (x: ReportItemModel): boolean => {
              if (x.activityId === state.filterByActivity?.id) {
                outputTotal += x.elapsedTime;
                return true;
              }

              return false;
            }
          );
        } else {
          newOutputLogs = state.outputLogs;
        }
      } else {
        outputTotal = state.totalTime + item.elapsedTime;
        newOutputLogs = newLogs;
      }

      setState({
        ...state,
        logs: newLogs,
        outputLogs: newOutputLogs,
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

  const renderItemPressHandler = useCallback(
    ({ activityId, activityColor }: ReportViewItemPressEventArgs): void => {
      if (state.filterByActivity?.id === activityId) {
        setState({
          ...state,
          filterByActivity: undefined,
          outputLogs: state.logs,
          outputTotalTime: state.totalTime,
        });
      } else {
        let total = 0;
        const newOutputLogs = state.logs.filter(
          (x: ReportItemModel): boolean => {
            if (x.activityId === activityId) {
              total += x.elapsedTime;
              return true;
            }

            return false;
          }
        );

        setState({
          ...state,
          filterByActivity: {
            id: activityId,
            color: activityColor,
          },
          outputLogs: newOutputLogs,
          outputTotalTime: total,
        });
      }
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
            activityId={state.filterByActivity?.id}
            activityColor={state.filterByActivity?.color}
            realTimeUpdate={
              !!state.currentActivity?.id
              && state.currentActivity?.id === state.filterByActivity?.id
            }
            elapsed={getTimeSpan(state.outputTotalTime)}
          />
        </View>
      );
    },
    [
      state,
      renderItemPressHandler,
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
      {renderFooter()}
    </View>
  );
});
