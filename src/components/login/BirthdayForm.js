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
    const {onFormFieldChange, styles} = this.props
    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>
          Mit Angabe deines Geburtsdatums kann „Djini“ deine Freunde rechzeitig über deinen Geburtstag informieren.
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.formGroupText}>Geb.</Text>
          <View style={styles.formGroupInputView}>
            <BirthdayInput 
              style={styles.formGroupInput}
              autoFocus={true}
              onDateChange={date => onFormFieldChange('birthday', date)} />
          </View>
        </View>
      </View>
    )
  }
}
