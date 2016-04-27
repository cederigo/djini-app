//IOS only

import React, { 
  Component,
  DatePickerIOS,
} from 'react-native';

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
        date={birthday}
        mode="date"
        onDateChange={onDateChange}
      />
    )
  }
}
