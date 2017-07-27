/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  ActionSheetIOS,
  CameraRoll,
  ListView,
  StyleSheet,
  Navigator,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';

const EXAMPLES = [
  {
    title: 'Single photo',
    description: 'with caption, no grid button',
    enableGrid: false,
    alwaysDisplayStatusBar: true,
    media: [{
      photo: 'http://farm3.static.flickr.com/2667/4072710001_f36316ddc7_b.jpg',
      caption: 'Grotto of the Madonna',
    }],
  }, {
    title: 'Multiple photos',
    description: 'with captions and nav arrows',
    displayNavArrows: true,
    displayActionButton: true,
    media: [{
      photo: 'http://farm3.static.flickr.com/2667/4072710001_f36316ddc7_b.jpg',
      selected: true,
      caption: 'Grotto of the Madonna',
    }, {
      photo: require('./media/broadchurch_thumbnail.png'),
      caption: 'Broadchurch Scene',
    }, {
      photo: 'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_b.jpg',
      thumb: 'http://farm3.static.flickr.com/2449/4052876281_6e068ac860_q.jpg',
      selected: false,
      caption: 'Beautiful Eyes',
    }],
  }, {
    title: 'Library photos',
    description: 'showing grid first, custom action method',
    startOnGrid: true,
    displayActionButton: true,
  },
];

// fill 'Library photos' example with local media
CameraRoll.getPhotos({
  first: 30,
  assetType: 'Photos',
}).then((data) => {
  const media = [];
  data.edges.forEach(d => media.push({
    photo: d.node.image.uri,
  }));
  EXAMPLES[2].media = media;
}).catch(error => alert(error));

export default class PhotoBrowserExample extends Component {

  constructor(props) {
    super(props);

    this._onSelectionChanged = this._onSelectionChanged.bind(this);
    this._onActionButton = this._onActionButton.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._renderScene = this._renderScene.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(EXAMPLES),
    };
  }

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

  _openExample(example) {
    this.refs.nav.push(example);
  }

  _renderRow(rowData, sectionID, rowID) {
    const example = EXAMPLES[rowID];

    return (
      <TouchableOpacity onPress={() => this._openExample(example) }>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>{rowData.title}</Text>
          <Text style={styles.rowDescription}>{rowData.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderScene(route, navigator) {
    if (route.index === 0) {
      return (
        <View style={styles.container}>
          <ListView
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
          />
        </View>
      );
    }

    const {
      media,
      initialIndex,
      displayNavArrows,
      displayActionButton,
      displaySelectionButtons,
      startOnGrid,
      enableGrid,
      alwaysDisplayStatusBar,
    } = route;

    return (
      <PhotoBrowser
        onBack={navigator.pop}
        mediaList={media}
        initialIndex={initialIndex}
        displayNavArrows={displayNavArrows}
        displaySelectionButtons={displaySelectionButtons}
        displayActionButton={displayActionButton}
        startOnGrid={startOnGrid}
        enableGrid={enableGrid}
        useCircleProgress
        onSelectionChanged={this._onSelectionChanged}
        onActionButton={this._onActionButton}
        alwaysDisplayStatusBar={alwaysDisplayStatusBar}
      />
    );
  }

  render() {
    return (
      <Navigator
        ref="nav"
        initialRoute={{ index: 0 }}
        renderScene={this._renderScene}
      />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingTop: 54,
    paddingLeft: 16,
  },
  row: {
    flex: 1,
    padding: 8,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  rowTitle: {
    fontSize: 14,
  },
  rowDescription: {
    fontSize: 12,
  },
});
