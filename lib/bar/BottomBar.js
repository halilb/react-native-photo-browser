import React, {
  Image,
  Text,
  StyleSheet,
  PropTypes,
  View,
} from 'react-native';

import { BarContainer, BAR_POSITIONS } from './BarContainer';

export default class BottomBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    caption: PropTypes.string,
  };

  static defaultProps = {
    displayed: false,
    caption: '',
  };

  constructor(props) {
    super(props);
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
            style={styles.button}
            source={require('../../Assets/grid-button.png')}
          />
          <Image
            style={styles.button}
            source={require('../../Assets/arrow-left.png')}
          />
          <Image
            style={styles.button}
            source={require('../../Assets/arrow-right.png')}
          />
          <Image
            style={styles.button}
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
    paddingTop: 8,
  },
  button: {
  },
});
