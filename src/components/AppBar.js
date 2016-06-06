import {Actions} from 'react-native-router-flux';

import React, {Component, PropTypes} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';
import WMColors from '../lib/WMColors'

export class AppBar extends Component {
  props: {
    showBackButton: bool,
    onBack: () => void,
    title: string,
    children: React.PropTypes.element
  }

  static defaultProps = {
    onBack: () => Actions.pop()
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

export class SearchBar extends Component {

  constructor(props) {
    super(props)
    this.startSearch = this.startSearch.bind(this)
    this.endSearch = this.endSearch.bind(this)
    this.state = {
      searchActive: false
    }
  }

  startSearch() {
    this.setState({searchActive: true})
  }

  endSearch() {
    const {onSearchEnd} = this.props
    this.setState({searchActive: false})
    onSearchEnd && onSearchEnd()
  }

  render() {
    const {title, onChangeText, inputValue, inputPlaceholder} = this.props
    return (
      <View style={styles.appBar}>
        {this.state.searchActive ? 
          <TextInput
            onChangeText={onChangeText}
            autoFocus={true}
            autoCapitalize='none'
            style={styles.searchInput}
            value={inputValue}
            placeholder={inputPlaceholder}
          />
          : <View style={styles.left}/>
        }
        {this.state.searchActive ?
          undefined
          : <Text style={styles.title} numberOfLines={1}>{title}</Text>
        }
        <View style={styles.right}>
          {this.state.searchActive ? 
            <ActionButton onPress={this.endSearch} iconName="cancel"/>
            : <ActionButton onPress={this.startSearch} iconName="search"/>
          }
        </View>
      </View>
    )
  }
}

export class ActionButton extends React.Component {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    text: PropTypes.string,
    iconName: PropTypes.string,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: WMColors.lightText,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  left: {
    flex: 1,
    paddingLeft: 5
  },
  title: {
    textAlign: 'center',
    color: WMColors.lightText,
    flex: 2,
    fontSize: 18,
    fontWeight: '400',
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
  actionText: {
    color: WMColors.darkText,
    marginRight: 5
  },
  searchInput: {
    marginLeft: 10,
    color: WMColors.lightText,
    flex: 6,
    height: 44,
    fontSize: 16
  }
})