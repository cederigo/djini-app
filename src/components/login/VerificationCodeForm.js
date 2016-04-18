import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  Component,
  Alert,
  PropTypes,
  View,
  Text,
  TextInput
} from 'react-native';

export default class VerificationCodeForm extends Component {

  render() {

    console.log('VerificationCodeForm.render()')

    const {actions, authState, styles, onNext, error} = this.props
    const code = authState.getIn(['fields', 'code'])

    if (error) {
      Alert.alert('Falscher Code', 'Bitte nochmals eingeben')
    }

    return ( 
      <View style={styles.container}>
        <Icon name="sms" size={90} style={styles.icon} />
        <Text style={styles.text}>SMS Code..</Text>
        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          autoFocus={true}
          keyboardType="numeric"
          onChangeText={(text) => {
            actions.onFormFieldChange('code', text)
          }}
          onSubmitEditing={onNext}
          value={code}
        />
      </View>
    )
  }
}

VerificationCodeForm.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  onNext: PropTypes.func
}
