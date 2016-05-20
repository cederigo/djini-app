import React, {Component} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';

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
        <Text style={styles.text}>
          Deine Telefonnummer wird einmalig für die Registrierung benötigt. Du erhältst anschliessend einen 4-stelligen Code per SMS für die Verifizierung:
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.formGroupText}>Telefon</Text>
          <View style={styles.formGroupInputView}>
            <TextInput
              style={styles.formGroupInput}
              editable={!authState.isFetching}
              autoFocus={true}
              autoCorrect={false}
              keyboardType="phone-pad"
              onSubmitEditing={onNext}
              clearButtonMode="while-editing"
              onChangeText={(text) => {
                onFormFieldChange('phoneNumber', text)
              }}
              value={phoneNumber}
            />
          </View>
        </View>
      </View>
    )
  }
}
