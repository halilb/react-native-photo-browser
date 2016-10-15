/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';

export default class PhotoBrowserExampleZoom extends Component {
 _onSelectionChanged(media, index, selected) {
    alert(`${media.photo} selection status: ${selected}`);
  }

  _onActionButton(media, index) {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: media.photo,
        message: media.caption,
      },
      () => {},
      () => {});
    } else {
      alert(`handle sharing on android for ${media.photo}, index: ${index}`);
    }
  }


  render() {
    var media = [{
      photo: 'http://farm3.static.flickr.com/2667/4072710001_f36316ddc7_b.jpg',
      selected: true,
      caption: 'Grotto of the Madonna',
    }, {
      photo: 'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_b.jpg',
      thumb: 'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_q.jpg',
      selected: false,
      caption: 'Beautiful Eyes',
    }]
    return (
      <PhotoBrowser
            onBack={() => alert('back')}
            mediaList={media}
            displayNavArrows={true}
            displaySelectionButtons={false}
            displayActionButton={true}
            startOnGrid={true}
            enableGrid={true}
            useCircleProgress
            onSelectionChanged={this._onSelectionChanged.bind(this)}
            onActionButton={this._onActionButton.bind(this)}
          />
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('PhotoBrowserExampleZoom', () => PhotoBrowserExampleZoom);
