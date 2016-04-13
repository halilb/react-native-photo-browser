import React, {
  Component,
  Image,
  StyleSheet,
  View,
  PropTypes,
} from 'react-native';

import Progress from 'react-native-progress';

export default class Photo extends Component {

  static propTypes = {
    style: View.propTypes.style,
    uri: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._onProgress = this._onProgress.bind(this);
    this._onError = this._onError.bind(this);
    this._onLoad = this._onLoad.bind(this);

    this.state = {
      uri: '',
      progress: 1,
    };
  }

  load() {
    if (!this.state.uri) {
      this.setState({
        uri: this.props.uri,
        progress: 0,
      });
    }
  }

  _onProgress(event) {
    const progress = event.nativeEvent.loaded / event.nativeEvent.total;
    if (progress !== this.state.progress) {
      this.setState({
        progress,
      });
    }
  }

  _onError() {
    this.setState({
      progress: 1,
    });
  }

  _onLoad() {
    this.setState({
      progress: 1,
    });
  }

  _renderProgressIndicator() {
    const { progress } = this.state;

    if (progress < 1) {
      return (
        <Progress.Circle
          progress={progress}
          thickness={20}
        />
      );
    }
    return null;
  }

  render() {
    const { style } = this.props;
    const { uri } = this.state;
    let source;
    if (uri) {
      source = {
        uri,
      };
    }

    return (
      <Image
        {...this.props}
        style={[style, styles.container]}
        source={source}
        onProgress={this._onProgress}
        onError={this._onError}
        onLoad={this._onLoad}
        resizeMode={'contain'}
      >
        {this._renderProgressIndicator()}
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
