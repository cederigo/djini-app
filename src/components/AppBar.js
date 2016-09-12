import {Actions} from 'react-native-router-flux';

import React, {Component, PropTypes} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import DjiniText from './DjiniText'
import DjiniTextInput from './DjiniTextInput'

export class AppBar extends Component {
  static propTypes = {
    showBackButton: React.PropTypes.bool,
    backButtonText: React.PropTypes.string,
    onBack: React.PropTypes.func,
    title: React.PropTypes.string,
    children: React.PropTypes.element,
    textStyle: PropTypes.oneOf(['light', 'dark'])
  }

  static defaultProps = {
    onBack: () => Actions.pop()
  }

  render() {
    const {showBackButton, backButtonText, onBack, title, textStyle} = this.props
    const actionButtonProps = backButtonText ? {text: backButtonText} : {iconName: 'chevron-left'}
    return (
      <View style={styles.appBar}>
        <View style={styles.center}>
          <DjiniText textStyle={textStyle} style={styles.title} numberOfLines={1}>{title}</DjiniText>
        </View>
        <View style={styles.left}>
          {showBackButton ? 
            <ActionButton 
              {...actionButtonProps}
              onPress={onBack}
              textStyle={textStyle}
              style={[styles.actionButton, styles.actionButtonLeft]}/>
            : undefined
          }
        </View>
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
        <View style={styles.center}>
          {this.state.searchActive ?
            <DjiniTextInput
              type="light"
              onChangeText={onChangeText}
              autoFocus={true}
              style={styles.searchInput}
              value={inputValue}
              placeholder={inputPlaceholder}
              clearButtonMode="never"
            />
            : <DjiniText style={styles.title} numberOfLines={1}>{title}</DjiniText>
          }
        </View>
        <View style={styles.left}/>
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
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  center: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  title: {
    fontStyle: 'italic',
  },
  actionButton: {
    padding: 10,
    alignItems: 'flex-end',
  },
  actionButtonLeft: {
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
    marginLeft: 25,
    marginRight: 50
  }
})
