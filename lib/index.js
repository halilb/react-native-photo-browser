import React, { PropTypes } from 'react';
import {
  Animated,
  Dimensions,
  ListView,
  View,
  StyleSheet,
} from 'react-native';

import Constants from './constants';
import { TopBar } from './bar';

import GridContainer from './GridContainer';
import FullScreenContainer from './FullScreenContainer';

const TOOLBAR_HEIGHT = Constants.TOOLBAR_HEIGHT;

export default class PhotoBrowser extends React.Component {

  static propTypes = {
    mediaList: PropTypes.array.isRequired,

    /*
     * set the current visible photo before displaying
     */
    initialIndex: PropTypes.number,

    /*
     * Allows to control whether the bars and controls are always visible
     * or whether they fade away to show the photo full
     */
    alwaysShowControls: PropTypes.bool,

    /*
     * Show action button to allow sharing, copying, etc
     */
    displayActionButton: PropTypes.bool,

    /*
     * Whether to display left and right nav arrows on bottom toolbar
     */
    displayNavArrows: PropTypes.bool,

    /*
     * Whether to allow the viewing of all the photo thumbnails on a grid
     */
    enableGrid: PropTypes.bool,

    /*
     * Whether to start on the grid of thumbnails instead of the first photo
     */
    startOnGrid: PropTypes.bool,

    /*
     * Whether selection buttons are shown on each image
     */
    displaySelectionButtons: PropTypes.bool,

    /*
     * Called when a media item is selected or unselected
     */
    onSelectionChanged: PropTypes.func,

    /*
     * Called when action button is pressed for a media
     * If you don't provide this props, ActionSheetIOS will be opened as default
     */
    onActionButton: PropTypes.func,

    /*
     * displays Progress.Circle instead of default Progress.Bar for full screen photos
     * iOS only
     */
    useCircleProgress: PropTypes.bool,

    /*
     * Called when done or back button is tapped
     */
    onBack: PropTypes.func,
  };

  static defaultProps = {
    mediaList: [],
    initialIndex: 0,
    alwaysShowControls: false,
    displayActionButton: false,
    displayNavArrows: false,
    enableGrid: true,
    startOnGrid: false,
    displaySelectionButtons: false,
    useCircleProgress: false,
    onSelectionChanged: () => {},
    onBack: () => {},
  };

  constructor(props, context) {
    super(props, context);

    this._onGridPhotoTap = this._onGridPhotoTap.bind(this);
    this._onGridButtonTap = this._onGridButtonTap.bind(this);
    this._onMediaSelection = this._onMediaSelection.bind(this);
    this._updateTitle = this._updateTitle.bind(this);
    this._toggleTopBar = this._toggleTopBar.bind(this);

    const { mediaList, startOnGrid, initialIndex } = props;

    this.state = {
      dataSource: this._createDataSource(mediaList),
      mediaList,
      isFullScreen: !startOnGrid,
      fullScreenAnim: new Animated.Value(startOnGrid ? 0 : 1),
      currentIndex: initialIndex,
      displayTopBar: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.mediaList;
    this.setState({
      dataSource: this._createDataSource(mediaList),
      mediaList,
    });
  }

  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    return dataSource.cloneWithRows(list);
  }

  _onGridPhotoTap(index) {
    this.refs.fullScreenContainer.openPage(index, false);
    this._toggleFullScreen(true);
  }

  _onGridButtonTap() {
    this._toggleFullScreen(false);
  }

  _onMediaSelection(index, isSelected) {
    const {
      mediaList: oldMediaList,
      dataSource,
    } = this.state;
    const newMediaList = oldMediaList.slice();
    const selectedMedia = {
      ...oldMediaList[index],
      selected: isSelected,
    };
    newMediaList[index] = selectedMedia;

    this.setState({
      dataSource: dataSource.cloneWithRows(newMediaList),
      mediaList: newMediaList,
    });
    this.props.onSelectionChanged(selectedMedia, index, isSelected);
  }

  _updateTitle(title) {
    this.setState({ title });
  }

  _toggleTopBar(displayed: boolean) {
    this.setState({
      displayTopBar: displayed,
    });
  }

  _toggleFullScreen(display: boolean) {
    this.setState({
      isFullScreen: display,
    });
    Animated.timing(
      this.state.fullScreenAnim,
      {
        toValue: display ? 1 : 0,
        duration: 300,
      }
    ).start();
  }

  render() {
    const {
      alwaysShowControls,
      displayNavArrows,
      displaySelectionButtons,
      displayActionButton,
      enableGrid,
      useCircleProgress,
      onActionButton,
      onBack,
    } = this.props;
    const {
      dataSource,
      mediaList,
      isFullScreen,
      fullScreenAnim,
      currentIndex,
      title,
      displayTopBar,
    } = this.state;
    const screenHeight = Dimensions.get('window').height;

    let gridContainer;
    let fullScreenContainer;
    if (mediaList.length > 0) {
      if (enableGrid) {
        gridContainer = (
          <Animated.View
            style={{
              height: screenHeight,
              marginTop: fullScreenAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, screenHeight * -1 - TOOLBAR_HEIGHT],
              }),
            }}
          >
            <GridContainer
              dataSource={dataSource}
              displaySelectionButtons={displaySelectionButtons}
              onPhotoTap={this._onGridPhotoTap}
              onMediaSelection={this._onMediaSelection}
            />
          </Animated.View>
        );
      }

      fullScreenContainer = (
        <FullScreenContainer
          ref="fullScreenContainer"
          dataSource={dataSource}
          mediaList={mediaList}
          initialIndex={currentIndex}
          alwaysShowControls={alwaysShowControls}
          displayNavArrows={displayNavArrows}
          displaySelectionButtons={displaySelectionButtons}
          displayActionButton={displayActionButton}
          enableGrid={enableGrid}
          useCircleProgress={useCircleProgress}
          onActionButton={onActionButton}
          onMediaSelection={this._onMediaSelection}
          onGridButtonTap={this._onGridButtonTap}
          updateTitle={this._updateTitle}
          toggleTopBar={this._toggleTopBar}
        />
      );
    }

    return (
      <View style={[styles.container, {
        paddingTop: gridContainer ? TOOLBAR_HEIGHT : 0,
      }]}>
        {gridContainer}
        {fullScreenContainer}
        {/* this is here for bigger z-index purpose */}
        <TopBar
          height={TOOLBAR_HEIGHT}
          displayed={displayTopBar}
          title={isFullScreen ? title : `${mediaList.length} photos`}
          onBack={onBack}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
