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

import { BottomBar } from './bar';
import { Photo } from './media';

export default class FullScreenContainer extends React.Component {

  static propTypes = {
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    mediaList: PropTypes.array.isRequired,
    initialIndex: PropTypes.number,
    displayNavArrows: PropTypes.bool,
    displaySelectionButtons: PropTypes.bool,

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
  };

  static defaultProps = {
    initialIndex: 0,
    displayNavArrows: false,
    displaySelectionButtons: false,
    onGridButtonTap: () => {},
  };

  constructor(props, context) {
    super(props, context);

    this._renderRow = this._renderRow.bind(this);
    this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onNextButtonTapped = this._onNextButtonTapped.bind(this);
    this._onPreviousButtonTapped = this._onPreviousButtonTapped.bind(this);

    this.photoRefs = [];
    this.state = {
      currentIndex: props.initialIndex,
      currentMedia: props.mediaList[props.initialIndex],
      controlsDisplayed: true,
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('didUpdateDimensions', () => {
      this.photoRefs.map(p => p.forceUpdate());
      this.openPage(this.state.currentIndex, false);
    });

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
      currentMedia: this.props.mediaList[index],
    }, () => {
      this._triggerPhotoLoad(index);

      const newTitle = `${index + 1} of ${this.props.dataSource.getRowCount()}`;
      this.props.updateTitle(newTitle);
    });
  }

  _triggerPhotoLoad(index) {
    const photo = this.photoRefs[index];
    if (photo) {
      photo.load();
    }
  }

  _toggleControls() {
    const controlsDisplayed = !this.state.controlsDisplayed;

    this.setState({
      controlsDisplayed,
    });
    this.props.toggleTopBar(controlsDisplayed);
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

  _renderRow(media: Object, sectionID: number, rowID: number) {
    const { displaySelectionButtons, onMediaSelection } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this._toggleControls}>
        <Photo
          ref={ref => this.photoRefs[rowID] = ref}
          uri={media.photo}
          displaySelectionButtons={this.props.displaySelectionButtons}
          selected={media.selected}
          onSelection={(isSelected) => {
            onMediaSelection(rowID, isSelected);
          }}
        />
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { dataSource, displayNavArrows, onGridButtonTap } = this.props;
    const { controlsDisplayed, currentMedia } = this.state;

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
          renderRow={this._renderRow}
          onScroll={this._onScroll}
          horizontal
          pagingEnabled
          maximumZoomScale={5.0}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
          scrollEventThrottle={16}
        />

        <BottomBar
          displayed={controlsDisplayed}
          displayNavArrows={displayNavArrows}
          caption={currentMedia.caption}
          onPrev={this._onPreviousButtonTapped}
          onNext={this._onNextButtonTapped}
          onGrid={onGridButtonTap}
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
