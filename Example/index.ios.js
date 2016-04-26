/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  CameraRoll,
  Component,
  StyleSheet,
  View,
} from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';

class PhotoBrowserExample extends Component {

  constructor(props) {
    super(props);

    this._onSelectionChanged = this._onSelectionChanged.bind(this);
    this._onActionButtonPressed = this._onActionButtonPressed.bind(this);

    const media = [{
      photo: 'http://farm3.static.flickr.com/2667/4072710001_f36316ddc7_b.jpg?',
      selected: true,
      caption: 'Grotto of the Madonna',
    }, {
      photo: 'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_b.jpg',
      selected: false,
      caption: 'Beautiful Eyes',
    }];

    this.state = {
      media: [],
    };
  }

  componentDidMount() {
    CameraRoll.getPhotos({
      first: 100,
      assetType: 'Photos',
    }).then((data) => {
      const media = [];
      data.edges.forEach(d => media.push({
        photo: d.node.image.uri,
      }));

      this.setState({ media });
    }).catch(error => alert(error));
  }

  _onSelectionChanged(media, index, selected) {
    console.log(`${media.photo} selection status: ${selected}`);
  }

  _onActionButtonPressed(media, index) {
    console.log(`action button pressed for ${media.photo}, index: ${index}`);
  }

  render() {
    return (
      <View style={styles.container}>
        <PhotoBrowser
          mediaList={this.state.media}
          initialIndex={0}
          displayNavArrows
          displaySelectionButtons
          onSelectionChanged={this._onSelectionChanged}
          startOnGrid
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
