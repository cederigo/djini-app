
import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import {Actions} from 'react-native-router-flux'

import {editProfile, updateProfile} from '../actions/profile'

import {AppBar, ActionButton} from '../components/AppBar'

import WMColors from '../lib/WMColors'

class ProfileEdit extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {
    const {dispatch, user} = this.props
    return(
      <View style={ styles.container}>
        <StatusBar translucent={true}/>
        <AppBar title="Profil Bearbeiten" showBackButton={true}>
          <ActionButton text="Fertig" onPress={() => dispatch(updateProfile(user))}/>
        </AppBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabText: {
    fontSize: 20,
    color: 'white'
  },
});

export default connect()(ProfileEdit);
