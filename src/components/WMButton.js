import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import WMColors from '../lib/WMColors'

export default class WMButton extends Component {

  props: {
    disabled: boolean,
    active: boolean,
    toggle: boolean,
    caption: string,
    style: any,
    onPress: () => void,
    iconName: ?string,
    iconStyle: any
  }

  static defaultProps = {
    toggle: false,
    active: false
  }

  render() {
    const {caption, disabled, onPress, iconName, iconStyle, toggle, active} = this.props
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.container, active ? styles.active : undefined, this.props.style]}>
        {iconName ?
          <Icon
            name={iconName}
            style={[styles.icon, toggle ? styles.toggleIcon : undefined, iconStyle]}
            size={30}/>
          : undefined
        }
        {caption ?
          <Text style={[styles.text, disabled ? styles.disabled : undefined]}>
            {caption}
          </Text>
          : undefined
        }
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
  },
  active: {
    backgroundColor: WMColors.darkText,
  },
  toggleIcon: {
    color: 'white'
  }
});
