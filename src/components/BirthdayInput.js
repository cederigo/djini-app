import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import FieldInput from './FieldInput'

export default class BirthdayInput2 extends Component {

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
    const {editable, autoFocus} = this.props
    const {day, month, year} = this.state
    return (
      <View style={[styles.container]}>
        <FieldInput
          ref="day"
          autoFocus={autoFocus}
          style={[this.props.style, styles.input]}
          value={day}
          editable={editable}
          onChangeText={(text) => this.setStateIfValid('day', text, this.onDateChange)}
          clearButtonMode="never"
          maxLength={2}
          keyboardType='numeric'
        />
        <FieldInput
          ref="month"
          style={[this.props.style, styles.input]}
          value={month}
          editable={editable}
          onChangeText={(text) => this.setStateIfValid('month', text, this.onDateChange)}
          clearButtonMode="never"
          maxLength={2}
          keyboardType='numeric'
        />
        <FieldInput
          ref="year"
          style={[this.props.style, styles.input, styles.inputYear]}
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
    flex: 1
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  inputYear: {
    flex: 4,
    marginRight: 0,
  }
})
