import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  Component,
  PropTypes,
  View,
  TextInput,
  Text
} from 'react-native';
import BirthdayInput from '../BirthdayInput'


export default class ProfileForm extends Component {

  render() {

    const {actions, authState, styles} = this.props
    const {name, email} = authState.fields
    return ( 
      <View style={styles.container}>
        <Icon name="account-circle" style={styles.icon} size={90} />

        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          placeholder="Username"
          onChangeText={(text) => { actions.onFormFieldChange('name', text)}}
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
          onChangeText={(text) => { actions.onFormFieldChange('email', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          value={email}
        />

      </View>
    )
  }
}

ProfileForm.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}
