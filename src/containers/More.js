
import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import {Actions} from 'react-native-router-flux'

// import {logout} from '../actions/authActions'
import {editProfile} from '../actions/profile'

import {AppBar, ActionButton} from '../components/AppBar'
// import WMButton from '../components/WMButton'
import Tabs from '../components/Tabs'

import WMColors from '../lib/WMColors'

class More extends Component {
  render() {
    const {dispatch, currentUser} = this.props
    return(
      <View style={ styles.container }>
        <StatusBar translucent={true}/>
        <AppBar title="Mehr" showBackButton={false}/>
        <Tabs selected="more">
          <Text style={styles.tabText} name="profile" onSelect={() => Actions.profile({type: 'replace'})}>Mein Profil</Text>
          <Text style={styles.tabText} name="more">Mehr</Text>
        </Tabs>
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

export default connect()(More);
