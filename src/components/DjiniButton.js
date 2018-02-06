import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import DjiniText from './DjiniText'

export default class DjiniButton extends Component {

  static propTypes = {
    type: PropTypes.oneOf(['primary', 'danger']),
    disabled: PropTypes.bool,
    caption: PropTypes.string,
    style: PropTypes.any,
    iconName: PropTypes.string,
    iconStyle: PropTypes.any, 
    onPress: PropTypes.func.isRequired,
  }

  render() {
    const {type, caption, disabled, onPress, iconName, iconStyle, style} = this.props
    const buttonStyle = [styles.container, styles[type]]
    const textStyle = [styles.text]
    if (disabled) { textStyle.push(styles.disabled) }
    if (style) { buttonStyle.push(style) }
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={buttonStyle}>
        {iconName ?
          <Icon
            name={iconName}
            style={[styles.icon, iconStyle]}
            size={30}/>
          : undefined
        }
        {caption ?
          <DjiniText style={textStyle}>
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
  primary: {
    backgroundColor: 'rgb(101,104,244)'
  },
  danger: {
    backgroundColor: 'rgb(239,71,98)'
  },
  text: {
    fontSize: 20,
  },
  icon: {
    color: 'white',
  },
  disabled: {
    opacity: 0.5
  }
});