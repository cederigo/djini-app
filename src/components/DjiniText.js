import React, {PropTypes, Component} from 'react';
import {Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({ios: 'Asap', android: 'asap'}),
    color: 'white',
    fontSize: 17,
  },
  textDark: {
    color: 'rgb(61, 63, 148)'
  }
})

export default class DjiniText extends Component {
  
  constructor(props) {
    super(props)
    this.state = {collapsed: true}
  }
  
  _onPress() {
    if (!this.props.collapsible) {
      return
    }
    this.setState({ collapsed: !this.state.collapsed })
  }
  
  render() {
    const {numberOfLines, ...props} = this.props
    const {collapsed} = this.state
    const style = [styles.text]
    if (props.textStyle === 'dark') {
      style.push(styles.textDark)
    }
    style.push(props.style)
    
    const textComponent = (
      <Text {...props} numberOfLines={collapsed ? numberOfLines : undefined} style={style}>
        {props.children}
      </Text>
    )

    if (props.collapsible) {
      return (
        <TouchableOpacity onPress={() => this._onPress()}>
          {textComponent}
        </TouchableOpacity>
      )
    } else {
      return textComponent
    }
  }
}

export function DjiniDarkText (props) {
  return (
    <DjiniText {...props} textStyle="dark">
      {props.children}
    </DjiniText>
  )
}

DjiniText.propTypes = {
  textStyle: PropTypes.oneOf(['light', 'dark']),
  collapsible: PropTypes.bool,
  numberOfLines: PropTypes.number
}

DjiniText.defaultProps = {
  textStyle: 'light'
}
