import React from 'react';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  View,
  ViewPagerAndroid,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  ViewPropTypes
} from 'react-native';

import Constants from './constants';
import { BottomBar } from './bar';
import { Photo } from './media';

export default class FullScreenContainer extends React.Component {

  static propTypes = {
    style: ViewPropTypes.style,
    mediaList: PropTypes.array.isRequired,
    /*
     * opens grid view
     */
    onGridButtonTap: PropTypes.func,

    /*
     * Display top bar
     */
    displayTopBar: PropTypes.bool,

    /*
     * updates top bar title
     */
    updateTitle: PropTypes.func,

    /*
     * displays/hides top bar
     */
    toggleTopBar: PropTypes.func,

    /*
     * refresh the list to apply selection change
     */
    onMediaSelection: PropTypes.func,

    /*
     * those props are inherited from main PhotoBrowser component
     * i.e. index.js
     */
    initialIndex: PropTypes.number,
    alwaysShowControls: PropTypes.bool,
    displayActionButton: PropTypes.bool,
    displayNavArrows: PropTypes.bool,
    alwaysDisplayStatusBar: PropTypes.bool,
    displaySelectionButtons: PropTypes.bool,
    enableGrid: PropTypes.bool,
    useCircleProgress: PropTypes.bool,
    onActionButton: PropTypes.func,
    onPhotoLongPress: PropTypes.func,
    delayLongPress: PropTypes.number
  };

  static defaultProps = {
    initialIndex: 0,
    displayTopBar: true,
    displayNavArrows: false,
    alwaysDisplayStatusBar: false,
    displaySelectionButtons: false,
    enableGrid: true,
    onGridButtonTap: () => {},
    onPhotoLongPress: () => {},
    delayLongPress: 1000,
  };

  constructor(props, context) {
    super(props, context);

    this._renderItem = this._renderItem.bind(this);
    this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onPageSelected = this._onPageSelected.bind(this);
    this._onNextButtonTapped = this._onNextButtonTapped.bind(this);
    this._onPhotoLongPress = this._onPhotoLongPress.bind(this);
    this._onPreviousButtonTapped = this._onPreviousButtonTapped.bind(this);
    this._onActionButtonTapped = this._onActionButtonTapped.bind(this);

    this.photoRefs = [];
    this.state = {
      currentIndex: props.initialIndex,
      currentMedia: props.mediaList[props.initialIndex],
      controlsDisplayed: props.displayTopBar,
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('didUpdateDimensions', () => {
      this.photoRefs.map(p => p && p.forceUpdate());
      this.openPage(this.state.currentIndex, false);
    });

    this.openPage(this.state.currentIndex, false);
  }

  openPage(index, animated) {
    if (!this.flatListView) {
      return;
    }

    if (Platform.OS === 'ios') {
      this.flatListView.scrollToIndex({
        index: index,
        animated: animated,
      });
    } else {
      this.flatListView.setPageWithoutAnimation(index);
    }

    this._updatePageIndex(index);
  }

  _updatePageIndex(index) {
    this.setState({
      currentIndex: index,
      currentMedia: this.props.mediaList[index],
    }, () => {
      this._triggerPhotoLoad(index);

      const { customTitle, mediaList } = this.props;
      
      const rowCount = mediaList.length;
      const newTitle = customTitle ? customTitle(index + 1, rowCount) : `${index + 1} of ${rowCount}`;
      this.props.updateTitle(newTitle);
    });
  }

  _triggerPhotoLoad(index) {
    const photo = this.photoRefs[index];
    if (photo) {
      photo.load();
    } else {
      // HACK: photo might be undefined when user taps a photo from gridview
      // that hasn't been rendered yet.
      // photo is rendered after listView's scrollTo method call
      // and i'm deferring photo load method for that.
      setTimeout(this._triggerPhotoLoad.bind(this, index), 200);
    }
  }

  _toggleControls() {
    const { alwaysShowControls, toggleTopBar } = this.props;

    if (!alwaysShowControls) {
      const controlsDisplayed = !this.state.controlsDisplayed;
      this.setState({
        controlsDisplayed,
      });
      toggleTopBar(controlsDisplayed);
    }
  }

  _onNextButtonTapped() {
    let nextIndex = this.state.currentIndex + 1;
    // go back to the first item when there is no more next item
    if (nextIndex > this.props.mediaList.length - 1) {
      nextIndex = 0;
    }
    this.openPage(nextIndex, false);
  }

  _onPreviousButtonTapped() {
    let prevIndex = this.state.currentIndex - 1;
    // go to the last item when there is no more previous item
    if (prevIndex < 0) {
      prevIndex = this.props.mediaList.length - 1;
    }
    this.openPage(prevIndex, false);
  }

  _onActionButtonTapped() {
    const onActionButton = this.props.onActionButton;

    // action behaviour must be implemented by the client
    // so, call the client method or simply ignore this event
    if (onActionButton) {
      const { currentMedia, currentIndex } = this.state;
      onActionButton(currentMedia, currentIndex);
    }
  }

  _onScroll(e) {
    const event = e.nativeEvent;
    const layoutWidth = event.layoutMeasurement.width || Dimensions.get('window').width;
    const newIndex = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth);

    this._onPageSelected(newIndex);
  }

