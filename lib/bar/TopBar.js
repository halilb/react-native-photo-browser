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
  };

  static defaultProps = {
    displayed: false,
    title: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { displayed, title } = this.props;

    return (
      <BarContainer displayed={displayed}>
        <Text style={styles.title}>{title}</Text>
      </BarContainer>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    paddingTop: 22,
    color: 'white',
  },
});
