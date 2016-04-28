import React, {
  ActionSheetIOS,
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
    style: View.propTypes.style,
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    mediaList: PropTypes.array.isRequired,
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

    /*
     * those props are inherited from main PhotoBrowser component
     * i.e. index.js
     */
    initialIndex: PropTypes.number,
    alwaysShowControls: PropTypes.bool,
    displayActionButton: PropTypes.bool,
    displayNavArrows: PropTypes.bool,
    displaySelectionButtons: PropTypes.bool,
    enableGrid: PropTypes.bool,
    onActionButton: PropTypes.func,
  };

  static defaultProps = {
    initialIndex: 0,
    displayNavArrows: false,
    displaySelectionButtons: false,
    enableGrid: true,
    onGridButtonTap: () => {},
  };

  constructor(props, context) {
    super(props, context);

    this._renderRow = this._renderRow.bind(this);
    this._toggleControls = this._toggleControls.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onNextButtonTapped = this._onNextButtonTapped.bind(this);
    this._onPreviousButtonTapped = this._onPreviousButtonTapped.bind(this);
    this._onActionButtonTapped = this._onActionButtonTapped.bind(this);

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
    const { alwaysShowControls, toggleTopBar } = this.props;

    if (!alwaysShowControls) {
      const controlsDisplayed = !this.state.controlsDisplayed;
      this.setState({
        controlsDisplayed,
      });
      toggleTopBar(controlsDisplayed);
    }
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

  _openActionSheet(url, message) {
    // TODO: handle success/error cases
    ActionSheetIOS.showShareActionSheetWithOptions({
      url,
      message,
    },
    () => {},
    () => {});
  }

  _onActionButtonTapped() {
    const onActionButton = this.props.onActionButton;
    const { currentMedia, currentIndex } = this.state;

    if (onActionButton) {
      // action behaviour is implemented by the client
      // so, skip any logic here and call the client method
      onActionButton(currentMedia, currentIndex);
    } else {
      if (currentMedia.photo.startsWith('assets-library')) {
        // react-native can handle local images
        this._openActionSheet(currentMedia.photo, currentMedia.caption);
      } else {
        // FIXME: converting remote url to base64 is very hacky and does not perform well
        // so, i'm using UIManager to take a snapshot of the image for now
        // this needs to be refined
        const currentPhoto = this.photoRefs[currentIndex];
        currentPhoto.takeSnapshot().then((uri) => {
          this._openActionSheet(uri, currentMedia.caption);
        }).catch(error => alert(error));
      }
    }
  }

  _onScroll(e) {
    const event = e.nativeEvent;
    // do not manipulate scroll if scroll is zoomed currently
    if (event.zoomScale > 1) {
      this.setState({ pagingEnabled: false });
      return;
    }

    const { currentIndex } = this.state;
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
          displaySelectionButtons={displaySelectionButtons}
          selected={media.selected}
          onSelection={(isSelected) => {
            onMediaSelection(rowID, isSelected);
          }}
        />
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const {
      dataSource,
      displayNavArrows,
      displayActionButton,
      onGridButtonTap,
      enableGrid,
    } = this.props;
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
          dataSource={dataSource}
          renderRow={this._renderRow}
          onScroll={this._onScroll}
          horizontal
          pagingEnabled
          maximumZoomScale={3.0}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
          scrollEventThrottle={16}
        />

        <BottomBar
          displayed={controlsDisplayed}
          displayNavArrows={displayNavArrows}
          displayGridButton={enableGrid}
          displayActionButton={displayActionButton}
          caption={currentMedia.caption}
          onPrev={this._onPreviousButtonTapped}
          onNext={this._onNextButtonTapped}
          onGrid={onGridButtonTap}
          onAction={this._onActionButtonTapped}
        />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
