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
import {newWish, getTheirWishes, getMyIdeas} from '../actions/wishes'

import NewWishButton from '../components/NewWishButton'

import WishList from '../components/WishList'

class Profile extends Component {
  
  componentDidMount() {
    const {profileState, dispatch} = this.props
    const {user} = profileState
    // TODO: user might not yet have an id
    if (user.id) {
      dispatch(getTheirWishes(user.id))
      dispatch(getMyIdeas(user.id))
    } else {
      console.log('no user.id => TODO')
    }
  }
  
  render() {
    const {profileState, dispatch} = this.props
    const {user} = profileState
    let BackButton
    
    if (profileState.isFetchingWishes) {
      theirWishes = <Text>Wünsche werden geladen</Text>
    } else {
      if (profileState.theirWishes.size > 0) {
        theirWishes = <WishList wishes={profileState.theirWishes} show={(wish) => dispatch(show(wish))}/>
      } else {
        if (profileState.error !== null) {
          theirWishes = <View><Text>Keine Wünsche!</Text>
          <Text>(Aber beim Laden gab's einen Fehler)</Text></View>
        } else {
          theirWishes = <Text>Keine Wünsche!</Text>
        }
      }
    }
    if (profileState.isFetchingIdeas) {
      myIdeas = <Text>Ideen werden geladen</Text>
    } else {
      if (profileState.myIdeas.size > 0) {
        myIdeas = <WishList wishes={profileState.myIdeas} show={(wish) => dispatch(show(wish))}/>
      } else {
        if (profileState.error !== null) {
          myIdeas = <View><Text>Keine Ideen!</Text>
          <Text>(Aber beim Laden gab's einen Fehler)</Text></View>
        } else {
          myIdeas = <Text>Keine Ideen!</Text>
        }
      }
    }
    
    BackButton = <TouchableOpacity
            style={styles.button}
            onPress={Actions.pop}>
            <Text style={styles.buttonText}>Zurück</Text>
        </TouchableOpacity>
    
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Profil von {user.name}</Text>
          <NewWishButton newWish={() => dispatch(newWish(user))}/>
          {BackButton}
          {theirWishes}
          {myIdeas}
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
  return {
    profileState: state.profile
  }
}

export default connect(select)(Profile)