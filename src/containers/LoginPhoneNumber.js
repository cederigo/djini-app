import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as authActions from '../reducers/auth/authActions';
import React, {
  Component,
  PropTypes,
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';

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

class LoginPhoneNumber extends Component {

  render() {

    const {actions, authState} = this.props
    const phoneNumber = authState.getIn(['fields', 'phoneNumber'])
    const phoneNumberFormatted = authState.getIn(['fields', 'phoneNumberFormatted'])
    const iconName = authState.isValid ? 'sentiment-satisfied' : 'sentiment-neutral'

    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>Deine Telefon Nummer..</Text>
        <Icon name={iconName} size={90} />
        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          autoFocus={true}
          keyboardType="phone-pad"
          autoCorrect={false}
          placeholder="+41 79 123 456"
          onChangeText={(text) => {
            actions.onPhoneNumberChange(text)
          }}
          onSubmitEditing={() => {
            if (authState.isValid) {
              actions.sendCode(phoneNumberFormatted)
            }
          }}
          value={phoneNumber}
        />
      </View>
    )
  }
}

LoginPhoneNumber.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPhoneNumber)
