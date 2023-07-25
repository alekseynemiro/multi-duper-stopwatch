/* eslint-disable simple-import-sort/imports */
/**
 * @format
 */

import "reflect-metadata";
import { AppRegistry } from "react-native";
import { App } from "./App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
