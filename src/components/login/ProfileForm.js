import React, { Component } from 'react'
import { View } from 'react-native'

import DjiniText from '../DjiniText'
import DjiniTextInput from '../DjiniTextInput'
import { trackScreenView } from '../../lib/analytics'
export default class ProfileForm extends Component {
  props: {
    onFormFieldChange: (name: string, text: string) => void,
    onNext: () => void,
    authState: any,
    styles: any
  }

  constructor() {
    super()
    this.emailInput = undefined
  }

  componentDidMount() {
    trackScreenView('login: name & email')
  }

  render() {
    const { onFormFieldChange, authState, styles, onNext } = this.props
    const { name, email } = authState.fields
    return (
      <View style={styles.container}>
        <DjiniText style={styles.text}>
          In Supportfällen braucht Djini die folgenden Angaben von dir. Djini schwört auf seine
          Lampe, deine Angaben nicht weiterzugeben!
        </DjiniText>
        <View style={styles.formGroup}>
          <DjiniText style={styles.formGroupText}>Name</DjiniText>
          <DjiniTextInput
            style={styles.formGroupInput}
            type="light"
            editable={!authState.isFetching}
            onChangeText={text => {
              onFormFieldChange('name', text)
            }}
            autoFocus={true}
            returnKeyType="next"
            value={name}
            onSubmitEditing={() => this.emailInput.focus()}
          />
        </View>
        <View style={styles.formGroup}>
          <DjiniText style={styles.formGroupText}>E-Mail</DjiniText>
          <DjiniTextInput
            ref={input => {
              this.emailInput = input
            }}
            type="light"
            autoCapitalize="none"
            style={styles.formGroupInput}
            editable={!authState.isFetching}
            keyboardType="email-address"
            onChangeText={text => {
              onFormFieldChange('email', text)
            }}
            returnKeyType="next"
            onSubmitEditing={onNext}
            value={email}
          />
        </View>
      </View>
    )
  }
}
