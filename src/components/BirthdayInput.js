import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import DjiniTextInput from './DjiniTextInput'

export default class BirthdayInput extends Component {

  static propTypes = {
    date: PropTypes.instanceOf(Date),
    editable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onDateChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const date = props.date
    this.onDateChange = this.onDateChange.bind(this)
    this.state = {
      day: date ? '' + props.date.getDate() : '',
      month: date ? '' + (props.date.getMonth() + 1) : '',
      year: date ? '' + props.date.getFullYear(): ''
    }
  }

  onDateChange() {
    const {onDateChange} = this.props
    const {day, month, year} = this.state
    if (!(day && month && year)) {
      return;
    }
    try {
      const newDate = new Date(0)
      newDate.setDate(parseInt(day))
      newDate.setMonth(parseInt(month) - 1)
      newDate.setFullYear(parseInt(year))
      onDateChange(newDate)
    } catch(e) { 
      console.log('invalid date')
      //nothing to do
    }
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
