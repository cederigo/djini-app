
import { connect } from 'react-redux'
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {updateProfile, onFieldChange} from '../actions/profile'

import {AppBar, ActionButton} from '../components/AppBar'
import BirthdayInput from '../components/BirthdayInput'
import DjiniTextInput from '../components/DjiniTextInput'
import DjiniText from '../components/DjiniText'

class ProfileEdit extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
  }

  render() {
    const {dispatch, fields, isValid, isFetching, user} = this.props
    const {name, email, birthday} = fields
    return(
      <View style={ styles.container}>
        <AppBar title="Profil Bearbeiten" showBackButton={true}>
          <ActionButton text="Fertig" disabled={!isValid} onPress={() => dispatch(updateProfile(fields, 'profile-edit'))}/>
        </AppBar>
        <Icon name="account-box" style={[styles.text, styles.profileIcon]}/>
        <View style={styles.fields}>
          <View style={styles.field}>
            <DjiniText style={[styles.text, styles.fieldLabel]}>Name</DjiniText>
            <DjiniTextInput
              autoFocus={true}
              style={styles.fieldInput}
              value={name}
              editable={!isFetching}
              onChangeText={(text) => { dispatch(onFieldChange('name', text))}}
              onSubmitEditing={() => this.refs.email.focus()}
            />
          </View>
          <View style={styles.field}>
            <DjiniText style={[styles.text, styles.fieldLabel]}>E-Mail</DjiniText>
            <DjiniTextInput
              ref="email"
              style={styles.fieldInput}
              value={email}
              editable={!isFetching}
              onChangeText={(text) => { dispatch(onFieldChange('email', text))}}
              onSubmitEditing={() => this.refs.birthday.focus()}
            />
          </View>
          <View style={styles.field}>
            <DjiniText style={[styles.text, styles.fieldLabel]}>Geb.</DjiniText>
            <BirthdayInput
              ref="birthday"
              style={styles.fieldInput}
              date={birthday}
              editable={!isFetching}
              onDateChange={(date) => {dispatch(onFieldChange('birthday', date))}}
            />
          </View>
          <View style={styles.field}>
            <DjiniText style={[styles.text, styles.fieldLabel]}>Telefon</DjiniText>
            <DjiniText style={styles.text}>{user.phoneNumber}</DjiniText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20
  },
  tabText: {
    fontSize: 20,
    color: 'white'
  },
  profileIcon: {
    fontSize: 120,
    margin: 10 
  },
  fields: {
    marginHorizontal: 25
  },
  field: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  fieldLabel: {
    width: 90 
  },
  fieldInput: {
    height: 40,
    flex: 1,
    paddingLeft: 10
  }
});

function select(state) {
  return {...state.profile.toJS()}
}

export default connect(select)(ProfileEdit);
