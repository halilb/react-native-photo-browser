import React, {
  Text,
  StyleSheet,
  PropTypes,
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
      <BarContainer position={BAR_POSITIONS.BOTTOM} displayed={displayed}>
        <Text style={styles.caption}>{caption}</Text>
      </BarContainer>
    );
  }
}

const styles = StyleSheet.create({
  caption: {
    fontWeight: '700',
    paddingTop: 22,
    color: 'white',
  },
});
