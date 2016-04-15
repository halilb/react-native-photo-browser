import React, {
  Animated,
  Component,
  StyleSheet,
  Text,
  PropTypes,
  View,
} from 'react-native';

const HEIGHT = 54;
const POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

export default class Bar extends Component {

  static propTypes = {
    position: PropTypes.oneOf([POSITIONS.TOP, POSITIONS.BOTTOM]),
    displayed: PropTypes.bool,
    label: PropTypes.string,
  };

  static defaultProps = {
    position: POSITIONS.TOP,
  };

  constructor(props) {
    super(props);

    this.state = {
      animation: new Animated.Value(1),
    };
  }

  componentWillReceiveProps(nextProps) {
    Animated.timing(this.state.animation, {
      toValue: nextProps.displayed ? 1 : 0,
      duration: 300,
    }).start();
  }

  render() {
    const { position, label } = this.props;
    const isBottomBar = position === POSITIONS.BOTTOM;

    return (
      <Animated.View
        style={[styles.container,
          isBottomBar ? styles.bottomBar : styles.topBar,
          {
            opacity: this.state.animation,
            transform: [{
              translateY: this.state.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [isBottomBar ? HEIGHT : HEIGHT * -1, 0],
              }),
            }],
          },
        ]}
      >
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: HEIGHT,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
  },
  topBar: {
    top: 0,
  },
  bottomBar: {
    bottom: 0,
  },
  label: {
    fontWeight: '700',
    paddingTop: 22,
    color: 'white',
  },
});
