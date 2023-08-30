import React, { useCallback, useState } from "react";
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { DateTimeFormatter } from "@components/DateTimeFormatter";
import { DurationFormatter } from "@components/DurationFormatter";
import { TableRowSeparator } from "@components/TableRowSeparator";
import { Routes, useLocalizationService, useSessionService } from "@config";
import { GetAllResultItem } from "@dto/Sessions";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@utils/NavigationUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import { reportListPageStyles } from "./ReportListPageStyles";

export function ReportListPage(): JSX.Element {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const localization = useLocalizationService();
  const sessionService = useSessionService();

  // TODO: Use view model instead of DTO
  const [list, setList] = useState<Array<GetAllResultItem>>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);

  const load = useCallback(
    async(): Promise<void> => {
      setShowLoadingIndicator(true);

      const data = await sessionService.getAll();

      setList(data.items);
      setShowLoadingIndicator(false);
    },
    [
      sessionService,
    ]
  );

  const canShowAdditionalColumns = useCallback(
    (): boolean => {
      return width >= 600;
    },
    [
      width,
    ]
  );

  const renderHeader = useCallback(
    (): JSX.Element => {
      return (
        <View
          style={reportListPageStyles.tableRowHeader}
        >
          <View
            style={[
              reportListPageStyles.tableCell,
              reportListPageStyles.sessionNameCol,
            ]}
          >
            <Text style={reportListPageStyles.tableHeaderText}>
              {localization.get("reportList.session")}
            </Text>
          </View>
          {
            canShowAdditionalColumns()
            && (
              <>
                <View
                  style={[
                    reportListPageStyles.tableCell,
                    reportListPageStyles.dateStartCol,
                  ]}
                >
                  <Text style={reportListPageStyles.tableHeaderText}>
                    {localization.get("reportList.start")}
                  </Text>
                </View>
                <View
                  style={[
                    reportListPageStyles.tableCell,
                    reportListPageStyles.dateFinishCol,
                  ]}
                >
                  <Text style={reportListPageStyles.tableHeaderText}>
                    {localization.get("reportList.finish")}
                  </Text>
                </View>
              </>
            )
          }
          <View
            style={[
              reportListPageStyles.tableCell,
              reportListPageStyles.eventsCol,
            ]}
          >
            <Text style={reportListPageStyles.tableHeaderText}>
              {localization.get("reportList.events")}
            </Text>
          </View>
          <View
            style={[
              reportListPageStyles.tableCell,
              reportListPageStyles.elapsedTimeCol,
            ]}
          >
            <Text style={reportListPageStyles.tableHeaderText}>
              {localization.get("reportList.time")}
            </Text>
          </View>
        </View>
      );
    },
    [
      localization,
      canShowAdditionalColumns,
    ]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GetAllResultItem>): React.ReactElement => {
      const name = item.sessionName || (
        `${item.projectName} #${item.id.substring(0, 5)}`
      );

      return (
        <TouchableOpacity
          style={reportListPageStyles.tableRow}
          accessibilityLabel={localization.get("reportList.accessibility.details", { sessionName: name })}
          onPress={(): void => {
            navigation.navigate(
              Routes.Report,
              {
                sessionId: item.id,
              }
            );
          }}
        >
          <View
            style={[
              reportListPageStyles.tableCell,
              reportListPageStyles.sessionNameCol,
            ]}
          >
            <Text
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {name}
            </Text>
          </View>
          {
            canShowAdditionalColumns()
            && (
              <>
                <View
                  style={[
                    reportListPageStyles.tableCell,
                    reportListPageStyles.dateStartCol,
                  ]}
                >
                  <DateTimeFormatter
                    value={item.startDate}
                  />
                </View>
                <View
                  style={[
                    reportListPageStyles.tableCell,
                    reportListPageStyles.dateFinishCol,
                  ]}
                >
                  <DateTimeFormatter
                    value={item.finishDate}
                  />
                </View>
              </>
            )
          }
          <View
            style={[
              reportListPageStyles.tableCell,
              reportListPageStyles.eventsCol,
            ]}
          >
            <Text>
              {item.events}
            </Text>
          </View>
          <View
            style={[
              reportListPageStyles.tableCell,
              reportListPageStyles.elapsedTimeCol,
            ]}
          >
            <DurationFormatter
              value={getTimeSpan(item.elapsedTime)}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [
      canShowAdditionalColumns,
      localization,
      navigation,
    ]
  );

  const keyExtractor = useCallback(
    (item: GetAllResultItem): string => {
      return item.id;
    },
    []
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

  return (
    <View style={reportListPageStyles.contentView}>
      <View style={reportListPageStyles.table}>
        <FlatList<GetAllResultItem>
          data={list}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ItemSeparatorComponent={TableRowSeparator}
          extraData={[width]}
          removeClippedSubviews={true}
          maxToRenderPerBatch={12}
          windowSize={20}
          stickyHeaderIndices={[0]}
        />
        {
          list.length === 0
          && (
            <View>
              <Text
                style={reportListPageStyles.noData}
              >
                {localization.get("reportList.noData")}
              </Text>
            </View>
          )
        }
      </View>
    </View>
  );
}
