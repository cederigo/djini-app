import React, {Component} from 'react';
import {TextInput} from 'react-native';

/* sensible defaults */
export default class FieldInput extends Component {
  render() {
    return <TextInput
      clearButtonMode="while-editing"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="next"
      {...this.props}
    />
  }
}
