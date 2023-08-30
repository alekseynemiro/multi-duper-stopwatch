import { MutableRefObject } from "react";
import { ReportViewItemPopupMenuPressEventArgs } from "./ReportViewItemPopupMenuPressEventArgs";

export type ReportViewItemPopupMenuProps = {

  ref?: MutableRefObject<ReportViewItemPopupMenuProps | undefined>;

  onPress(e: ReportViewItemPopupMenuPressEventArgs): void;

};
