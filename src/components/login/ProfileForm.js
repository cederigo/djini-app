import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  View,
  Component,
  TextInput
} from 'react-native';

export default class ProfileForm extends Component {

  props: {
    onFormFieldChange: (name: string, text: string) => void,
    onNext: () => void,
    authState: any,
    styles: any,
  }

  render() {

    const {onFormFieldChange, authState, styles, onNext} = this.props
    const {name, email} = authState.fields
    return ( 
      <View style={styles.container}>
        <Icon name="account-circle" style={styles.icon} size={90} />

        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          placeholder="Username"
          onChangeText={(text) => { onFormFieldChange('name', text)}}
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          value={name}
          onSubmitEditing={() => this.refs.email.focus()}
        />

        <TextInput
          ref="email"
          style={styles.input}
          editable={!authState.isFetching}
          placeholder="E-Mail"
          keyboardType="email-address"
          onChangeText={(text) => { onFormFieldChange('email', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={onNext}
          value={email}
        />

      </View>
    )
  }
}
