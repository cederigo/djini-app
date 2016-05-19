import Icon from 'react-native-vector-icons/MaterialIcons';
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
    const iconName = authState.isValid ? 'sentiment-satisfied' : 'phone'
    const {phoneNumber} = authState.fields

    if (authState.error) {
      Alert.alert('Ungültige Nummer', 'Dies ist keine Natel-Nummer')
    }

    return ( 
      <View style={styles.container}>
        <Icon name={iconName} style={styles.icon} size={90} />
        <Text style={styles.text}>Deine Telefon Nummer..</Text>
        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          autoFocus={true}
          autoCorrect={false}
          keyboardType="phone-pad"
          placeholder="+41 79 123 456"
          onSubmitEditing={onNext}
          onChangeText={(text) => {
            onFormFieldChange('phoneNumber', text)
          }}
          value={phoneNumber}
        />
      </View>
    )
  }
}
