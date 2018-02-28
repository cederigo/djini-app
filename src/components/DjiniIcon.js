import PropTypes from 'prop-types'
import React from 'react'
import { Image, StyleSheet } from 'react-native'
import * as images from '../../img'
import Icon from 'react-native-vector-icons/MaterialIcons'
import glyphMap from 'react-native-vector-icons/glyphmaps/MaterialIcons.json'

const styles = StyleSheet.create({
  icon: {
    color: 'white'
  },
  iconDark: {
    color: 'rgb(61, 63, 148)'
  }
})

export default function DjiniIcon(props) {
  const style = [styles.icon]
  if (props.textStyle === 'dark') {
    style.push(styles.iconDark)
  }
  style.push(props.style)
  // Prefer Icons
  if (glyphMap[props.name]) {
    return <Icon {...props} style={style} />
  } else {
    return (
      <Image
        {...props}
        resizeMode="contain"
        source={images[props.name]}
        style={[{ width: props.size, height: props.size }, props.style]}
      />
    )
  }
}

export function DjiniDarkIcon(props) {
  return (
    <DjiniIcon {...props} textStyle="dark">
      {props.children}
    </DjiniIcon>
  )
}

DjiniIcon.propTypes = {
  textStyle: PropTypes.oneOf(['light', 'dark']).isRequired,
  size: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.any
}

DjiniIcon.defaultProps = {
  textStyle: 'light',
  size: 17
}
