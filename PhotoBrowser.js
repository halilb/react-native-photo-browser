import React, {
  Dimensions,
  ListView,
  View,
  StyleSheet,
  PropTypes,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';

import Bar from './Bar';
import Photo from './Photo';

const sizes = Dimensions.get('window');
const screenWidth = sizes.width;
const screenHeight = sizes.height;

export default class PhotoBrowser extends React.Component {

  static propTypes = {
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._renderPhoto = this._renderPhoto.bind(this);
    this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);

    this.photoRefs = [];
    this.state = {
      currentIndex: 0,
      controlsDisplayed: true,
    };
  }

  componentDidMount() {
    this._triggerCurrentPhotoLoad();
  }

  _openPage(index) {
    if (this.state.controlsDisplayed) {
      this._toggleControls();
    }

    this.setState({
      currentIndex: index,
    });
    this._triggerCurrentPhotoLoad();
  }

  _triggerCurrentPhotoLoad() {
    const current = this.photoRefs[this.state.currentIndex];
    current.load();
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
      this._openPage(newIndex);
    }
  }

  _renderPhoto(photo, sectionID, rowID) {
    return (
      <TouchableWithoutFeedback onPress={this._toggleControls}>
        <Photo
          ref={ref => this.photoRefs[rowID] = ref}
          style={styles.fullSize}
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
          style={styles.list}
          dataSource={this.props.dataSource}
          renderRow={this._renderPhoto}
          onScroll={this._onScroll}
          horizontal
          pagingEnabled
          maximumZoomScale={5.0}
          showsHorizontalScrollIndicator={false}
        />

        <Bar
          position={'top'}
          displayed={this.state.controlsDisplayed}
          label={`${this.state.currentIndex + 1} of ${this.props.dataSource.getRowCount()}`}
        />

        <Bar
          position={'bottom'}
          displayed={this.state.controlsDisplayed}
          label={'Test'}
        />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  fullSize: {
    width: screenWidth,
    height: screenHeight,
  },
  list: {
    flex: 1,
  },
});
