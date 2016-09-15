import React, {PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import moment from 'moment'

import BirthdayInput from './BirthdayInput'
import DjiniTextInput from './DjiniTextInput'
import DjiniText from './DjiniText'
import Icon from 'react-native-vector-icons/MaterialIcons'

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    height: 30
  },
  fieldIcon: {
    width: 40,
    fontSize: 20,
    color: 'white'
  },
  fieldValue: {
    flex: 1,
  },
})

export default function ProfileField(props) {

  let {editable, iconName, value, isBirthday} = props

  if (!editable && isBirthday) {
    value = moment(value).format('DD.MM.YYYY')
  }
  
  return (
    <View style={styles.field}>
      <Icon style={styles.fieldIcon} name={iconName}/>
      {editable ? 
        isBirthday ?
          <BirthdayInput type="light" style={styles.fieldValue} date={value} {...props}/>
          : <DjiniTextInput type="light" style={styles.fieldValue} value={value} {...props}/>
        : <DjiniText style={styles.fieldValue} {...props}>{value}</DjiniText>
      }
    </View>
  )
}

ProfileField.propTypes = {
  editable: PropTypes.bool.isRequired,
  iconName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isBirthday: PropTypes.bool,
}

ProfileField.defaultProps = {
  editable: false,
  value: ''
}
