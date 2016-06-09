import React, {Component} from 'react';
import {TextInput} from 'react-native';

/* sensible defaults */
export default class FieldInput extends Component {
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
    />
  }
}
