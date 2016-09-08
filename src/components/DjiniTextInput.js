import React, {Component} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgb(61,63,148)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Asap',
    fontSize: 17,
    height: 30,
    flex: 1,
    color: 'rgb(61,63,148)'
  }
})

/* sensible defaults */
export default class DjiniTextInput extends Component {
  focus() {
    this.refs.input.focus()
  }
  render() {
    return  (
      <View style={styles.container}>
        <TextInput
          ref="input"
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          underlineColorAndroid="transparent"
          editable={true}
          {...this.props}
          style={[styles.input, this.props.style]}
        />
      </View>
    )
  }
}
