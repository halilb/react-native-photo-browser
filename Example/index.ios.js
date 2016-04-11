/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  ListView,
  View,
} from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';

class PhotoBrowserExample extends Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows([
        'http://www.cybermagonline.com/wp-content/uploads/2016/02/google-logo.jpg',
        'https://octodex.github.com/images/codercat.jpg',
      ]),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <PhotoBrowser
          dataSource={this.state.dataSource}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('PhotoBrowserExample', () => PhotoBrowserExample);
