import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { DateTimeFormatter } from "@components/DateTimeFormatter";
import { DurationFormatter } from "@components/DurationFormatter";
import { Icon } from "@components/Icon";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { GetAllResultItem } from "@dto/Sessions";
import { useFocusEffect } from "@react-navigation/native";
import { ISessionService } from "@services/Sessions";
import { useNavigation } from "@utils/NavigationUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import { reportListPageStyles } from "./ReportListPageStyles";

const sessionService = serviceProvider.get<ISessionService>(ServiceIdentifier.SessionService);

export function ReportListPage(): JSX.Element {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  // TODO: Use view model instead of DTO
  const [list, setList] = useState<Array<GetAllResultItem>>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);

  const load = async(): Promise<void> => {
    setShowLoadingIndicator(true);

    const data = await sessionService.getAll();

    setList(data.items);
    setShowLoadingIndicator(false);
  };

  const canShowAdditionalColumns = (): boolean => {
    return width >= 400;
  };

  useFocusEffect(
    useCallback(
      (): void => {
        load();
      },
      []
    )
  );

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <ScrollView>
      <View style={reportListPageStyles.contentView}>
        <View style={reportListPageStyles.table}>
          <View style={reportListPageStyles.tableRow}>
            <View
              style={[
                reportListPageStyles.tableCell,
                reportListPageStyles.sessionNameCol,
              ]}
            >
              <Text style={reportListPageStyles.tableHeaderText}>
                Session
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
                      Start
                    </Text>
                  </View>
                  <View
                    style={[
                      reportListPageStyles.tableCell,
                      reportListPageStyles.dateFinishCol,
                    ]}
                  >
                    <Text style={reportListPageStyles.tableHeaderText}>
                      Finish
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
                Events
              </Text>
            </View>
            <View
              style={[
                reportListPageStyles.tableCell,
                reportListPageStyles.elapsedTimeCol,
              ]}
            >
              <Text style={reportListPageStyles.tableHeaderText}>
                Time
              </Text>
            </View>
            <View
              style={[
                reportListPageStyles.tableCell,
                reportListPageStyles.detailsButtonCol,
              ]}
            />
          </View>
          {
            list.map((x: GetAllResultItem, index: number): JSX.Element => {
              return (
                <View
                  key={x.id}
                  style={[
                    reportListPageStyles.tableRow,
                    index !== list.length - 1
                      ? reportListPageStyles.tableRow
                      : undefined,
                  ]}
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
                      {
                        x.sessionName
                        || (
                          `${x.projectName} #${x.id.substring(0, 5)}`
                        )
                      }
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
                            value={x.startDate}
                          />
                        </View>
                        <View
                          style={[
                            reportListPageStyles.tableCell,
                            reportListPageStyles.dateFinishCol,
                          ]}
                        >
                          <DateTimeFormatter
                            value={x.finishDate}
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
                      {x.events}
                    </Text>
                  </View>
                  <View
                    style={[
                      reportListPageStyles.tableCell,
                      reportListPageStyles.elapsedTimeCol,
                    ]}
                  >
                    <DurationFormatter
                      value={getTimeSpan(x.elapsedTime)}
                    />
                  </View>
                  <View
                    style={[
                      reportListPageStyles.tableCell,
                      reportListPageStyles.detailsButtonCol,
                    ]}
                  >
                    <Button
                      variant="transparent"
                      onPress={(): void => {
                        navigation.navigate(
                          Routes.Report,
                          {
                            sessionId: x.id,
                          }
                        );
                      }}
                    >
                      <Icon
                        name="details"
                      />
                    </Button>
                  </View>
                </View>
              );
            })
          }
          {
            list.length === 0
            && (
              <View>
                <Text>
                  You have not started any session yet.
                </Text>
              </View>
            )
          }
        </View>
      </View>
    </ScrollView>
  );
}
