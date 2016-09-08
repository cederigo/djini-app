import React, {Component, PropTypes} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgb(61,63,148)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    borderColor: 'white',
  },
  input: {
    fontFamily: 'Asap',
    fontSize: 17,
    height: 30,
    flex: 1,
    color: 'rgb(61,63,148)'
  },
  searchInput: {
    color: 'white'
  }
})

/* sensible defaults */
export default class DjiniTextInput extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['search'])
  }

  focus() {
    this.refs.input.focus()
  }

  render() {

    const containerStyle = [styles.container]
    const inputStyle = [styles.input]

    if (this.props.type === 'search') {
      containerStyle.push(styles.searchContainer)
      inputStyle.push(styles.searchInput)
    }

    containerStyle.push(this.props.style)
    inputStyle.push(this.props.inputStyle)

    return  (
      <View style={containerStyle}>
        <TextInput
          ref="input"
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          underlineColorAndroid="transparent"
          editable={true}
          placeholderTextColor={this.props.type === 'search' ? 'white' : 'rgb(61,63,148)'}
          {...this.props}
          style={inputStyle}
        />
      </View>
    )
  }
}
