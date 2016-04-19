import React, {
  PropTypes,
  ListView,
  View,
  StyleSheet,
} from 'react-native';

import GridContainer from './GridContainer';
import FullScreenContainer from './FullScreenContainer';

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

    this.state = {
      fullScreen: !props.startOnGrid,
      currentIndex: props.initialIndex,
    };
  }

  _onGridPhotoTap(index) {
    this.setState({
      fullScreen: true,
      currentIndex: index,
    });
  }

  _onGridButtonTap(index) {
    this.setState({
      fullScreen: false,
    });
  }

  render() {
    const { dataSource, displayNavArrows } = this.props;
    const { fullScreen, currentIndex } = this.state;

    if (fullScreen) {
      return (
        <FullScreenContainer
          style={styles.container}
          dataSource={dataSource}
          initialIndex={currentIndex}
          displayNavArrows={displayNavArrows}
          onGridButtonTap={this._onGridButtonTap}
        />
      );
    }

    return (
      <GridContainer
        style={styles.container}
        dataSource={dataSource}
        onPhotoTap={this._onGridPhotoTap}
      />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
