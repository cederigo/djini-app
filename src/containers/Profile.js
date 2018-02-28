import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { editProfile, updateProfile, cancelEditProfile, onFieldChange } from '../actions/profile'
import { logout } from '../actions/authActions'
import { version, showVersionNumber, showLogoutButton } from '../lib/config'

import { AppBar, ActionButton } from '../components/AppBar'
import ProfileField from '../components/ProfileField'
import DjiniText from '../components/DjiniText'
import Tabs from '../components/Tabs'
import DjiniButton from '../components/DjiniButton'

class Profile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    edit: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired
  }

  render() {
    const { dispatch, user, edit, isValid, isFetching, fields } = this.props
    const editable = edit && !isFetching
    return (
      <View style={styles.container}>
        <View style={styles.appBar}>
          <AppBar
            textStyle="dark"
            title="Mein Profil"
            showBackButton={edit}
            backButtonText="Abbrechen"
            onBack={() => dispatch(cancelEditProfile())}
          >
            {edit ? (
              <ActionButton
                textStyle="dark"
                text="Fertig"
                disabled={!isValid || isFetching}
                onPress={() => dispatch(updateProfile(fields, 'profile-edit'))}
              />
            ) : (
              <ActionButton
                textStyle="dark"
                text="Bearbeiten"
                onPress={() => dispatch(editProfile(user))}
              />
            )}
          </AppBar>
        </View>
        <Tabs selected="profile">
          <DjiniText style={styles.tabText} name="profile">
            Details
          </DjiniText>
          <DjiniText style={styles.tabText} name="more" onSelect={() => Actions.more()}>
            Mehr
          </DjiniText>
        </Tabs>
        <View style={styles.fields}>
          <ProfileField
            iconName="person"
            value={edit ? fields.name : user.name}
            editable={editable}
            onChangeText={text => {
              dispatch(onFieldChange('name', text))
            }}
          />
          <ProfileField
            iconName="mail"
            value={edit ? fields.email : user.email}
            editable={editable}
            onChangeText={text => {
              dispatch(onFieldChange('email', text))
            }}
          />
          <ProfileField
            iconName="cake"
            isBirthday={true}
            value={edit ? fields.birthday : user.birthday}
            editable={editable}
            onDateChange={date => {
              dispatch(onFieldChange('birthday', date))
            }}
          />
          <ProfileField iconName="phone" value={user.phoneNumber} />
        </View>

        {showVersionNumber ? (
          <DjiniText style={styles.versionText}>{version}</DjiniText>
        ) : (
          undefined
        )}
        {showLogoutButton ? (
          <DjiniButton
            style={styles.logoutButton}
            onPress={() => dispatch(logout())}
            caption="Logout"
          />
        ) : (
          undefined
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  appBar: {
    backgroundColor: 'rgb(240, 240, 240)'
  },
  text: {
    fontSize: 20
  },
  tabText: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  fields: {
    marginTop: 40,
    marginHorizontal: 25
  },
  logoutButton: {
    marginTop: 40
  },
  versionText: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 11
  }
})

function select(state) {
  return { ...state.profile.toJS(), user: state.global.currentUser }
}

export default connect(select)(Profile)
