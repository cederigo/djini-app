import React, {Component} from 'react';
import {View, Alert} from 'react-native';
import DjiniText from '../DjiniText'

import DjiniTextInput from '../DjiniTextInput'

export default class PhoneNumberForm extends Component {

  props: {
    onFormFieldChange: (name: string, text: string) => void,
    onNext: () => void,
    authState: any,
    styles: any,
  }

  render() {

    const {onFormFieldChange, authState, styles, onNext} = this.props
    const {phoneNumber} = authState.fields
    const errorMsg = authState.error ? authState.error.message : ''

    if (errorMsg.indexOf('is not a mobile number') >= 0) {
      Alert.alert('Ungültige Nummer', 'Dies ist keine Natel-Nummer')
    }

    return ( 
      <View style={styles.container}>
        <DjiniText style={styles.text}>
          Djini soll dein Leben vereinfachen! Darum setzt er auf einen bequemen SMS-Login statt auf schnell vergessene Passwörter.
        </DjiniText>
        <View style={styles.formGroup}>
          <DjiniText style={styles.formGroupText}>Telefon</DjiniText>
          <DjiniTextInput
            placeholder="z.B. 079 999 999"
            style={styles.formGroupInput}
            type="light"
            editable={!authState.isFetching}
            autoFocus={true}
            keyboardType="phone-pad"
            onSubmitEditing={onNext}
            onChangeText={(text) => {
              onFormFieldChange('phoneNumber', text)
            }}
            value={phoneNumber}
          />
        </View>
      </View>
    )
  }
}