  _onPageSelected(page) {
    const { currentIndex } = this.state;
    let newIndex = page;

    // handle ViewPagerAndroid argument
    if (typeof newIndex === 'object') {
      newIndex = newIndex.nativeEvent.position;
    }

    if (currentIndex !== newIndex) {
      this._updatePageIndex(newIndex);

      if (this.state.controlsDisplayed && !this.props.displayTopBar) {
        this._toggleControls();
      }
    }
  }
  _onPhotoLongPress() {
    const onPhotoLongPress = this.props.onPhotoLongPress;
    const { currentMedia, currentIndex } = this.state;
    onPhotoLongPress(currentMedia, currentIndex);
  }

  _renderItem({ item, index }) {
    const {
      displaySelectionButtons,
      onMediaSelection,
      useCircleProgress,
    } = this.props;

    return (
      <View style={styles.flex}>
        <TouchableWithoutFeedback
          onPress={this._toggleControls}
          onLongPress={this._onPhotoLongPress}
          delayLongPress={this.props.delayLongPress}>
          <Photo
            ref={ref => this.photoRefs[index] = ref}
            lazyLoad
            useCircleProgress={useCircleProgress}
            uri={item.photo}
            displaySelectionButtons={displaySelectionButtons}
            selected={item.selected}
            onSelection={(isSelected) => {
              onMediaSelection(index, isSelected);
            }}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  getItemLayout = (data, index) => (
    { length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index }
  )

  _renderScrollableContent() {
    const { mediaList } = this.props;

    if (Platform.OS === 'android') {
      return (
        <ViewPagerAndroid
          style={styles.flex}
          ref={scrollView => this.flatListView = scrollView}
          onPageSelected={this._onPageSelected}
        >
          {mediaList.map((child, idx) => this._renderItem({'item':child, 'index':idx}))}
        </ViewPagerAndroid>
      );
    }

    return (
      <FlatList
        ref={flatListView => this.flatListView = flatListView}
        data={mediaList}
        renderItem={this._renderItem}
        onScroll={this._onScroll}
        keyExtractor={this._keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        scrollEventThrottle={16}
        getItemLayout={this.getItemLayout}
        initialScrollIndex={this.state.currentIndex}
      />
    );
  }

  _keyExtractor = (item, index) => index.toString();

  render() {
    const {
      displayNavArrows,
      alwaysDisplayStatusBar,
      displayActionButton,
      onGridButtonTap,
      enableGrid,
    } = this.props;
    const { controlsDisplayed, currentMedia } = this.state;
    const BottomBarComponent = this.props.bottomBarComponent || BottomBar;

    return (
      <View style={styles.flex}>
        <StatusBar
          hidden={alwaysDisplayStatusBar ? false : !controlsDisplayed}
          showHideTransition={'slide'}
          barStyle={'light-content'}
          animated
          translucent
        />
        {this._renderScrollableContent()}
        <BottomBarComponent
          displayed={controlsDisplayed}
          height={Constants.TOOLBAR_HEIGHT}
          displayNavArrows={displayNavArrows}
          displayGridButton={enableGrid}
          displayActionButton={displayActionButton}
          caption={currentMedia.caption}
          media={currentMedia}
          onPrev={this._onPreviousButtonTapped}
          onNext={this._onNextButtonTapped}
          onGrid={onGridButtonTap}
          onAction={this._onActionButtonTapped}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
