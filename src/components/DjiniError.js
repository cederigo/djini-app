import PropTypes from 'prop-types'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import DjiniText from './DjiniText'
import DjiniButton from './DjiniButton'

const styles = StyleSheet.create({
  container: {
    padding: 25
  },
  button: {
    marginTop: 20
  }
})

export default function DjiniError(props) {
  const { style, errorText, reloadButtonText, onReloadPress, ...others } = props
  return (
    <View style={[styles.container, style]} {...others}>
      <DjiniText>{errorText}</DjiniText>
      <DjiniButton style={styles.button} caption={reloadButtonText} onPress={onReloadPress} />
    </View>
  )
}

DjiniError.propTypes = {
  errorText: PropTypes.string.isRequired,
  style: PropTypes.any,
  reloadButtonText: PropTypes.string,
  onReloadPress: PropTypes.func
}
