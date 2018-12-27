import React, { Component } from 'react';
import { ActionSheetIOS, Platform, Button } from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    mediaList: this.props.navigation.state.params.example.media,
    selected: new Set(),
  }

  onSelectionChanged = (media, index, selected) => {
    this.setState(prevState => {
      const copy = new Set(prevState.selected);
      if (selected) {
        copy.add(index);
      } else {
        copy.delete(index);
      }
      return { 
        selected: copy, 
      };
    });
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
      initialIndex,
      displayNavArrows,
      displayActionButton,
      displaySelectionButtons,
      startOnGrid,
      enableGrid,
      alwaysDisplayStatusBar,
    } = this.props.navigation.state.params.example;

    const { mediaList, selected } = this.state;

    return (
      <>
        <PhotoBrowser
          onBack={navigator.pop}
          mediaList={mediaList}
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
        {selected.size > 0 && (
          <Button
            title="Delete"
            onPress={() =>
              this.setState(prevState => ({
                mediaList: prevState.mediaList.filter((_, i) => !prevState.selected.has(i)),
                selected: new Set(),
              }))
            }
          />
        )}
      </>
    );
  }
}
