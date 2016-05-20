//IOS only

import React, {Component} from 'react';
import {DatePickerIOS, StyleSheet} from 'react-native';

import WMColors from '../lib/WMColors'

export default class BirthdayInput extends Component {

  props: {
    initialDate: Date,
    onDateChange: (date: Date) => void
  }

  render() {

    const {initialDate, onDateChange} = this.props
    const birthday = new Date(initialDate) //clone

    return (
      <DatePickerIOS
        style={styles.picker}
        date={birthday}
        mode="date"
        onDateChange={onDateChange}
      />
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    color: WMColors.lightText,
    left: -20
  }
})
