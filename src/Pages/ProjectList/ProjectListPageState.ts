import { GetAllResultItem } from "@dto/Projects";

export type ProjectListPageState = {

  // TODO: Use view model instead of DTO
  list: Array<GetAllResultItem>;

  showLoadingIndicator: boolean;

};
