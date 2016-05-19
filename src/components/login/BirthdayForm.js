import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {Component} from 'react';
import {View} from 'react-native';
import BirthdayInput from '../BirthdayInput'


export default class BirthdayForm extends Component {

  props: {
    onFormFieldChange: (name: string, value: Date) => void,
    authState: any,
    styles: any,
  }

  render() {

    const {onFormFieldChange, authState, styles} = this.props
    const {birthday} = authState.fields
    return ( 
      <View style={styles.container}>
        <Icon name="cake" style={styles.icon} size={90} />
        <BirthdayInput initialDate={birthday} onDateChange={date => onFormFieldChange('birthday', date)} />
      </View>
    )
  }
}
