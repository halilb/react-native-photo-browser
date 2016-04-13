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
        'http://farm4.static.flickr.com/3567/3523321514_371d9ac42f_b.jpg',
        'http://farm4.static.flickr.com/3629/3339128908_7aecabc34b_b.jpg',
        'http://farm4.static.flickr.com/3364/3338617424_7ff836d55f_b.jpg',
        'http://farm4.static.flickr.com/3590/3329114220_5fbc5bc92b_b.jpg',
        'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_b.jpg',
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
