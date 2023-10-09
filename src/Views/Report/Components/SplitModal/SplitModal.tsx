import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Modal } from "@components/Modal";
import { useLocalizationService } from "@config";
import { getTimeSpan } from "@utils/TimeUtils";
import { SplitBar } from "./SplitBar";
import { SplitModalProps } from "./SplitModalProps";
import { splitModalStyles } from "./SplitModalStyles";

const suggests = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95];

export function SplitModal(props: SplitModalProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    reportItem,
    onSplit,
    onCancel,
  } = props;

  const [splitValue, setSplitValue] = useState(reportItem.elapsedTime / 2);
  const [slices, setSlices] = useState([reportItem.elapsedTime / 2, reportItem.elapsedTime / 2]);

  return (
    <Modal
      show={true}
      size="md"
    >
      <View style={splitModalStyles.row}>
        <Text>
          {localization.get(
            "report.splitModal.helpMessage",
            {
              activityName: reportItem.name,
              elapsedTime: getTimeSpan(reportItem.elapsedTime).displayValue,
            }
          )}
        </Text>
      </View>
      <View style={splitModalStyles.row}>
        <SplitBar
          split={splitValue}
          value={reportItem.elapsedTime}
          onSelect={(e: Array<number>): void => {
            setSlices(e);
          }}
        />
      </View>
      <ScrollView>
        <View
          style={[
            splitModalStyles.row,
            splitModalStyles.suggests,
          ]}
        >
          {
            suggests.map((x: number): JSX.Element => {
              return (
                <Button
                  key={x}
                  title={`${x}%`}
                  variant="light"
                  style={splitModalStyles.suggestButton}
                  onPress={(): void => {
                    const newSplitValue = (reportItem.elapsedTime * x) / 100;

                    setSplitValue(newSplitValue);
                    setSlices([newSplitValue, reportItem.elapsedTime - newSplitValue]);
                  }}
                />
              );
            })
          }
        </View>
      </ScrollView>
      <View style={splitModalStyles.row}>
        <HorizontalLine size="sm" />
      </View>
      <View style={splitModalStyles.footer}>
        <Button
          variant="primary"
          title={localization.get("report.splitModal.split")}
          style={splitModalStyles.buttonSplit}
          onPress={(): void => {
            onSplit(reportItem.id, slices[0]);
          }}
        />
        <Button
          variant="secondary"
          title={localization.get("report.splitModal.cancel")}
          style={splitModalStyles.buttonCancel}
          onPress={onCancel}
        />
      </View>
    </Modal>
  );
}
