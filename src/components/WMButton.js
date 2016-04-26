import React, {
  Component,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class WMButton extends Component {

  props: {
    // type: 'primary' | 'secondary' | 'bordered';
    // icon: number;
    caption: string;
    style: any;
    onPress: () => void;
  };

  render() {
    const {caption} = this.props
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this.props.onPress}
        activeOpacity={0.8}
        style={[styles.container, this.props.style]}>
        <Text style={[styles.button, styles.caption, styles.primaryCaption]}>
          {caption}
        </Text>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
  },
  icon: {
    marginRight: 12,
  },
  caption: {
    letterSpacing: 1,
    fontSize: 12,
  },
  primaryCaption: {
    color: 'rgb(0, 122, 155)',
  },
});
