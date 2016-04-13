import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  Component,
  PropTypes,
  View,
  Text,
  TextInput
} from 'react-native';

export default class PhoneNumberForm extends Component {

  render() {

    const {actions, authState, styles} = this.props
    const phoneNumber = authState.getIn(['fields', 'phoneNumber'])
    const phoneNumberFormatted = authState.getIn(['fields', 'phoneNumberFormatted'])
    const iconName = authState.isValid ? 'sentiment-satisfied' : 'phone'

    return ( 
      <View style={styles.container}>
        <Icon name={iconName} style={styles.icon} size={90} />
        <Text style={styles.text}>Deine Telefon Nummer..</Text>
        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          autoFocus={true}
          keyboardType="phone-pad"
          autoCorrect={false}
          placeholder="+41 79 123 456"
          onChangeText={(text) => {
            actions.onFormFieldChange('phoneNumber', text)
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

PhoneNumberForm.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}
