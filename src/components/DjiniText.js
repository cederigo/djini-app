import React, {PropTypes} from 'react';
import {Text, StyleSheet, Platform} from 'react-native';

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

export default function DjiniText (props) {
  const style = [styles.text]
  if (props.textStyle === 'dark') {
    style.push(styles.textDark)
  }
  style.push(props.style)
  return (
    <Text {...props} style={style}>
      {props.children}
    </Text>
  )
}

export function DjiniDarkText (props) {
  return (
    <DjiniText {...props} textStyle="dark">
      {props.children}
    </DjiniText>
  )
}

DjiniText.propTypes = {
  textStyle: PropTypes.oneOf(['light', 'dark'])
}

DjiniText.defaultProps = {
  textStyle: 'light'
}
