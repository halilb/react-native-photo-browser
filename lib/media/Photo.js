import React, {
  Component,
  Dimensions,
  Image,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  PropTypes,
} from 'react-native';

import Progress from 'react-native-progress';

export default class Photo extends Component {

  static propTypes = {
    style: View.propTypes.style,
    uri: PropTypes.string,
    displaySelectionButtons: PropTypes.bool,

    /*
     * renders 100x100 image and a simple progress icon when true
     */
    thumbnail: PropTypes.bool,

    /*
     * when lazyLoad is true,
     * image is not loaded until 'load' method is manually executed
     */
    lazyLoad: PropTypes.bool,
  };

  static defaultProps = {
    thumbnail: false,
    lazyLoad: false,
  };

  constructor(props) {
    super(props);

    this._onProgress = this._onProgress.bind(this);
    this._onError = this._onError.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._toggleSelection = this._toggleSelection.bind(this);

    const { lazyLoad, uri } = props;

    this.state = {
      uri: lazyLoad ? '' : uri,
      progress: 0,
      error: false,
      selected: false,
    };
  }

  load() {
    if (!this.state.uri) {
      this.setState({
        uri: this.props.uri,
      });
    }
  }

  _onProgress(event) {
    const progress = event.nativeEvent.loaded / event.nativeEvent.total;
    if (!this.props.thumbnail && progress !== this.state.progress) {
      this.setState({
        progress,
      });
    }
  }

  _onError() {
    this.setState({
      error: true,
      progress: 1,
    });
  }

  _onLoad() {
    this.setState({
      progress: 1,
    });
  }

  _toggleSelection() {
    this.setState({
      selected: !this.state.selected,
    });
  }

  _renderProgressIndicator() {
    const { progress } = this.state;

    if (progress < 1) {
      return (
        <Progress.Circle
          progress={progress}
          thickness={20}
          color={'white'}
        />
      );
    }
    return null;
  }

  _renderErrorIcon() {
    return (
      <Image
        source={require('../../Assets/image-error.png')}
      />
    );
  }

  _renderSelectionButton() {
    const { progress, selected } = this.state;
    const { displaySelectionButtons, thumbnail } = this.props;

    // do not display selection before image is loaded
    if (!displaySelectionButtons || progress < 1) {
      return null;
    }

    let buttonImage;
    if (thumbnail) {
      let icon = require('../../Assets/small-selected-off.png');
      if (selected) {
        icon = require('../../Assets/small-selected-on.png');
      }

      buttonImage = (
        <Image
          source={icon}
          style={styles.thumbnailSelectionIcon}
        />
      );
    } else {
      let icon = require('../../Assets/selected-off.png');
      if (selected) {
        icon = require('../../Assets/selected-on.png');
      }

      buttonImage = (
        <Image
          style={styles.fullScreenSelectionIcon}
          source={icon}
        />
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this._toggleSelection}>
        {buttonImage}
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { style, thumbnail } = this.props;
    const screen = Dimensions.get('window');
    const { uri, error } = this.state;
    let source;
    if (uri) {
      source = {
        uri,
      };
    }

    return (
      <Image
        {...this.props}
        style={[style, styles.container, {
          height: thumbnail ? 100 : screen.height,
          width: thumbnail ? 100 : screen.width,
        }]}
        source={source}
        onProgress={this._onProgress}
        onError={this._onError}
        onLoad={this._onLoad}
        resizeMode={thumbnail ? 'cover' : 'contain'}
      >
        {error ? this._renderErrorIcon() : this._renderProgressIndicator()}
        {this._renderSelectionButton()}
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailSelectionIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  fullScreenSelectionIcon: {
    position: 'absolute',
    top: 60,
    right: 16,
  },
});
