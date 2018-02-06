import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Text, StyleSheet, Platform} from 'react-native'
import ViewMoreText from './ViewMoreText'

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({ios: 'Asap', android: 'asap'}),
    color: 'white',
    fontSize: 17,
    backgroundColor: 'transparent'
  },
  textDark: {
    color: 'rgb(61, 63, 148)'
  },
  viewMoreText: {
    marginTop: 5,
    fontSize: 14,
    color: 'rgb(101,104,244)'
  }
})

export default class DjiniText extends Component {
  
  constructor(props) {
    super(props)
  }
  
  renderViewMore(onPress, style){
    return(
      <Text style={[style, styles.viewMoreText]} onPress={onPress}>Mehr...</Text>
    )
  }

  renderViewLess(onPress, style){
    return(
      <Text style={[style, styles.viewMoreText]} onPress={onPress}>Weniger...</Text>
    )
  }
  
  render() {
    const {numberOfLines, ...props} = this.props
    const style = [styles.text]
    if (props.textStyle === 'dark') {
      style.push(styles.textDark)
    }
    style.push(props.style)
    
    if (props.collapsible) {
      return (
        <ViewMoreText
          style={style}
          numberOfLines={numberOfLines}
          renderViewMore={(handlePress) => this.renderViewMore(handlePress, style)}
          renderViewLess={(handlePress) => this.renderViewLess(handlePress, style)}>
          <Text {...props}>
            {props.children}
          </Text>
        </ViewMoreText>
      )
    } else {
      return (
        <Text {...props} numberOfLines={numberOfLines} style={style}>
          {props.children}
        </Text>
      )
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