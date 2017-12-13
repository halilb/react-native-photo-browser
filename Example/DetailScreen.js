import React, { Component } from 'react';
import { ActionSheetIOS, Platform } from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  onSelectionChanged = (media, index, selected) => {
    alert(`${media.photo} selection status: ${selected}`);
  };

  onActionButton = (media, index) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions(
        {
          url: media.photo,
          message: media.caption,
        },
        () => {},
        () => {},
      );
    } else {
      alert(`handle sharing on android for ${media.photo}, index: ${index}`);
    }
  };

  render() {
    const {
      media,
      initialIndex,
      displayNavArrows,
      displayActionButton,
      displaySelectionButtons,
      startOnGrid,
      enableGrid,
      alwaysDisplayStatusBar,
    } = this.props.navigation.state.params.example;

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
        onSelectionChanged={this.onSelectionChanged}
        onActionButton={this.onActionButton}
        alwaysDisplayStatusBar={alwaysDisplayStatusBar}
        customTitle={(index, rowCount) => `${index} sur ${rowCount}`}
      />
    );
  }
}
