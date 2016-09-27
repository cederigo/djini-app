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
          Dank der Angabe deines Geburtsdatums kann Djini deinen Freunden helfen, ihre Geschenke rechtzeitig zu organisieren. Und dir auch!
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
