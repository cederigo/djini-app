import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, DatePickerIOS, Picker} from 'react-native';

//Picker Items
let DAYS = []
for (let i = 1; i <= 31; i++) { 
  DAYS.push({label: i + '.', value: i})
}

let MONTHS = [
  {label: 'Januar', value: 0},
  {label: 'Februar', value: 1},
  {label: 'März', value: 2},
  {label: 'April', value: 3},
  {label: 'Mai', value: 4},
  {label: 'Juni', value: 5},
  {label: 'Juli', value: 6},
  {label: 'August', value: 7},
  {label: 'September', value: 8},
  {label: 'Oktober', value: 9},
  {label: 'November', value: 10},
  {label: 'Dezember', value: 11}
]

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  dayPicker: {
    width: 100
  },
  monthPicker: {
    flex: 1
  }
})

export default class BirthdayInput extends Component {
  render() {

    const {initialDate, onDateChange} = this.props
    const birthday = new Date(initialDate) //clone

    console.log('BirthdayInput.render() ', initialDate)

    return (
      <View style={styles.container}>
        <Picker
          style={styles.dayPicker}
          selectedValue={birthday.getDate()}
          onValueChange={(day) => {
            birthday.setDate(day)
            onDateChange(new Date(birthday))
          }}
          >
          {DAYS.map(item => 
            <Picker.Item label={item.label} value={item.value} key={item.value}/>
          )}
        </Picker>
        <Picker
          style={styles.monthPicker}
          selectedValue={birthday.getMonth()}
          onValueChange={(month) => {
            birthday.setMonth(month)
            onDateChange(new Date(birthday))
          }}
          >
          {MONTHS.map(item => 
            <Picker.Item label={item.label} value={item.value} key={item.value}/>
          )}
        </Picker>
      </View>
    )
  }
}

BirthdayInput.propTypes = {
  initialDate: PropTypes.object.isRequired,
  onDateChange: PropTypes.func
}
