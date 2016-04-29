/* @flow */

import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, {
  Component,
  View,
  PropTypes,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text
} from 'react-native';
import {Actions} from 'react-native-router-flux';

// import WishList from '../components/WishList'

class Profile extends Component {
  render() {
    const {user} = this.props.profileState
    
    BackButton = <TouchableOpacity
            style={styles.button}
            onPress={Actions.pop}>
            <Text style={styles.buttonText}>Zurück</Text>
        </TouchableOpacity>
    
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Profil von {user.name}</Text>
          {BackButton}
        </View>
    )
  }
}

Profile.propTypes = {
  profileState: PropTypes.instanceOf(Immutable.Record).isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 20,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return {profileState: state.profile};
}

export default connect(select)(Profile)