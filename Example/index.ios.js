/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  View,
} from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';

class PhotoBrowserExample extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PhotoBrowser />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('PhotoBrowserExample', () => PhotoBrowserExample);
