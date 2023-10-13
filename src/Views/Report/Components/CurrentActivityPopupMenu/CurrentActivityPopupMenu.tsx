import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { PopupMenu, PopupMenuItem } from "@components/PopupMenu";
import { useLocalizationService } from "@config";
import { CurrentActivityPopupMenuMethods } from "./CurrentActivityPopupMenuMethods";
import { CurrentActivityPopupMenuProps } from "./CurrentActivityPopupMenuProps";

export const CurrentActivityPopupMenu = forwardRef((props: CurrentActivityPopupMenuProps, ref: React.ForwardedRef<unknown>): JSX.Element => {
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
    (): CurrentActivityPopupMenuMethods => {
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
    </PopupMenu>
  );
});
