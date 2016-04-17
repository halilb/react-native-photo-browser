import React, {
  Animated,
  Component,
  StyleSheet,
  PropTypes,
  View,
} from 'react-native';

const HEIGHT = 54;

const BAR_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

class BarContainer extends Component {

  static propTypes = {
    position: PropTypes.oneOf([BAR_POSITIONS.TOP, BAR_POSITIONS.BOTTOM]),
    displayed: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    position: BAR_POSITIONS.TOP,
    displayed: false,
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
    const { position, children } = this.props;
    const isBottomBar = position === BAR_POSITIONS.BOTTOM;

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
      {children}
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
});

export {
  BarContainer,
  BAR_POSITIONS,
};
