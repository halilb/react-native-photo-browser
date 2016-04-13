import React, {
  Animated,
  Dimensions,
  Text,
  ListView,
  View,
  StyleSheet,
  PropTypes,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';

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
      showControls: true,
      controlAnim: new Animated.Value(1),
    };
  }

  componentDidMount() {
    this._triggerCurrentPhotoLoad();
  }

  _onScroll(e) {
    const event = e.nativeEvent;
    const layoutWidth = event.layoutMeasurement.width;
    const currentIndex = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth);

    if (this.state.showControls && currentIndex !== this.state.currentIndex) {
      this._toggleControls();
    }

    this.setState({
      currentIndex,
    });
    this._triggerCurrentPhotoLoad();
  }

  _triggerCurrentPhotoLoad() {
    const current = this.photoRefs[this.state.currentIndex];
    current.load();
  }

  _toggleControls() {
    const showControls = !this.state.showControls;

    this.setState({
      showControls,
    });

    Animated.timing(this.state.controlAnim, {
      toValue: showControls ? 1 : 0,
      duration: 300,
    }).start();
  }

  _renderPhoto(photo, sectionID, rowID) {
    return (
      <TouchableWithoutFeedback onPress={this._toggleControls}>
        <Photo
          ref={ref => this.photoRefs[rowID] = ref}
          style={[styles.fullSize, styles.image]}
          uri={photo}
        />
      </TouchableWithoutFeedback>
    );
  }

  _renderTopBar() {
    return (
      <Animated.View style={[styles.barContainer, {
        opacity: this.state.controlAnim,
        transform: [{
          translateY: this.state.controlAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-54, 0],
          }),
        }],
      }]}>
        <Text
          style={[styles.text, styles.title]}
        >{`${this.state.currentIndex + 1} of ${this.props.dataSource.getRowCount()}`}</Text>
      </Animated.View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={!this.state.showControls}
          showHideTransition={'slide'}
          barStyle={'light-content'}
          animated
        />

        {this._renderTopBar()}

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
  text: {
    color: 'white',
  },
  title: {
    fontWeight: '700',
    paddingTop: 22,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 54,
    marginTop: 16,
    backgroundColor: '#141414',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
