import React, { PropTypes } from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  ListView,
  View,
  ViewPagerAndroid,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';

import Constants from './constants';
import { BottomBar } from './bar';
import { Photo } from './media';

import Gallery from './Gallery';

export default class FullScreenContainer extends React.Component {

  static propTypes = {
    style: View.propTypes.style,
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    mediaList: PropTypes.array.isRequired,
    /*
     * opens grid view
     */
    onGridButtonTap: PropTypes.func,

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
    displaySelectionButtons: PropTypes.bool,
    enableGrid: PropTypes.bool,
    useCircleProgress: PropTypes.bool,
    onActionButton: PropTypes.func,
    forceLoadPhoto: PropTypes.bool,
    notSupportedError: PropTypes.string,
  };

  static defaultProps = {
    initialIndex: 0,
    displayNavArrows: false,
    displaySelectionButtons: false,
    enableGrid: true,
    onGridButtonTap: () => {},
    notSupportedError: 'sorry, not supported!'
  };

  constructor(props, context) {
    super(props, context);
    this.mediaList = new Array().concat(props.mediaList);

    this._renderRow = this._renderRow.bind(this);
    this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onPageSelected = this._onPageSelected.bind(this);
    this._onNextButtonTapped = this._onNextButtonTapped.bind(this);
    this._onPreviousButtonTapped = this._onPreviousButtonTapped.bind(this);
    this._onActionButtonTapped = this._onActionButtonTapped.bind(this);
    this._onGalleryPageSelected = this._onGalleryPageSelected.bind(this);
    this._onSingleTapConfirmed = this._onSingleTapConfirmed.bind(this);

    this.photoRefs = [];
    this.state = {
      currentIndex: props.initialIndex,
      currentMedia: props.mediaList[props.initialIndex],
      controlsDisplayed: true,
      forceLoadPhoto: props.forceLoadPhoto || false,
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('didUpdateDimensions', () => {
      this.photoRefs.map(p => p && p.forceUpdate());
      this.openPage(this.state.currentIndex, false);
    });

    this.openPage(this.state.currentIndex, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mediaList.length !== this.mediaList.length) {
      this.mediaList = new Array().concat(nextProps.mediaList);
      this._updatePageIndex(nextProps.initialIndex, nextProps.forceLoadPhoto || this.state.forceLoadPhoto);
    }
  }

  openPage(index, animated) {
    if (!this.scrollView) {
      this._updatePageIndex(index);
      return;
    }

    if (Platform.OS === 'ios') {
      const screenWidth = Dimensions.get('window').width;
      this.scrollView.scrollTo({
        x: index * screenWidth,
        animated,
      });
    } else {
      this.scrollView.setPageWithoutAnimation(index);
    }

    this._updatePageIndex(index);
  }

  _updatePageIndex(index, force) {
    this.setState({
      currentIndex: index,
      currentMedia: this.props.mediaList[index],
    }, () => {
      this._triggerTopBarStatus();
      this._triggerPhotoLoad(index, force);

      this._updateTitle(index);
    });
  }

  _updateTitle(index) {
    const newTitle = `${index + 1} of ${this.props.dataSource.getRowCount()}`;
    this.props.updateTitle(newTitle);
  }

  _triggerPhotoLoad(index, force) {
    const photo = this.photoRefs[index];
    if (photo) {
      photo.load(force);
    } else {
      // HACK: photo might be undefined when user taps a photo from gridview
      // that hasn't been rendered yet.
      // photo is rendered after listView's scrollTo method call
      // and i'm deferring photo load method for that.
      setTimeout(this._triggerPhotoLoad.bind(this, index), 200);
    }
  }

  _triggerTopBarStatus() {
    const triggerTopBarStatus = this.props.triggerTopBarStatus;

    // action behaviour must be implemented by the client
    // so, call the client method or simply ignore this event
    if (triggerTopBarStatus) {
      const { currentMedia, currentIndex } = this.state;
      triggerTopBarStatus(currentMedia, currentIndex);
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

  _onSingleTapConfirmed() {
    this._toggleControls();
  }

  _onNextButtonTapped() {
    let nextIndex = this.state.currentIndex + 1;
    // go back to the first item when there is no more next item
    if (nextIndex > this.props.dataSource.getRowCount() - 1) {
      nextIndex = 0;
    }
    this.openPage(nextIndex, false);
  }

  _onPreviousButtonTapped() {
    let prevIndex = this.state.currentIndex - 1;
    // go to the last item when there is no more previous item
    if (prevIndex < 0) {
      prevIndex = this.props.dataSource.getRowCount() - 1;
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
    const layoutWidth = event.layoutMeasurement.width;
    if (layoutWidth === 0) {
      return;
    };

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
      this._updatePageIndex(newIndex, this.state.forceLoadPhoto);

      if (this.state.controlsDisplayed) {
        this._toggleControls();
      }
    }
  }

  _onGalleryPageSelected(page) {
    this._onPageSelected(page);
  }

  _renderRow(media: Object, sectionID: number, rowID: number, gallery: Object) {
    const {
      displaySelectionButtons,
      onMediaSelection,
      useCircleProgress,
    } = this.props;

    const screen = Dimensions.get('window');

    return (
      <View key={`row_${rowID}`} style={[styles.flex]}>
        <TouchableWithoutFeedback onPress={this._toggleControls}>
          <Photo
            ref={ref => {
              this.photoRefs[rowID] = ref;
              if (ref) {
                const transformableImage = ref.getTransformableImage();
                if (gallery && gallery.setImageRef) {
                  gallery.setImageRef(rowID, transformableImage);
                };
              };
            }}
            width={screen.width}
            height={screen.height}
            lazyLoad
            useCircleProgress={useCircleProgress}
            mimeTypeOrExt={media.mimeTypeOrExt}
            notSupportedError={this.props.notSupportedError}
            uri={media.photo}
            transformable={true}
            displaySelectionButtons={displaySelectionButtons}
            selected={media.selected}
            onSelection={(isSelected) => {
              onMediaSelection(rowID, isSelected);
            }}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  _renderScrollableContent() {
    const { dataSource, mediaList, useGallery, initialIndex } = this.props;
    if (useGallery) {
      return (
        <Gallery
          ref={(ref) => this.gallery = ref}
          style={{flex: 1, backgroundColor: 'black'}}
          onPageSelected={this._onGalleryPageSelected}
          onSingleTapConfirmed={this._onSingleTapConfirmed}
          // initialPage={initialIndex}
          initialPage={this.state.currentIndex}
          images={mediaList}
          customItem={(pageData, pageId, layout, gallery) => {
            return this._renderRow(pageData, 0, pageId, gallery);
          }}
        />
      );
    };

    if (Platform.OS === 'android') {
      return (
        <ViewPagerAndroid
          style={styles.flex}
          ref={scrollView => this.scrollView = scrollView}
          onPageSelected={this._onPageSelected}
        >
          {mediaList.map((child, idx) => this._renderRow(child, 0, idx))}
        </ViewPagerAndroid>
      );
    }

    return (
      <ListView
        ref={scrollView => this.scrollView = scrollView}
        dataSource={dataSource}
        renderRow={this._renderRow}
        onScroll={this._onScroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        scrollEventThrottle={16}
      />
    );
  }

  render() {
    const {
      displayNavArrows,
      displayActionButton,
      onGridButtonTap,
      enableGrid,
    } = this.props;
    const { controlsDisplayed, currentMedia } = this.state;

    return (
      <View style={styles.flex}>
        <StatusBar
          hidden={!controlsDisplayed}
          showHideTransition={'slide'}
          barStyle={'light-content'}
          animated
          translucent
        />
        {this._renderScrollableContent()}
        <BottomBar
          displayed={controlsDisplayed}
          height={Constants.TOOLBAR_HEIGHT}
          displayNavArrows={displayNavArrows}
          displayGridButton={enableGrid}
          displayActionButton={displayActionButton}
          caption={currentMedia.caption}
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
