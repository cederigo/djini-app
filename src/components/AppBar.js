import {Actions} from 'react-native-router-flux';

import React, {Component, PropTypes} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';

import DjiniText from './DjiniText'

export class AppBar extends Component {
  static propTypes = {
    showBackButton: React.PropTypes.bool,
    onBack: React.PropTypes.func,
    title: React.PropTypes.string,
    children: React.PropTypes.element,
    textStyle: PropTypes.oneOf(['light', 'dark'])
  }

  static defaultProps = {
    onBack: () => Actions.pop()
  }

  render() {
    const {showBackButton, onBack, title, textStyle} = this.props
    return (
      <View style={styles.appBar}>
        <View style={styles.left}>
          {showBackButton ? 
            <ActionButton 
              onPress={onBack}
              iconName="chevron-left"
              textStyle={textStyle}
              style={[styles.actionButton, styles.actionButtonLeft]}/>
            : undefined
          }
        </View>
        <DjiniText textStyle={textStyle} style={styles.title} numberOfLines={1}>{title}</DjiniText>
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
    textStyle: PropTypes.oneOf(['light', 'dark'])
  }
  render() {
    const {disabled, onPress, text, iconName, textStyle} = this.props
    const style = [styles.actionText]
    if (textStyle === 'dark') {
      style.push(styles.actionTextDark)
    }
    if (disabled) {
      style.push(styles.actionTextDisabled)
    }

    return (
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0}
        style={[styles.actionButton, this.props.style]}
        onPress={() => { if (!disabled) { onPress() }}}>
        {iconName ? 
          <Icon style={style} size={30} name={iconName}/> :
          <DjiniText numberOfLines={1} style={style}>{text}</DjiniText>
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  appBar: {
    marginTop: 20, //status bar
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: WMColors.lightText,
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
    flex: 1.5,
    fontStyle: 'italic',
    marginHorizontal: 5
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  actionButton: {
    paddingVertical: 10,
    paddingRight: 10,
    alignItems: 'flex-end',
    flex: 1
  },
  actionButtonLeft: {
    paddingLeft: 0,
    alignItems: 'flex-start',
  },
  actionTextDisabled: {
    opacity: 0.5
  },
  actionText: {
    color: 'white'
  },
  actionTextDark: {
    color: 'rgb(101,104,244)'
  },
  searchInput: {
    marginLeft: 10,
    color: 'white',
    flex: 6,
    height: 44,
    fontSize: 16
  }
})
