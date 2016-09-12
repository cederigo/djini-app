
import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux'

import {logout} from '../actions/authActions'
import {editProfile} from '../actions/profile'

import {AppBar, ActionButton} from '../components/AppBar'
import BirthdayText from '../components/BirthdayText'
import DjiniText from '../components/DjiniText'
import DjiniButton from '../components/DjiniButton'
import Tabs from '../components/Tabs'

class Profile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {
    const {dispatch, user} = this.props
            // <ActionButton textStyle="dark" text="Bearbeiten" onPress={() => dispatch(editProfile(user))}/>
    return(
      <View style={styles.container}>
        <View style={styles.appBar}>
          <AppBar textStyle="dark" title="Mein Profil" showBackButton={false}/>
        </View>
        <Tabs selected="profile">
          <DjiniText style={styles.tabText} name="profile">Details</DjiniText>
          <DjiniText style={styles.tabText} name="more" onSelect={() => Actions.more()}>Mehr</DjiniText>
        </Tabs>
        <View style={styles.fields}>
          <DjiniText style={[styles.text, styles.profileName]}>{user.name}</DjiniText>
          <View style={styles.field}>
            <DjiniText style={[styles.text, styles.fieldLabel]}>E-Mail</DjiniText>
            <DjiniText style={[styles.text, styles.fieldValue]}>{user.email}</DjiniText>
          </View>
          <View style={styles.field}>
            <DjiniText style={[styles.text, styles.fieldLabel]}>Geb.</DjiniText>
            <BirthdayText style={[styles.text, styles.fieldValue]} date={user.birthday}/>
          </View>
          <View style={styles.field}>
            <DjiniText style={[styles.text, styles.fieldLabel]}>Telefon</DjiniText>
            <DjiniText style={styles.text}>{user.phoneNumber}</DjiniText>
          </View>
          <DjiniButton style={styles.logoutButton} onPress={() => dispatch(logout())} caption="Abmelden"/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 28,
    fontStyle: 'italic',
    marginVertical: 20 
  },
  fields: {
    marginHorizontal: 25
  },
  field: {
    flexDirection: 'row',
    marginTop: 10,
  },
  fieldLabel: {
    width: 100
  },
  fieldValue: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 40
  }
});

function select(state) {
  return {
    user: state.global.currentUser
  }
}

export default connect(select)(Profile);
