import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { PopupMenu, PopupMenuItem } from "@components/PopupMenu";
import { useLocalizationService } from "@config";
import { ReportViewItemPopupMenuMethods } from "./ReportViewItemPopupMenuMethods";
import { ReportViewItemPopupMenuProps } from "./ReportViewItemPopupMenuProps";

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
    <PopupMenu
      onCancel={close}
    >
      <PopupMenuItem
        icon="replace"
        text={localization.get("report.itemPopupMenu.replace")}
        onPress={(): void => {
          close();
          onPress({
            action: "replace",
            id: id!,
          });
        }}
      />
      <PopupMenuItem
        icon="split"
        text={localization.get("report.itemPopupMenu.split")}
        onPress={(): void => {
          close();
          onPress({
            action: "split",
            id: id!,
          });
        }}
      />
      <PopupMenuItem
        icon="delete"
        text={localization.get("report.itemPopupMenu.delete")}
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
      />
    </PopupMenu>
  );
});
