import React, {Component} from 'react';
import {Alert, View} from 'react-native';

import DjiniTextInput from '../DjiniTextInput'
import DjiniText from '../DjiniText'

export default class VerificationCodeForm extends Component {

  props: {
    onFormFieldChange: (name: string, text: string) => void,
    onNext: () => void,
    authState: any,
    styles: any,
  }

  render() {

    const {onFormFieldChange, authState, styles, onNext} = this.props
    const code = authState.getIn(['fields', 'code'])

    if (authState.error) {
      Alert.alert('Falscher Code', 'Bitte nochmals eingeben')
    }

    return ( 
      <View style={styles.container}>
        <DjiniText style={styles.text}>
          Gib den 4-stelligen Verifizierungs-Code ein, den du per SMS erhalten hast:
        </DjiniText>
        <View style={styles.formGroup}>
          <DjiniText style={styles.formGroupText}>Code</DjiniText>
          <View style={styles.formGroupInputView}>
            <DjiniTextInput
              style={styles.formGroupInput}
              editable={!authState.isFetching}
              autoFocus={true}
              keyboardType="numeric"
              onChangeText={(text) => onFormFieldChange('code', text)}
              onSubmitEditing={onNext}
              clearButtonMode="while-editing"
              value={code}
            />
          </View>
        </View>
      </View>
    )
  }
}
