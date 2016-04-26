import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  Component,
  Alert,
  View,
  Text,
  TextInput
} from 'react-native';

export default class VerificationCodeForm extends Component {

  props: {
    onFormFieldChange: (name: string, text: string) => void,
    onNext: () => void,
    authState: any,
    styles: any,
  }

  render() {

    const {onFormFieldChange, authState, styles, onNext} = this.props
    const code = authState.getIn(['fields', 'code'])

    if (authState.error) {
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
          onChangeText={(text) => onFormFieldChange('code', text)}
          onSubmitEditing={onNext}
          value={code}
        />
      </View>
    )
  }
}
