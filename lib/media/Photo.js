import React, { PropTypes, Component } from 'react';
import {
  Dimensions,
  PanResponder,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ProgressBarAndroid,
  Platform,
} from 'react-native';

import * as Progress from 'react-native-progress';
import TransformableImage from 'react-native-transformable-image';

export default class Photo extends Component {

  static propTypes = {
    /*
     * image uri or opaque type that is passed as source object to image component
     */
    uri: PropTypes.oneOfType([
      // assets or http url
      PropTypes.string,
      // Opaque type returned by require('./image.jpg')
      PropTypes.number,
    ]).isRequired,

    /*
     * displays a check button above the image
     */
    displaySelectionButtons: PropTypes.bool,

    /*
     * image resizeMode
     */
    resizeMode: PropTypes.string,

    /*
     * if transformable then photo can be zoomed
     */
    transformable: PropTypes.bool,

    /*
     * these values are set to image and it's container
     * screen width and height are used if those are not defined
     */
    width: PropTypes.number,
    height: PropTypes.number,


    /*
     * when lazyLoad is true,
     * image is not loaded until 'load' method is manually executed
     */
    lazyLoad: PropTypes.bool,

    /*
     * displays selected or unselected icon based on this prop
     */
    selected: PropTypes.bool,

    /*
     * size of selection images are decided based on this
     */
    thumbnail: PropTypes.bool,

    /*
     * executed when user selects/unselects the photo
     */
    onSelection: PropTypes.func,

    /*
     * image tag generated using require(asset_path)
     */
    progressImage: PropTypes.number,

    /*
     * displays Progress.Circle instead of default Progress.Bar
     * it's ignored when progressImage is also passed.
     * iOS only
     */
    useCircleProgress: PropTypes.bool,

    /*
     * supported mimetype
     */
    mimeTypeOrExt: PropTypes.string,

    /*
     * not supported error
     */
    notSupportedError: PropTypes.string,
  };

  static defaultProps = {
    resizeMode: 'contain',
    thumbnail: false,
    lazyLoad: false,
    selected: false,
    transformable: false,
    mimeTypeOrExt: 'jpg',
    notSupportedError: 'sorry, not supported!'
  };

  constructor(props) {
    super(props);

    this._onProgress = this._onProgress.bind(this);
    this._onError = this._onError.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._toggleSelection = this._toggleSelection.bind(this);

    this.supportedMimeType = [
      {
        mimeType: 'image/jpeg',
        ext: [
          'jpe',
          'jpeg',
          'jpg',
        ],
      },
      {
        mimeType: 'image/png',
        ext: [
          'png',
          'x-png',
        ],
      },
    ]

    const { lazyLoad, uri } = props;

    this.state = {
      uri: lazyLoad ? null : uri,
      progress: 0,
      error: false,
    };
  }

  load(force) {
    if (this.transformableImage) {
      const viewTransformer = this.transformableImage.getViewTransformerInstance();
      viewTransformer && viewTransformer.setState({
        scale: 1,
        translateX: 0,
        translateY: 0,
      });
    };
    if (force === true) {
      this.setState({
        uri: this.props.uri,
      });
    } else {
      if (!this.state.uri) {
        this.setState({
          uri: this.props.uri,
        });
      }
    }
  }

  getTransformableImage() {
    return this.transformableImage;
  }

  getSupportedMimeType() {
    return this.supportedMimeType;
  }

  isSupported(mimeTypeOrExt) {
    if (typeof mimeTypeOrExt !== 'string') return false;
    let supported = false;
    this.supportedMimeType.map((mimeTypeObject, index) => {
        if (supported) {
          return true;
        };
        if (mimeTypeOrExt === mimeTypeObject.mimeType) {
            supported = true;
            return supported;
        } else {
          let supportedExt = mimeTypeObject.ext;
          supportedExt.map((ext, extIndex) => {
              if (mimeTypeOrExt === ext) {
                supported = true;
                return supported;
              };
          });
        }
    });
    return supported;
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
    // onSelection is resolved in index.js
    // and refreshes the dataSource with new media object
    this.props.onSelection(!this.props.selected);
  }

  _renderProgressIndicator() {
    const { progressImage, useCircleProgress } = this.props;
    const { progress } = this.state;

    if (progress < 1) {
      if (progressImage) {
        return (
          <Image
            source={progressImage}
          />
        );
      }

      if (Platform.OS === 'android') {
        return <ProgressBarAndroid progress={progress} />;
      }

      const ProgressElement = useCircleProgress ? Progress.Circle : Progress.Bar;
      return (
        <ProgressElement
          progress={progress}
          thickness={20}
          color={'white'}
        />
      );
    }
    return null;
  }

  _renderNotSupportedType() {
    let notSupportedErrorText = this.props.notSupportedError || 'sorry, not supported!';
    return (
      <View 
        style={styles.container}
      >
        <Image
          source={require('../../Assets/image-error.png')}
        />
        <Text 
          style={{
            color: 'white',
          }}
        >
          {notSupportedErrorText}
        </Text>
      </View>
    );
  }

  _renderErrorIcon() {
    return (
      <View>
        <Image
          source={require('../../Assets/image-error.png')}
        />
      </View>
    );
  }

  _renderSelectionButton() {
    const { progress } = this.state;
    const { displaySelectionButtons, selected, thumbnail } = this.props;

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
    const { resizeMode, width, height, transformable } = this.props;
    const screen = Dimensions.get('window');
    const { uri, error } = this.state;

    let source;
    if (uri) {
      // create source objects for http/asset strings
      // or directly pass uri number for local files
      source = typeof uri === 'string' ? { uri } : uri;
    }

    // i had to get window size and set photo size here
    // to be able to respond device orientation changes in full screen mode
    // FIX_ME: when you have a better option
    const sizeStyle = {
      width: width || screen.width,
      height: height || screen.height,
    };

    let errorOrProgressView = error ? this._renderErrorIcon() : this._renderProgressIndicator();
    if (!this.isSupported(this.props.mimeTypeOrExt)) {
      errorOrProgressView = this._renderNotSupportedType();
    };

    return (
      <View style={[styles.container, sizeStyle]}>
        {errorOrProgressView}
        {
          transformable ? (
            <TransformableImage
              {...this.props}
              ref={ref => this.transformableImage = ref}
              style={[styles.image, sizeStyle]}
              source={source}
              onProgress={this._onProgress}
              onError={this._onError}
              onLoad={this._onLoad}
              resizeMode={resizeMode}
            />
          ) : (
            <Image
              {...this.props}
              style={[styles.image, sizeStyle]}
              source={source}
              onProgress={this._onProgress}
              onError={this._onError}
              onLoad={this._onLoad}
              resizeMode={resizeMode}
            />
          )
        }
        {this._renderSelectionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
