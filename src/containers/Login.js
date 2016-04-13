import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, {
  Alert,
  Component,
  PropTypes,
  StyleSheet
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
    padding: 20,
    alignItems: 'center'
  },
  text: {
    margin: 20
  },
  icon: {},
  input: {}
});

class Login extends Component {

  render() {

    console.log('Login.render()')

    const {formName, error} = this.props.authState

    if (error) {
      Alert.alert('Error', error.message)
    }

    switch(formName) {
      case LOGIN_PHONENUMBER_FORM:
        return (<PhoneNumberForm {...this.props} styles={styles}/>)
      case LOGIN_VERIFICATIONCODE_FORM:
        return (<VerificationCodeForm {...this.props} styles={styles}/>)
      case LOGIN_PROFILE_FORM:
        return (<ProfileForm {...this.props} styles={styles}/>)
    }
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
