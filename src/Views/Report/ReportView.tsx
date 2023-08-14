import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { DurationFormatter } from "@components/DurationFormatter";
import { Icon } from "@components/Icon";
import { TriangleMarker } from "@components/TriangleMarker";
import { ServiceIdentifier, serviceProvider } from "@config";
import { GetAllResultItem } from "@dto/SessionLogs";
import { useFocusEffect } from "@react-navigation/native";
import { ISessionLogService } from "@services/Sessions";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { useLocalization } from "@utils/LocalizationUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import { ReportItemModel } from "./Models/ReportItemModel";
import { ReportViewProps } from "./ReportViewProps";
import { reportViewStyles } from "./ReportViewStyles";

const sessionLogService = serviceProvider.get<ISessionLogService>(ServiceIdentifier.SessionLogService);

export const ReportView = forwardRef((props: ReportViewProps, ref): JSX.Element => {
  const {
    sessionId,
    autoScrollToBottom,
  } = props;

  const localization = useLocalization();

  const scrollViewRef = useRef<ScrollView | null>(null);

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [logs, setLogs] = useState<Array<ReportItemModel>>([]);
  const [filteredLogs, setFilteredLogs] = useState<Array<ReportItemModel> | undefined>(undefined);
  const [filterByActivity, setFilterByActivity] = useState<string | undefined>(undefined);
  const [totalTime, setTotalTime] = useState<number>(0);

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
      setShowLoadingIndicator(true);

      if (!sessionId) {
        throw new Error("'sessionId' is required. Value must not be empty.");
      }

      const data = await sessionLogService.getAll(sessionId);
      let totalElapsedTime = 0;

      setLogs(
        data.items.map((x: GetAllResultItem): ReportItemModel => {
          totalElapsedTime += x.elapsedTime;

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
        })
      );

      setTotalTime(totalElapsedTime);
      setShowLoadingIndicator(false);

      if (autoScrollToBottom) {
        scrollToBottom();
      }
    },
    [
      sessionId,
      autoScrollToBottom,
      scrollToBottom,
    ]
  );

  const addItem = useCallback(
    (item: ReportItemModel): void => {
      const newLogs: Array<ReportItemModel> = [
        ...logs,
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

      const totalElapsedTime = newLogs.reduce(
        (current: number, x: ReportItemModel): number => {
          return current + x.elapsedTime;
        },
        0
      );

      setLogs(newLogs);
      setTotalTime(totalElapsedTime);

      if (filterByActivity) {
        setFilteredLogs(
          newLogs.filter(
            (x: ReportItemModel): boolean => {
              return x.activityId === filterByActivity;
            }
          )
        );
      }

      if (autoScrollToBottom) {
        scrollToBottom();
      }
    },
    [
      logs,
      autoScrollToBottom,
      filterByActivity,
      scrollToBottom,
    ]
  );

  useImperativeHandle(
    ref,
    (): ReportViewProps => {
      return {
        sessionId,
        load,
        addItem,
      };
    }
  );

  useFocusEffect(
    useCallback(
      (): void => {
        load();
      },
      [
        load,
      ]
    )
  );

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  const total = filteredLogs
    ? (
      filteredLogs.reduce(
        (result: number, x: ReportItemModel): number => {
          return result + x.elapsedTime;
        },
        0
      )
    )
    : totalTime;

  return (
    <ScrollView
      ref={scrollViewRef}
    >
      <View
        style={reportViewStyles.table}
      >
        <View
          style={reportViewStyles.tableRow}
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
        {
          (filteredLogs ?? logs).map((x: ReportItemModel): JSX.Element => {
            return (
              <TouchableOpacity
                key={x.id}
                style={reportViewStyles.tableRow}
                onPress={(): void => {
                  if (filterByActivity === x.activityId) {
                    setFilterByActivity(undefined);
                    setFilteredLogs(undefined);
                  } else {
                    setFilterByActivity(x.activityId);
                    setFilteredLogs(
                      logs.filter(
                        (xx: ReportItemModel): boolean => {
                          return xx.activityId === x.activityId;
                        }
                      )
                    );
                  }
                }}
              >
                <View
                  style={reportViewStyles.iconCol}
                >
                  <TriangleMarker
                    color={
                      x.color
                        ? getColorCode(x.color)
                        : colors.white
                    }
                  />
                </View>
                <View
                  style={reportViewStyles.nameCol}
                >
                  <Text>
                    {x.name}
                  </Text>
                </View>
                <View
                  style={reportViewStyles.elapsedCol}
                >
                  <DurationFormatter
                    value={getTimeSpan(x.elapsedTime)}
                  />
                </View>
              </TouchableOpacity>
            );
          })
        }
        <View
          style={reportViewStyles.tableRow}
        >
          <View
            style={reportViewStyles.nameCol}
          >
            <Text style={reportViewStyles.totalText}>
              {localization.get("report.total")}
            </Text>
          </View>
          <View
            style={reportViewStyles.elapsedCol}
          >
            <Text style={reportViewStyles.totalText}>
              <DurationFormatter
                value={getTimeSpan(total)}
              />
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
});
