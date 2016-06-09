import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import FieldInput from './FieldInput'
import WMColors from '../lib/WMColors'

export default class BirthdayInput2 extends Component {

  static propTypes = {
    date: PropTypes.instanceOf(Date),
    editable: PropTypes.bool,
    onDateChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    date: new Date(0)
  }

  constructor(props) {
    super(props)
    this.onDayChange = this.onDayChange.bind(this)
    this.onMonthChange = this.onMonthChange.bind(this)
    this.onYearChange = this.onYearChange.bind(this)
  }

  onDayChange(value) {
    const {date, onDateChange} = this.props
    const day = parseInt(value)
    if (!value || day > 31 || day <= 0) {
      return;
    }
    const newDate = new Date(date)
    newDate.setDate(day)
    onDateChange(newDate)
  }

  onMonthChange(value) {
    const {date, onDateChange} = this.props
    const month = parseInt(value)
    if (!value || month > 12 || month <= 0) {
      return;
    }

    const newDate = new Date(date)
    newDate.setMonth(month - 1)
    onDateChange(newDate)
  }

  onYearChange(value) {
    if (!value) {
      return;
    }
    const {date, onDateChange} = this.props
    const year = parseInt(value)
    const newDate = new Date(date)
    newDate.setFullYear(year)
    onDateChange(newDate)
  }

  render() {
    const {date, editable} = this.props
    return (
      <View style={[styles.container]}>
        <FieldInput
          style={[this.props.style, styles.input]}
          value={'' + date.getDate()}
          editable={editable}
          onChangeText={this.onDayChange}
          clearButtonMode="never"
        />
        <FieldInput
          style={[this.props.style, styles.input]}
          value={'' + (date.getMonth() + 1)}
          editable={editable}
          onChangeText={this.onMonthChange}
          clearButtonMode="never"
        />
        <FieldInput
          style={[this.props.style, styles.input, styles.inputYear]}
          value={'' + date.getFullYear()}
          editable={editable}
          onChangeText={this.onYearChange}
          clearButtonMode="never"
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
