import React, {
  Image,
  Text,
  StyleSheet,
  PropTypes,
  TouchableOpacity,
  View,
} from 'react-native';

import { BarContainer, BAR_POSITIONS } from './BarContainer';

export default class BottomBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    caption: PropTypes.string,
    displayNavArrows: PropTypes.bool,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
  };

  static defaultProps = {
    displayed: false,
    caption: '',
    displayNavArrows: false,
    onPrev: () => {},
    onNext: () => {},
  };

  constructor(props) {
    super(props);
  }

  _renderNavArrows() {
    const { displayNavArrows, onPrev, onNext } = this.props;
    const arrows = [];

    if (displayNavArrows) {
      const prevArrow = (
        <TouchableOpacity
          key="prev_arrow"
          style={styles.button}
          onPress={onPrev}
        >
          <Image
            source={require('../../Assets/arrow-left.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      );
      const nextArrow = (
        <TouchableOpacity
          key="next_arrow"
          style={styles.button}
          onPress={onNext}
        >
          <Image
            source={require('../../Assets/arrow-right.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      );
      arrows.push(prevArrow, nextArrow);
    }

    return arrows;
  }

  render() {
    const { displayed, caption } = this.props;

    return (
      <BarContainer
        position={BAR_POSITIONS.BOTTOM}
        displayed={displayed}
        height={70}
        style={styles.container}
      >

        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{caption}</Text>
        </View>

        <View style={styles.buttonContainer}>

          <Image
            style={styles.buttonImage}
            source={require('../../Assets/grid-button.png')}
          />

          {this._renderNavArrows()}

          <Image
            style={styles.buttonImage}
            source={require('../../Assets/share-button.png')}
          />

        </View>

      </BarContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  captionContainer: {
    flex: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
  },
  caption: {
    color: 'white',
    alignSelf: 'center',
    paddingTop: 8,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    width: 40,
  },
  buttonImage: {
    marginTop: 8,
  },
});
