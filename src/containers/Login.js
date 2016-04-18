import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, {
  Platform,
  Alert,
  Component,
  TouchableOpacity,
  View,
  Text,
  PropTypes,
  StyleSheet,
  StatusBar
} from 'react-native';

import * as authActions from '../reducers/auth/authActions'
import PhoneNumberForm from '../components/login/PhoneNumberForm'
import VerificationCodeForm from '../components/login/VerificationCodeForm'
import ProfileForm from '../components/login/ProfileForm'
import {
  LOGIN_PHONENUMBER_FORM,
  LOGIN_VERIFICATIONCODE_FORM,
  LOGIN_PROFILE_FORM
} from '../lib/constants'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center'
  },
  navbar: {
    marginTop: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD'
  },
  button: {
    padding: 15,
    alignSelf: 'flex-end'
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500'
  },
  text: {},
  icon: {
    marginBottom: 30
  },

  input: {
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
    marginTop: 10,
    marginBottom: 10
  }
});

class NavButton extends React.Component {
  render() {
    const {enabled, onPress, text} = this.props
    return (
      <TouchableOpacity
        activeOpacity={enabled ? 0 : 1}
        style={styles.button}
        onPress={() => { if (enabled) { onPress() }}}>
        <Text style={[styles.buttonText, {color: enabled ? 'rgb(0, 122, 155)' : 'grey'}]}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

class Login extends Component {

  render() {

    console.log('Login.render()')

    const {formName, error, isValid, fields} = this.props.authState
    const {sendCode, login, updateProfile} = this.props.actions

    let form, onNext, nextText

    if (error) {
      Alert.alert('Error', error.message)
    }

    switch(formName) {
      case LOGIN_PHONENUMBER_FORM:
        onNext = () => sendCode(fields.get('phoneNumberFormatted'))
        nextText = "Code senden"
        form = <PhoneNumberForm {...this.props} styles={styles} onNext={isValid ? onNext: null}/>
        break;
      case LOGIN_VERIFICATIONCODE_FORM:
        onNext = () => login(fields.get('phoneNumberFormatted'), fields.get('code'))
        nextText = "Login"
        form = <VerificationCodeForm {...this.props} styles={styles} onNext={isValid ? onNext : null}/>
        break;
      case LOGIN_PROFILE_FORM:
        onNext = () => updateProfile({
          firstName: fields.get('firstName'),
          lastName: fields.get('lastName'),
          email: fields.get('email'),
          birthday: fields.get('birthday')})
        nextText = "Fertig"
        form = <ProfileForm {...this.props} styles={styles} />
        break
    }

    return (
      <View style={{flex: 1}}>

        <StatusBar translucent={true} />

        <View style={styles.navbar}>
          <NavButton enabled={isValid} onPress={onNext} text={nextText}/>
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
  return { actions: bindActionCreators(authActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)