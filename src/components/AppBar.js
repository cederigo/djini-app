import {Actions} from 'react-native-router-flux';

import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import WMColors from '../lib/WMColors'

export class AppBar extends Component {
  props: {
    showBackButton: bool,
    onBack: () => void,
    title: string
  }

  render() {
    const {showBackButton, onBack, title} = this.props
    return (
      <View style={styles.appBar}>
        <View style={styles.left}>
          {showBackButton ? <ActionButton onPress={onBack} iconName="chevron-left" style={styles.backButton}/> : undefined}
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.right}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

AppBar.defaultProps = {
  onBack: () => Actions.pop()
}

export class ActionButton extends React.Component {
  props: {
    disabled: bool,
    onPress: () => void,
    text: string,
    iconName: string,
  }
  render() {
    const {disabled, onPress, text, style, iconName} = this.props
    return (
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0}
        style={[styles.actionButton, style]}
        onPress={() => { if (!disabled) { onPress() }}}>
        {iconName ? 
          <Icon style={[styles.actionIcon, disabled ? styles.disabled : undefined]} name={iconName} size={30} /> :
          <Text style={[styles.actionText, disabled ? styles.disabled : undefined]}>{text}</Text>
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  appBar: {
    marginTop: 20, //status bar
    borderBottomWidth: 1,
    borderBottomColor: WMColors.lightText,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  left: {
    flex: 1,
    paddingLeft: 5
  },
  title: {
    textAlign: 'center',
    color: WMColors.lightText,
    flex: 2,
    fontSize: 20,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 5,
    flex: 1,
  },
  actionButton: {
    padding: 0,
  },
  disabled: {
    color: WMColors.disabledText
  },
  actionIcon: {
    color: WMColors.darkText
  },
})