import { connect } from 'react-redux';
import React, {Component} from 'react';
import { Actions } from 'react-native-router-flux'
import {View, StyleSheet, StatusBar, Platform} from 'react-native';

import WMColors from '../lib/WMColors'

import {AppBar} from '../components/AppBar'
import WMButton from '../components/WMButton'

import {
  profileForm,
  birthdayForm,
  phoneNumberForm,
  verificationCodeForm,
  login,
  sendCode,
  onFormFieldChange,
  updateProfile
} from '../actions/authActions'

import { loadMyProfile } from '../actions/profile'

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
        <StatusBar translucent={true} />
        <AppBar title={title} showBackButton={onBack ? true : false} onBack={onBack}/>
        {form}
        <WMButton style={styles.button} caption={nextCaption} onPress={onNext} disabled={!isValid || isFetching}/>
      </View>
    )
  }
}

const formStyles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 20
  },
  text: {
    color: WMColors.lightText,
    fontSize: 16,
    marginBottom: 10
  },
  formGroup: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    flex: 1,
    marginTop: 20
  },
  formGroupText: {
    fontSize: 16,
    color: WMColors.lightText,
    marginBottom: 5,
    flex: 1
  },
  formGroupInputView: {
    borderColor: WMColors.lightText,
    borderBottomWidth: 1,
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formGroupInput: {
    height: 30,
    flex: 1,
    fontSize: 16,
    color: WMColors.lightText,
    padding: Platform.select({android: 0}),
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
