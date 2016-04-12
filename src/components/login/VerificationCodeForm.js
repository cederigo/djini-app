import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  Component,
  PropTypes,
  View,
  Text,
  TextInput
} from 'react-native';

export default class VerificationCodeForm extends Component {

  render() {

    console.log('VerificationCodeForm.render()')

    const {actions, authState, styles} = this.props
    const phoneNumberFormatted = authState.getIn(['fields', 'phoneNumberFormatted'])
    const code = authState.getIn(['fields', 'code'])

    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>Den per SMS erhaltenen Code..</Text>
        <Icon name="sms" size={90} />
        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          autoFocus={true}
          keyboardType="numeric"
          onChangeText={(text) => {
            actions.onFormFieldChange('code', text)
          }}
          onSubmitEditing={() => {
            if (authState.isValid) {
              actions.login(phoneNumberFormatted, code)
            }
          }}
          value={code}
        />
      </View>
    )
  }
}

VerificationCodeForm.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}
