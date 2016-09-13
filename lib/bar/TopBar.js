import React, { PropTypes } from 'react';
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { BarContainer } from './BarContainer';

export default class TopBar extends React.Component {

  static PropTypes = {
    displayed: React.PropTypes.bool,
    title: React.PropTypes.string,
    height: React.PropTypes.number,
    onBack: React.PropTypes.func,
  };

  static defaultProps = {
    displayed: false,
    title: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      displayed,
      title,
      height,
      onBack,
      onTopRight,
      topRightView,
      topRightStyle,
    } = this.props;

    return (
      <BarContainer
        style={styles.container}
        displayed={displayed}
        height={height}
      >
        <TouchableOpacity style={styles.backContainer} onPress={onBack}>
          <Image source={require('../../Assets/angle-left.png')} />
          {
            Platform.OS === 'ios' &&
            <Text style={[styles.text, styles.backText]}>Back</Text>
          }
        </TouchableOpacity>
        <Text style={styles.text}>{title}</Text>
        <TouchableOpacity style={[styles.topRightContainer, topRightStyle]} onPress={onTopRight}>
          {topRightView}
        </TouchableOpacity>
      </BarContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  backContainer: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    top: 16,
  },
  backText: {
    paddingTop: 14,
    marginLeft: -10,
  },
  topRightContainer: {
    position: 'absolute',
    flexDirection: 'row',
    right: 0,
    top: 16,
  },
});
