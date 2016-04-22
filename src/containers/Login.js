import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, {
  Platform,
  Component,
  TouchableOpacity,
  View,
  Text,
  PropTypes,
  StyleSheet,
  StatusBar
} from 'react-native';

import * as authActions from '../reducers/auth/authActions'
import * as socialActions from '../reducers/social/socialActions'

import PhoneNumberForm from '../components/login/PhoneNumberForm'
import VerificationCodeForm from '../components/login/VerificationCodeForm'
import ProfileForm from '../components/login/ProfileForm'
import BirthdayForm from '../components/login/BirthdayForm'
import {
  LOGIN_PHONENUMBER_FORM,
  LOGIN_VERIFICATIONCODE_FORM,
  LOGIN_PROFILE_FORM,
  LOGIN_BIRTHDAY_FORM
} from '../lib/constants'


const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 10
  },
  text: {},
  icon: {
    alignSelf: 'center',
    marginBottom: 30
  },
  input: {
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
    marginTop: 10
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navbar: {
    marginTop: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  nextButton: {
    padding: 15,
  },
  title: {
    flex: 1,
  },
  backButton: {
    padding: 15,
    alignSelf: 'flex-start'
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500'
  }
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

  render() {

    console.log('Login.render()')

    const {formName, isValid, fields, isFetching} = this.props.authState
    const {profileForm, phoneNumberForm, birthdayForm, sendCode, login, refreshContacts} = this.props.actions

    let form, onNext, nextText, onBack

    switch(formName) {
      case LOGIN_PROFILE_FORM: /* 1. Screen */
        onBack = undefined
        onNext = () => birthdayForm()
        nextText = "Weiter"
        form = <ProfileForm {...this.props} styles={formStyles} onNext={isValid? onNext: null} />
        break
      case LOGIN_BIRTHDAY_FORM: /* 2. Screen */
        onBack = () => profileForm()
        onNext = () => phoneNumberForm()
        nextText = "Weiter"
        form = <BirthdayForm {...this.props} styles={formStyles} />
        break
      case LOGIN_PHONENUMBER_FORM: /* 3. Screen */
        onBack = () => birthdayForm()
        onNext = () => {
          refreshContacts() //permission dialog (IOS)
          sendCode(fields.get('phoneNumberFormatted'))
        }
        nextText = "Code senden"
        form = <PhoneNumberForm {...this.props} styles={formStyles} onNext={isValid ? onNext: null}/>
        break;
      case LOGIN_VERIFICATIONCODE_FORM: /* 4. Screen */
        onBack = () => phoneNumberForm()
        onNext = () => {
          const {name, email, birthday} = fields
          login(
            fields.get('phoneNumberFormatted'), /* username */
            fields.get('code'), /* password */
            { name, email, birthday } /* additional fields */
          )
        }
        nextText = "Login"
        form = <VerificationCodeForm {...this.props} styles={formStyles} onNext={isValid ? onNext : null}/>
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

Login.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired
}

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { authState: state.auth};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({...authActions, ...socialActions}, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
