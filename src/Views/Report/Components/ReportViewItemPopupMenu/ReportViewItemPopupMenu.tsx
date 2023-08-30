import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { useLocalizationService } from "@config";
import { ReportViewItemPopupMenuMethods } from "./ReportViewItemPopupMenuMethods";
import { ReportViewItemPopupMenuProps } from "./ReportViewItemPopupMenuProps";
import { reportViewItemPopupMenuStyles } from "./ReportViewItemPopupMenuStyles";

export const ReportViewItemPopupMenu = forwardRef((props: ReportViewItemPopupMenuProps, ref: React.ForwardedRef<unknown>): JSX.Element => {
  const localization = useLocalizationService();

  const {
    onPress,
  } = props;

  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);

  const open = useCallback(
    (newId: string): void => {
      setId(newId);
      setShow(true);
    },
    []
  );

  const close = useCallback(
    (): void => {
      setShow(false);
    },
    []
  );

  useImperativeHandle(
    ref,
    (): ReportViewItemPopupMenuMethods => {
      return {
        open,
        close,
      };
    }
  );

  if (!show) {
    return (
      <></>
    );
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
    >
      <TouchableWithoutFeedback
        onPress={close}
      >
        <View style={reportViewItemPopupMenuStyles.centeredView}>
          <View style={reportViewItemPopupMenuStyles.modalView}>
            <Button
              variant="light"
              childWrapperStyle={reportViewItemPopupMenuStyles.buttonChildContainer}
              onPress={(): void => {
                close();
                onPress({
                  action: "replace",
                  id: id!,
                });
              }}
            >
              <Icon
                name="replace"
                style={reportViewItemPopupMenuStyles.buttonIcon}
              />
              <Text>{localization.get("report.itemPopupMenu.replace")}</Text>
            </Button>
            <Button
              variant="light"
              childWrapperStyle={reportViewItemPopupMenuStyles.buttonChildContainer}
              onPress={(): void => {
                close();
                onPress({
                  action: "delete",
                  id: id!,
                });
              }}
              onLongPress={(): void => {
                close();
                onPress({
                  action: "delete-forced",
                  id: id!,
                });
              }}
            >
              <Icon
                name="delete"
                style={reportViewItemPopupMenuStyles.buttonIcon}
              />
              <Text>{localization.get("report.itemPopupMenu.delete")}</Text>
            </Button>
            <Button
              variant="light"
              childWrapperStyle={reportViewItemPopupMenuStyles.buttonChildContainer}
              onPress={close}
            >
              <Icon
                name="cancel"
                style={reportViewItemPopupMenuStyles.buttonIcon}
              />
              <Text>{localization.get("report.itemPopupMenu.cancel")}</Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});
