/**
 * ## Imports
 * 
 * Redux 
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';

/**
 * The necessary React components
 */
import React, {
  Component,
  PropTypes,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
  text: {
    marginTop: 50,
    padding: 20
  },

  input: {
    marginTop: 50,
    padding: 20
  },

  button: {
    width: 100,
    height: 30,
    padding: 10,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  }
});

class LoginVerificationCode extends Component {

  render() {

    const {actions, authState} = this.props
    const phoneNumber = authState.getIn(['fields', 'phoneNumber'])
    const verificationCode = authState.getIn(['fields', 'verificationCode'])
    //const isDisabled = auth.isFetching || !auth.isValid

    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>Den per SMS erhaltenen Code..</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            actions.onAuthFormFieldChange('verificationCode', text)
          }}
          value={verificationCode}
        />
        <TouchableOpacity 
            onPress={() => {
              actions.login(phoneNumber, verificationCode)
            }}
            style={styles.button}>
          <Text>Weiter</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

LoginVerificationCode.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Map).isRequired,
  actions: PropTypes.object.isRequired
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
  return { authState: state.auth };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(authActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginVerificationCode);
