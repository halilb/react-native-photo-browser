import React, {
  Animated,
  Dimensions,
  PropTypes,
  ListView,
  View,
  StyleSheet,
} from 'react-native';

import { TopBar } from './bar';

import GridContainer from './GridContainer';
import FullScreenContainer from './FullScreenContainer';

const TOOLBAR_HEIGHT = 54;

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

    /*
     * Whether to start on the grid of thumbnails instead of the first photo
     */
    startOnGrid: PropTypes.bool,
  };

  static defaultProps = {
    initialIndex: 0,
    displayNavArrows: false,
    startOnGrid: false,
  };

  constructor(props, context) {
    super(props, context);

    this._onGridPhotoTap = this._onGridPhotoTap.bind(this);
    this._onGridButtonTap = this._onGridButtonTap.bind(this);
    this._updateTitle = this._updateTitle.bind(this);
    this._toggleTopBar = this._toggleTopBar.bind(this);

    const { startOnGrid, initialIndex } = props;

    this.state = {
      isFullScreen: !startOnGrid,
      fullScreenAnim: new Animated.Value(startOnGrid ? 0 : 1),
      currentIndex: initialIndex,
      displayTopBar: true,
    };
  }

  _onGridPhotoTap(index) {
    this.refs.fullScreenContainer.openPage(index, false);
    this._toggleFullScreen(true);
  }

  _onGridButtonTap() {
    this._toggleFullScreen(false);
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
    const { dataSource, displayNavArrows } = this.props;
    const { isFullScreen, fullScreenAnim, currentIndex, title, displayTopBar } = this.state;
    const screenHeight = Dimensions.get('window').height;

    return (
      <View style={styles.container}>
        <Animated.View style={{
          height: screenHeight,
          marginTop: fullScreenAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screenHeight * -1 - TOOLBAR_HEIGHT],
          }),
        }}>
          <GridContainer
            dataSource={dataSource}
            onPhotoTap={this._onGridPhotoTap}
          />
        </Animated.View>

        <FullScreenContainer
          ref="fullScreenContainer"
          dataSource={dataSource}
          initialIndex={currentIndex}
          displayNavArrows={displayNavArrows}
          onGridButtonTap={this._onGridButtonTap}
          updateTitle={this._updateTitle}
          toggleTopBar={this._toggleTopBar}
        />

        {/* this is here for bigger z-index purpose */}
        <TopBar
          height={TOOLBAR_HEIGHT}
          displayed={displayTopBar}
          title={isFullScreen ? title : `${dataSource.getRowCount()} photos`}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: TOOLBAR_HEIGHT,
    backgroundColor: 'black',
  },
});
