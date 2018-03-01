import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import moment from 'moment'
import DjiniTextInput from './DjiniTextInput'

export default class DateInput extends Component {
  static propTypes = {
    /* Format: YYYY-MM-DD */
    date: (props, propName, componentName) => {
      const val = props[propName]
      if (val && !moment(val, 'YYYY-MM-DD', true).isValid()) {
        return new Error(
          'Invalid prop `' +
            propName +
            '` supplied to' +
            ' `' +
            componentName +
            '`. Validation failed.'
        )
      }
    },
    onDateChange: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,

    /**
     * Omits year input and sets it automatically:
     *   - if {this year}-MM-DD is after now -> {this year}-MM-DD
     *   - otherwise {next year}-MM-DD
     */
    autoYear: PropTypes.bool
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
    const { onDateChange, autoYear } = this.props
    let { day, month, year } = this.state
    let result
    if (autoYear) {
      result = moment(`${month}-${day}`, 'MM-DD')
    } else {
      result = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD')
    }

    if (!result.isValid()) {
      return
    }

    if (autoYear && result.isBefore(moment(), 'day')) {
      result.add(1, 'year')
    }

    onDateChange(result.format('YYYY-MM-DD'))
  }

  setStateIfValid(field, value, cb) {
    const { autoYear } = this.props
    if (/^\d+$/.test(value) || !value) {
      this.setState({ [field]: value }, cb)
      if (field === 'day' && value.length == 2) {
        this.refs.month.focus()
      } else if (field === 'month' && value.length == 2 && !autoYear) {
        this.refs.year.focus()
      }
    }
  }

  focus() {
    this.refs.day.focus()
  }

  render() {
    const { style, autoFocus, autoYear, ...other } = this.props
    const { day, month, year } = this.state
    return (
      <View style={[styles.container, style]}>
        <DjiniTextInput
          {...other}
          placeholder="31"
          ref="day"
          autoFocus={autoFocus}
          style={[styles.inputContainer]}
          inputStyle={styles.input}
          value={day}
          onChangeText={text => this.setStateIfValid('day', text, this.onDateChange)}
          clearButtonMode="never"
          maxLength={2}
          keyboardType="numeric"
        />
        <DjiniTextInput
          {...other}
          placeholder="12"
          ref="month"
          style={styles.inputContainer}
          inputStyle={styles.input}
          value={month}
          onChangeText={text => this.setStateIfValid('month', text, this.onDateChange)}
          clearButtonMode="never"
          maxLength={2}
          keyboardType="numeric"
        />
        {autoYear ? (
          undefined
        ) : (
          <DjiniTextInput
            {...other}
            placeholder="2001"
            ref="year"
            style={styles.inputYearContainer}
            inputStyle={styles.input}
            value={year}
            onChangeText={text => this.setStateIfValid('year', text, this.onDateChange)}
            clearButtonMode="never"
            maxLength={4}
            keyboardType="numeric"
          />
        )}
      </View>
    )
  }
}

DateInput.defaultProps = {
  date: ''
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  inputContainer: {
    flex: 0,
    width: 30,
    marginRight: 10
  },
  input: {
    textAlign: 'center'
  },
  inputYearContainer: {
    flex: 0,
    width: 60,
    marginRight: 0
  }
})
