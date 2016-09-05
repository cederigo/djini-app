import React, {Component} from 'react';
import {TextInput, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Asap',
    color: 'white',
    fontSize: 17,
  }
})

/* sensible defaults */
export default class DjiniTextInput extends Component {
  focus() {
    this.refs.input.focus()
  }
  render() {
    return <TextInput
      ref="input"
      clearButtonMode="while-editing"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="next"
      {...this.props}
      style={[this.props.style, styles.text]}
    />
  }
}
