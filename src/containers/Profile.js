
import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {logout} from '../actions/authActions'
import {editProfile} from '../actions/profile'

import {AppBar, ActionButton} from '../components/AppBar'
import BirthdayText from '../components/BirthdayText'
import WMButton from '../components/WMButton'
import Tabs from '../components/Tabs'

import WMColors from '../lib/WMColors'

class Profile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {
    const {dispatch, user} = this.props
    return(
      <View style={ styles.container }>
        <StatusBar translucent={true}/>
        <AppBar title="Mein Profil" showBackButton={false}>
          <ActionButton text="Bearbeiten" onPress={() => dispatch(editProfile(user))}/>
        </AppBar>
        <Tabs selected="profile">
          <Text style={styles.tabText} name="profile">Mein Profil</Text>
          <Text style={styles.tabText} name="more" onSelect={() => Actions.more({type:'replace'})}>Mehr</Text>
        </Tabs>
        <View style={styles.profileHeader}>
          <Icon name="account-box" style={[styles.text, styles.profileIcon]}/>
          <Text style={[styles.text, styles.profileName]}>
            {user.name}
          </Text>
        </View>
        <View style={styles.profileDetails}>
          <View style={styles.attribute}>
            <Text style={[styles.text, styles.attributeLabel]}>E-Mail</Text>
            <Text style={[styles.text, styles.attributeValue]}>{user.email}</Text>
          </View>
          <View style={styles.attribute}>
            <Text style={[styles.text, styles.attributeLabel]}>Geb.</Text>
            <BirthdayText style={[styles.text, styles.attributeValue]} date={user.birthday}/>
          </View>
          <View style={styles.attribute}>
            <Text style={[styles.text, styles.attributeLabel]}>Telefon</Text>
            <Text style={[styles.text, styles.attributeValue]}>{user.phoneNumber}</Text>
          </View>
          <WMButton style={styles.logoutButton} onPress={() => dispatch(logout())} caption="Abmelden"/>
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
    color: WMColors.lightText,
    fontSize: 20
  },
  tabText: {
    fontSize: 20,
    color: 'white'
  },
  profileHeader: {
    flexDirection: 'row'
  },
  profileName: {
    marginTop: 20 
  },
  profileDetails: {
    marginHorizontal: 25
  },
  attribute: {
    flexDirection: 'row',
    marginTop: 10,
  },
  attributeLabel: {
    width: 125
  },
  profileIcon: {
    fontSize: 120,
    margin: 10 
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
