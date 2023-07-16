import { NavigationProp, RouteProp } from "@react-navigation/native";

export type ProjectEditorPageProps = {

  navigation: NavigationProp<any, any>;

  route: RouteProp<Record<string, { projectId: string }>, string>;

};
