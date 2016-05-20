import React, {Component} from 'react';
import {View, TextInput, Text} from 'react-native';

export default class ProfileForm extends Component {

  props: {
    onFormFieldChange: (name: string, text: string) => void,
    onNext: () => void,
    authState: any,
    styles: any,
  }

  render() {

    const {onFormFieldChange, authState, styles, onNext} = this.props
    const {name, email} = authState.fields
    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>
          Gib Djini deinen Namen und deine E-Mail Adresse an:
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.formGroupText}>Name</Text>
          <View style={styles.formGroupInputView}>
            <TextInput
              style={styles.formGroupInput}
              editable={!authState.isFetching}
              onChangeText={(text) => { onFormFieldChange('name', text)}}
              autoFocus={true}
              clearButtonMode="while-editing"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              value={name}
              onSubmitEditing={() => this.refs.email.focus()}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formGroupText}>E-Mail</Text>
          <View style={styles.formGroupInputView}>
            <TextInput
              ref="email"
              style={styles.formGroupInput}
              editable={!authState.isFetching}
              keyboardType="email-address"
              clearButtonMode="while-editing"
              onChangeText={(text) => { onFormFieldChange('email', text)}}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={onNext}
              value={email}
            />
          </View>
        </View>
      </View>
    )
  }
}
