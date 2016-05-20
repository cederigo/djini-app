import React, {Component} from 'react';
import {View, Text} from 'react-native';
import BirthdayInput from '../BirthdayInput'


export default class BirthdayForm extends Component {

  props: {
    onFormFieldChange: (name: string, value: Date) => void,
    authState: any,
    styles: any,
  }

  render() {

    const {onFormFieldChange, authState, styles} = this.props
    const {birthday} = authState.fields
    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>
          Mit Angabe deines Geburtsdatums kann „Djini“ deine Freunde rechzeitig über deinen Geburtstag informieren.
        </Text>
        <BirthdayInput initialDate={birthday} onDateChange={date => onFormFieldChange('birthday', date)} />
      </View>
    )
  }
}
