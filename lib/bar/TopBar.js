import React, {
  Text,
  PropTypes,
  StyleSheet,
} from 'react-native';

import { BarContainer } from './BarContainer';

export default class TopBar extends React.Component {

  static propTypes = {
    displayed: PropTypes.bool,
    title: PropTypes.string,
    height: PropTypes.number,
  };

  static defaultProps = {
    displayed: false,
    title: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { displayed, title, height } = this.props;

    return (
      <BarContainer
        style={styles.container}
        displayed={displayed}
        height={height}
      >
        <Text style={styles.title}>{title}</Text>
      </BarContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    paddingTop: 22,
    color: 'white',
  },
});
