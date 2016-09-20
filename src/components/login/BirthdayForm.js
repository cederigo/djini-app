import React, {Component} from 'react';
import {View} from 'react-native';
import DateInput from '../DateInput'

import DjiniText from '../DjiniText'

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
        <DjiniText style={styles.text}>
          Mit Angabe deines Geburtsdatums kann „Djini“ deine Freunde rechzeitig über deinen Geburtstag informieren.
        </DjiniText>
        <View style={styles.formGroup}>
          <DjiniText style={styles.formGroupText}>Geb.</DjiniText>
          <DateInput 
            type="light"
            style={styles.formGroupInput}
            autoFocus={true}
            onDateChange={date => onFormFieldChange('birthday', date)} />
        </View>
      </View>
    )
  }
}
