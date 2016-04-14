import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  Picker,
  Component,
  PropTypes,
  View,
  Text,
  TextInput
} from 'react-native';

//Picker Items
let DAYS = []
for (let i = 1; i <= 31; i++) { 
  DAYS.push({label: i + '.', value: i})
}

let MONTHS = [
  {label: 'Januar', value: 0},
  {label: 'Februar', value: 1},
  {label: 'März', value: 2},
  {label: 'April', value: 3},
  {label: 'Mai', value: 4},
  {label: 'Juni', value: 5},
  {label: 'Juli', value: 6},
  {label: 'August', value: 7},
  {label: 'September', value: 8},
  {label: 'Oktober', value: 9},
  {label: 'November', value: 10},
  {label: 'Dezember', value: 11}
]

export default class ProfileForm extends Component {

  render() {

    const {actions, authState, styles} = this.props
    const {firstName, lastName, email, birthday} = authState.fields
    return ( 
      <View style={styles.container}>
        <Icon name="account-circle" style={styles.icon} size={90} />

        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          placeholder="Vorname"
          onChangeText={(text) => { actions.onFormFieldChange('firstName', text)}}
          autoFocus={true}
          value={firstName}
        />

        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          placeholder="Nachname"
          onChangeText={(text) => { actions.onFormFieldChange('lastName', text)}}
          value={lastName}
        />

        <TextInput
          style={styles.input}
          editable={!authState.isFetching}
          placeholder="E-Mail"
          keyboardType="email-address"
          onChangeText={(text) => { actions.onFormFieldChange('email', text)}}
          value={email}
        />

        <Text style={[styles.text, {alignSelf: 'flex-start'}]}>Wann hast du Geburtstag?</Text>
        <View style={{alignSelf: 'flex-start', flexDirection: 'row'}}>
          <Picker
            style={{width: 100}}
            selectedValue={birthday.getDate()}
            onValueChange={(day) => {
              birthday.setDate(day)
              actions.onFormFieldChange('birthday', new Date(birthday))
            }}
            >
            {DAYS.map(item => 
              <Picker.Item label={item.label} value={item.value} key={item.value}/>
            )}
          </Picker>

          <Picker
            style={{width: 150}}
            selectedValue={birthday.getMonth()}
            onValueChange={(month) => {
              birthday.setMonth(month)
              actions.onFormFieldChange('birthday', new Date(birthday))
            }}
            >
            {MONTHS.map(item => 
              <Picker.Item label={item.label} value={item.value} key={item.value}/>
            )}
          </Picker>
        </View>


      </View>
    )
  }
}

ProfileForm.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}
