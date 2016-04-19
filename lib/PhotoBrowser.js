import React, {
  DeviceEventEmitter,
  Dimensions,
  ListView,
  View,
  StyleSheet,
  PropTypes,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';

import { TopBar, BottomBar } from './bar';
import { Photo } from './media';

export default class PhotoBrowser extends React.Component {

  static propTypes = {
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,

    /*
     * set the current visible photo before displaying
     */
    initialIndex: PropTypes.number,

    /*
     * Whether to display left and right nav arrows on bottom toolbar
     */
    displayNavArrows: PropTypes.bool,
  };

  static defaultProps = {
    initialIndex: 0,
    displayNavArrows: false,
  };

  constructor(props, context) {
    super(props, context);

    this._renderPhoto = this._renderPhoto.bind(this);
    this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onNextButtonTapped = this._onNextButtonTapped.bind(this);
    this._onPreviousButtonTapped = this._onPreviousButtonTapped.bind(this);

    this.photoRefs = [];
    this.state = {
      currentIndex: props.initialIndex,
      controlsDisplayed: true,
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('didUpdateDimensions', () => {
      this.photoRefs.map(p => p.forceUpdate());
      this.openPage(this.state.currentIndex, false);
    });
    this._triggerCurrentPhotoLoad();
    this.openPage(this.state.currentIndex, false);
  }

  openPage(index, animated) {
    const screenWidth = Dimensions.get('window').width;

    this.refs.list.scrollTo({
      x: index * screenWidth,
      animated,
    });
    this._updatePageIndex(index);
  }

  _updatePageIndex(index) {
    this.setState({
      currentIndex: index,
    });
    this._triggerCurrentPhotoLoad();
  }

  _triggerCurrentPhotoLoad() {
    const current = this.photoRefs[this.state.currentIndex];
    if (current) {
      current.load();
    }
  }

  _toggleControls() {
    const controlsDisplayed = !this.state.controlsDisplayed;

    this.setState({
      controlsDisplayed,
    });
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

  _onScroll(e) {
    const { currentIndex } = this.state;
    const event = e.nativeEvent;
    const layoutWidth = event.layoutMeasurement.width;
    const newIndex = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth);

    if (currentIndex !== newIndex) {
      this._updatePageIndex(newIndex);

      if (this.state.controlsDisplayed) {
        this._toggleControls();
      }
    }
  }

  _renderPhoto(photo, sectionID, rowID) {
    return (
      <TouchableWithoutFeedback onPress={this._toggleControls}>
        <Photo
          ref={ref => this.photoRefs[rowID] = ref}
          uri={photo}
        />
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { dataSource, displayNavArrows } = this.props;
    const { controlsDisplayed, currentIndex } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          hidden={!controlsDisplayed}
          showHideTransition={'slide'}
          barStyle={'light-content'}
          animated
        />

        <ListView
          ref="list"
          style={styles.list}
          dataSource={dataSource}
          renderRow={this._renderPhoto}
          onScroll={this._onScroll}
          horizontal
          pagingEnabled
          maximumZoomScale={5.0}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
          scrollEventThrottle={16}
        />

        <TopBar
          displayed={controlsDisplayed}
          title={`${currentIndex + 1} of ${dataSource.getRowCount()}`}
        />

        <BottomBar
          displayed={controlsDisplayed}
          displayNavArrows={displayNavArrows}
          caption={'Test Caption'}
          onPrev={this._onPreviousButtonTapped}
          onNext={this._onNextButtonTapped}
        />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  list: {
    flex: 1,
  },
});
