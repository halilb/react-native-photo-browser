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
    initialIndex: PropTypes.number,
  };

  constructor(props, context) {
    super(props, context);

    this._renderPhoto = this._renderPhoto.bind(this);
    this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);

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
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={!this.state.controlsDisplayed}
          showHideTransition={'slide'}
          barStyle={'light-content'}
          animated
        />

        <ListView
          ref="list"
          style={styles.list}
          dataSource={this.props.dataSource}
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
          displayed={this.state.controlsDisplayed}
          title={`${this.state.currentIndex + 1} of ${this.props.dataSource.getRowCount()}`}
        />

        <BottomBar
          displayed={this.state.controlsDisplayed}
          caption={'Test Caption'}
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
