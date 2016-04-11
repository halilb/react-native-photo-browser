import React, {
  Dimensions,
  Image,
  ListView,
  View,
  StyleSheet,
  PropTypes,
} from 'react-native';

const sizes = Dimensions.get('window');
const screenWidth = sizes.width;
const screenHeight = sizes.height;

export default class PhotoBrowser extends React.Component {

  static propTypes = {
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._renderImage = this._renderImage.bind(this);
  }

  _renderImage(image) {
    return (
      <Image
        style={styles.image}
        source={{ uri: image }}
        resizeMode="contain"
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          dataSource={this.props.dataSource}
          renderRow={this._renderImage}
          horizontal
          pagingEnabled
          maximumZoomScale={5.0}
          showsHorizontalScrollIndicator={false}
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
  image: {
    width: screenWidth,
    height: screenHeight,
  },
});
