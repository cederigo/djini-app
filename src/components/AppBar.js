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
          {showBackButton ? 
            <ActionButton 
              onPress={onBack}
              iconName="chevron-left"
              style={[styles.actionButton, styles.actionButtonLeft]}/>
            : undefined
          }
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
    this._endSearch = this._endSearch.bind(this)
    this.state = {
      searchActive: false
    }
  }

  startSearch() {
    this.setState({searchActive: true})
  }

  endSearch() {
    this.setState({searchActive: false})
  }

  _endSearch() {
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
            <ActionButton onPress={this._endSearch} iconName="cancel"/>
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
          <Icon style={[styles.actionIcon, disabled ? styles.disabled : undefined]} name={iconName}/> :
          <Text numberOfLines={1} style={[styles.actionText, disabled ? styles.disabled : undefined]}>{text}</Text>
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
  },
  title: {
    textAlign: 'center',
    color: WMColors.lightText,
    flex: 2,
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: 5
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  actionButton: {
    paddingVertical: 10,
    paddingRight: 5,
    alignItems: 'flex-end',
    flex: 1
  },
  actionButtonLeft: {
    paddingLeft: 0,
    alignItems: 'flex-start',
  },
  disabled: {
    color: WMColors.disabledText
  },
  actionIcon: {
    fontSize: 30,
    color: WMColors.darkText
  },
  actionText: {
    fontSize: 13,
    color: WMColors.darkText,
  },
  searchInput: {
    marginLeft: 10,
    color: WMColors.lightText,
    flex: 6,
    height: 44,
    fontSize: 16
  }
})