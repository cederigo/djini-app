import { connect } from 'react-redux';
import React, {Component} from 'react';
import { Actions } from 'react-native-router-flux'
import {StyleSheet, View} from 'react-native';

import {AppBar} from '../components/AppBar'
import DjiniButton from '../components/DjiniButton'

import {
  profileForm,
  birthdayForm,
  phoneNumberForm,
  verificationCodeForm,
  login,
  sendCode,
  onFormFieldChange,
} from '../actions/authActions'

import { loadMyProfile, updateProfile } from '../actions/profile'

import PhoneNumberForm from '../components/login/PhoneNumberForm'
import VerificationCodeForm from '../components/login/VerificationCodeForm'
import ProfileForm from '../components/login/ProfileForm'
import BirthdayForm from '../components/login/BirthdayForm'
import {
  LOGIN_PHONENUMBER_FORM,
  LOGIN_VERIFICATIONCODE_FORM,
  LOGIN_PROFILE_FORM,
  LOGIN_BIRTHDAY_FORM,
} from '../lib/constants'

class Login extends Component {

  props: {
    authState: any
  }

  render() {

    const {authState, dispatch} = this.props
    const {formName, isValid, fields, isFetching} = authState

    let title, form, onNext, onBack
    let nextCaption = "Weiter"

    switch(formName) {
      case LOGIN_PHONENUMBER_FORM:
        title = "Telefon"
        onBack = Actions.welcome
        onNext = () => {
          dispatch(sendCode(fields.get('phoneNumberFormatted')))
        }
        form = <PhoneNumberForm 
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
          styles={formStyles}
          onNext={isValid ? onNext: null}/>
        break;
      case LOGIN_VERIFICATIONCODE_FORM:
        title = "Code"
        onBack = () => dispatch(phoneNumberForm())
        onNext = () => {
          dispatch(login(
            fields.get('phoneNumberFormatted'), /* username */
            fields.get('code') /* password */
          ))
        }
        form = <VerificationCodeForm 
          styles={formStyles}
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
          onNext={isValid ? onNext : null}/>
        break;
      case LOGIN_PROFILE_FORM:
        title = "Name & E-Mail"
        onBack = () => dispatch(verificationCodeForm())
        onNext = () => dispatch(birthdayForm())
        form = <ProfileForm 
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
          styles={formStyles}
          onNext={isValid? onNext: null}
        />
        break
      case LOGIN_BIRTHDAY_FORM: {
        title = "Geburtstag"
        nextCaption = "Abschliessen"
        const {name, email, birthday} = fields
        onBack = () => dispatch(profileForm())
        onNext = () => {
          dispatch(updateProfile({name, email, birthday}))
            .then(() => dispatch(loadMyProfile()))
            .then(() => Actions.home())
        }
        form = <BirthdayForm 
          styles={formStyles}
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
        />
        break
      }
    }

    return (
      <View style={styles.container}>
        <AppBar title={title} showBackButton={onBack ? true : false} onBack={onBack}/>
        {form}
        <DjiniButton style={styles.button} caption={nextCaption} onPress={onNext} disabled={!isValid || isFetching}/>
      </View>
    )
  }
}

const formStyles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 40
  },
  text: {
    marginBottom: 10
  },
  formGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  formGroupText: {
    flex: 1
  },
  formGroupInput: {
    flex: 2,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    margin: 20
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { authState: state.auth };
}
export default connect(select)(Login)
