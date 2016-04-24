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

  constructor(props) {
    super(props);

    this._onSelectionChanged = this._onSelectionChanged.bind(this);

    const media = [{
      thumb: 'http://farm3.static.flickr.com/2667/4072710001_f36316ddc7_q.jpg?',
      photo: 'http://farm3.static.flickr.com/2667/4072710001_f36316ddc7_b.jpg?',
      selected: true,
      caption: 'Grotto of the Madonna',
    }, {
      thumb: 'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_q.jpg',
      photo: 'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_b.jpg',
      selected: false,
      caption: 'Beautiful Eyes',
    }];

    this.state = {
      media,
    };
  }

  _onSelectionChanged(media, index, selected) {
    console.log(`${media.photo} selection status: ${selected}`);
  }

  render() {
    return (
      <View style={styles.container}>
        <PhotoBrowser
          mediaList={this.state.media}
          initialIndex={0}
          displayNavArrows
          displaySelectionButtons
          alwaysShowControls
          onSelectionChanged={this._onSelectionChanged}
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
