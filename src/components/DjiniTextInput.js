import React, {Component, PropTypes} from 'react';
import {TextInput, StyleSheet, View, Platform} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgb(61,63,148)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lightContainer: {
    borderColor: 'white',
  },
  input: {
    fontFamily: Platform.select({ios: 'Asap', android: 'asap'}),
    fontSize: 17,
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
    type: PropTypes.oneOf(['light', 'dark']), /* deprecated */
    textStyle: PropTypes.oneOf(['light', 'dark']).isRequired,
    minHeight: PropTypes.number.isRequired,
    autoGrow: PropTypes.bool,
    style: PropTypes.any,
    inputStyle: PropTypes.any
  }

  constructor(props) {
     super(props);
     this.state = {height: 0};
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
      onContentSizeChange: (event) => {
        this.setState({
          height: event.nativeEvent.contentSize.height
        });
      },
    }
  }

  render() {

    const containerStyle = [styles.container]
    const inputStyle = [styles.input]
    const textStyle = this.props.type || this.props.textStyle

    if (textStyle === 'light') {
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
          autoCapitalize="sentences"
          autoCorrect={false}
          returnKeyType="next"
          underlineColorAndroid="transparent"
          editable={true}
          placeholderTextColor={this.props.type === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(61,63,148,0.6)'}
          {...this.props}
          {...this._autoGrowProps()}
          style={[inputStyle, {height: Math.max(this.props.minHeight, this.state.height)}]}
        />
      </View>
    )
  }
}

DjiniTextInput.defaultProps = {
  minHeight: 28,
  textStyle: 'dark'
}

export function DjiniDarkTextInput (props) {
  return (
    <DjiniTextInput {...props} textStyle="dark"/>
  )
}
