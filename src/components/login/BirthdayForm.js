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
          Djini hilft dir an Geburtstage von Freunden zu denken – und deinen Freunden an deinen. So kannst du Geschenke rechtzeitig organisieren.
        </DjiniText>
        <View style={styles.formGroup}>
          <DjiniText style={styles.formGroupText}>Geburtstag</DjiniText>
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
