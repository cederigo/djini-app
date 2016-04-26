import { connect } from 'react-redux';
import React, {
  Platform,
  Component,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {
  profileForm,
  birthdayForm,
  phoneNumberForm,
  login,
  sendCode,
  onFormFieldChange
} from '../actions/authActions'

import {
  refreshContacts,
} from '../actions/socialActions'

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


const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 10,
  },
  text: {},
  icon: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
    marginTop: 10,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    marginTop: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  nextButton: {
    padding: 15,
  },
  title: {
    flex: 1,
  },
  backButton: {
    padding: 15,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
})

class NavButton extends React.Component {
  render() {
    const {enabled, onPress, text, style} = this.props
    return (
      <TouchableOpacity
        activeOpacity={enabled ? 0 : 1}
        style={style}
        onPress={() => { if (enabled) { onPress() }}}>
        <Text style={[styles.buttonText, {color: enabled ? 'rgb(0, 122, 155)' : 'grey'}]}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

class Login extends Component {

  props: {
    authState: any
  }

  render() {

    const {authState, dispatch} = this.props
    const {formName, isValid, fields, isFetching} = authState

    let form, onNext, nextText, onBack

    switch(formName) {
      case LOGIN_PROFILE_FORM: /* 1. Screen */
        onBack = undefined
        onNext = () => dispatch(birthdayForm())
        nextText = "Weiter"
        form = <ProfileForm 
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
          styles={formStyles}
          onNext={isValid? onNext: null}
        />
        break
      case LOGIN_BIRTHDAY_FORM: /* 2. Screen */
        onBack = () => dispatch(profileForm())
        onNext = () => dispatch(phoneNumberForm())
        nextText = "Weiter"
        form = <BirthdayForm 
          styles={formStyles}
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
        />
        break
      case LOGIN_PHONENUMBER_FORM: /* 3. Screen */
        onBack = () => dispatch(birthdayForm())
        onNext = () => {
          dispatch(refreshContacts()) //permission dialog (IOS)
          dispatch(sendCode(fields.get('phoneNumberFormatted')))
        }
        nextText = "Code senden"
        form = <PhoneNumberForm 
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
          styles={formStyles}
          onNext={isValid ? onNext: null}/>
        break;
      case LOGIN_VERIFICATIONCODE_FORM: /* 4. Screen */
        onBack = () => dispatch(phoneNumberForm())
        onNext = () => {
          const {name, email, birthday} = fields
          dispatch(login(
            fields.get('phoneNumberFormatted'), /* username */
            fields.get('code'), /* password */
            { name, email, birthday } /* additional fields */
          ))
        }
        nextText = "Login"
        form = <VerificationCodeForm 
          styles={formStyles}
          authState={authState}
          onFormFieldChange={(name, text) => dispatch(onFormFieldChange(name, text))}
          onNext={isValid ? onNext : null}/>
        break;
    }

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />

        <View style={styles.navbar}>
          {onBack ? 
            <NavButton enabled={true} onPress={onBack} text="Zurück" style={styles.backButton}/> :
            undefined
          }
          <Text style={styles.title}></Text>
          <NavButton enabled={isValid && !isFetching} onPress={onNext} text={nextText} style={styles.nextButton}/>
        </View>
        {form}
      </View>
    )
  }
}

/**
 * Redux boilerplate
 */
function select(state) {
  return { authState: state.auth };
}
export default connect(select)(Login)
