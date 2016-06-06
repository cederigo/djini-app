import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import WMColors from '../lib/WMColors'

export default class WMButton extends Component {

  props: {
    // type: 'primary' | 'secondary' | 'bordered';
    // icon: number;
    disabled: boolean,
    caption: string,
    style: any,
    onPress: () => void,
    iconName: ?string
  };

  render() {
    const {caption, disabled, onPress, iconName, iconStyle} = this.props
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.container, this.props.style]}>
        {iconName ? <Icon name={iconName} style={[styles.icon, iconStyle]} size={30}/> : undefined }
        <Text style={[styles.text, disabled ? styles.disabled : undefined]}>
          {caption}
        </Text>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: WMColors.whiteThree,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: WMColors.darkText
  },
  icon: {
    color: WMColors.darkText,
  },
  disabled: {
    color: WMColors.disabledText
  }
});
