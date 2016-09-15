import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import DjiniTextInput from './DjiniTextInput'

export default class BirthdayInput extends Component {

  static propTypes = {
    date: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    autoFocus: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.onDateChange = this.onDateChange.bind(this)
    let dateParts = props.date.split('-')
    this.state = {
      year: dateParts[0] || '',
      month: dateParts[1] || '',
      day: dateParts[2] || ''
    }
  }

  onDateChange() {
    const {onDateChange} = this.props
    const {day, month, year} = this.state
    if (!(day && month && year)) {
      return;
    }
    onDateChange(`${year}-${month}-${day}`)
  }

  setStateIfValid(field, value, cb) {
    if (/^\d+$/.test(value) || !value) {
      this.setState({[field]: value}, cb)
      if (field === 'day' && value.length == 2) {
        this.refs.month.focus()
      }
      else if (field === 'month' && value.length == 2) {
        this.refs.year.focus()
      }
    }
  }

  focus() {
    this.refs.day.focus()
  }

  render() {
    const {editable, autoFocus, style, type} = this.props
    const {day, month, year} = this.state
    return (
      <View style={[styles.container, style]}>
        <DjiniTextInput
          placeholder="31"
          type={type}
          ref="day"
          autoFocus={autoFocus}
          style={[this.props.style, styles.inputContainer]}
          inputStyle={styles.input}
          value={day}
          editable={editable}
          onChangeText={(text) => this.setStateIfValid('day', text, this.onDateChange)}
          clearButtonMode="never"
          maxLength={2}
          keyboardType='numeric'
        />
        <DjiniTextInput
          placeholder="12"
          type={type}
          ref="month"
          style={[this.props.style, styles.inputContainer]}
          inputStyle={styles.input}
          value={month}
          editable={editable}
          onChangeText={(text) => this.setStateIfValid('month', text, this.onDateChange)}
          clearButtonMode="never"
          maxLength={2}
          keyboardType='numeric'
        />
        <DjiniTextInput
          placeholder="2001"
          type={type}
          ref="year"
          style={[this.props.style, styles.inputYearContainer]}
          inputStyle={styles.input}
          value={year}
          onChangeText={(text) => this.setStateIfValid('year', text, this.onDateChange)}
          editable={editable}
          clearButtonMode="never"
          maxLength={4}
          keyboardType='numeric'
        />
      </View>
    )
  }
}

BirthdayInput.defaultProps = {
  date: ''
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 0,
    width: 30,
    marginRight: 10,
  },
  input: {
    textAlign: 'center'
  },
  inputYearContainer: {
    flex: 0,
    width: 60,
    marginRight: 0,
  }
})


