import React, { useEffect, useState } from "react";
import { useAlertService } from "@config";
import { AlertServiceShowEventArgs } from "@services/Alert";
import { AlertModal } from "./AlertModal";

export function AlertProvider(): JSX.Element {
  const alertService = useAlertService();
  const [show, setShow] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertServiceShowEventArgs | undefined>(undefined);

  useEffect(
    (): { (): void } => {
      const showSubscription = alertService.addEventListener(
        "show",
        (e: AlertServiceShowEventArgs): void => {
          setAlert(e);
          setShow(true);
        }
      );

      const closeSubscription = alertService.addEventListener(
        "close",
        (): void => {
          setAlert(undefined);
          setShow(true);
        }
      );

      return (): void => {
        showSubscription.remove();
        closeSubscription.remove();
      };
    },
    [
      alertService,
    ]
  );

  if (!show || !alert) {
    return (
      <></>
    );
  }

  return (
    <AlertModal
      title={alert.title}
      message={alert.message}
      buttons={alert.buttons}
    />
  );
}
