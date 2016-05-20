import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import WMColors from '../lib/WMColors'

export default class WMButton extends Component {

  props: {
    // type: 'primary' | 'secondary' | 'bordered';
    // icon: number;
    disabled: boolean;
    caption: string;
    style: any;
    onPress: () => void;
  };

  render() {
    const {caption, disabled, onPress} = this.props
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.container, this.props.style]}>
        <Text style={[styles.text, disabled ? styles.disabled : undefined]}>
          {caption}
        </Text>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: WMColors.white,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    letterSpacing: 1,
    fontSize: 16,
    fontWeight: '500',
    color: WMColors.darkText
  },
  disabled: {
    color: WMColors.disabledText
  }
});
