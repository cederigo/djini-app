import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import DjiniText from './DjiniText'
import WMColors from '../lib/WMColors'

export default class DjiniButton extends Component {

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
          <DjiniText style={[styles.text, disabled ? styles.disabled : undefined]}>
            {caption}
          </DjiniText>
          : undefined
        }
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 20,
  },
  icon: {
    color: 'white',
  },
  disabled: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  active: {
    backgroundColor: WMColors.darkText,
  },
  toggleIcon: {
    color: 'white'
  }
});
