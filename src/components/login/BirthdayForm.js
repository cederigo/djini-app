import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {
  Component,
  PropTypes,
  View
} from 'react-native';
import BirthdayInput from '../BirthdayInput'


export default class BirthdayForm extends Component {

  render() {

    const {actions, authState, styles} = this.props
    const {birthday} = authState.fields
    return ( 
      <View style={styles.container}>
        <Icon name="cake" style={styles.icon} size={90} />
        <BirthdayInput initialDate={birthday} onDateChange={date => actions.onFormFieldChange('birthday', date)} />
      </View>
    )
  }
}

BirthdayForm.propTypes = {
  authState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}
