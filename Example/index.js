import React, { AppRegistry } from 'react-native';

import { StackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Detail: { screen: DetailScreen },
});

AppRegistry.registerComponent('PhotoBrowserExample', () => App);
