import React, {Component, PropTypes} from 'react';
import {TextInput, StyleSheet, View, Platform} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgb(61,63,148)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightContainer: {
    borderColor: 'white',
  },
  input: {
    fontFamily: 'Asap',
    fontSize: 17,
    height: 30,
    flex: 1,
    color: 'rgb(61,63,148)',
    padding: Platform.select({android: 0})
  },
  lightInput: {
    color: 'white'
  }
})

/* sensible defaults */
export default class DjiniTextInput extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['light']),
    minHeight: PropTypes.number.isRequired,
    autoGrow: PropTypes.bool,
    style: PropTypes.any,
    inputStyle: PropTypes.any
  }

  constructor(props) {
     super(props);
     this.state = {text: '', height: 0};
  }

  focus() {
    this.refs.input.focus()
  }

  _autoGrowProps() {
    if (!this.props.autoGrow) {
      return {}
    }
    return {
      multiline: true,
      onChange: (event) => {
         this.setState({
           text: event.nativeEvent.text,
           height: event.nativeEvent.contentSize.height,
         });
      }
    }
  }

  render() {

    const containerStyle = [styles.container]
    const inputStyle = [styles.input]

    if (this.props.type === 'light') {
      containerStyle.push(styles.lightContainer)
      inputStyle.push(styles.lightInput)
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
          placeholderTextColor={this.props.type === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(61,63,148,0.6)'}
          {...this.props}
          {...this._autoGrowProps()}
          style={[inputStyle, {height: Math.max(this.props.minHeight, this.state.height)}]}
          value={this.state.text}
        />
      </View>
    )
  }
}

DjiniTextInput.defaultProps = {
  minHeight: 30
}
