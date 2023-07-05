/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type {PropsWithChildren} from "react";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Routes.Home}
      >
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
