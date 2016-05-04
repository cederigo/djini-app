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
import {newWish, show} from '../actions/wishes'

import NewWishButton from '../components/NewWishButton'

import WishList from '../components/WishList'

class Friend extends Component {
  
  render() {
    const {friendState, dispatch} = this.props
    const {user} = friendState
    console.log(friendState)
    console.log(user)
    let BackButton
    
    if (friendState.isFetching) {
      theirWishes = <Text>Wünsche werden geladen</Text>
    } else {
      if (friendState.wishes.size > 0) {
        theirWishes = <WishList wishes={friendState.wishes} show={(wish) => dispatch(show(wish))}/>
      } else {
        if (friendState.error !== null) {
          theirWishes = <View><Text>Keine Wünsche!</Text>
          <Text>(Aber beim Laden gab's einen Fehler)</Text></View>
        } else {
          theirWishes = <Text>Keine Wünsche!</Text>
        }
      }
    }
    if (friendState.isFetching) {
      myIdeas = <Text>Ideen werden geladen</Text>
    } else {
      if (friendState.ideas.size > 0) {
        myIdeas = <WishList wishes={friendState.ideas} show={(wish) => dispatch(show(wish))}/>
      } else {
        if (friendState.error !== null) {
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
          {BackButton}
          <Text style={styles.title}>Wünsche von {user.name}</Text>
          {theirWishes}
          <Text style={styles.title}>Meine Ideen für {user.name}</Text>
          <NewWishButton newWish={() => dispatch(newWish(user))}/>
          {myIdeas}
        </View>
    )
  }
}

Friend.propTypes = {
  friendState: PropTypes.instanceOf(Immutable.Record).isRequired
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
    friendState: state.friend
  }
}

export default connect(select)(Friend)