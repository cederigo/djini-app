/* @flow */

import { connect } from 'react-redux';
import {List} from 'immutable';
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import {Wish, User} from '../lib/types'
import NewWishButton from '../components/NewWishButton'

import MyWishList from '../components/MyWishList'

class Friend extends Component {

  props: {
    user: User,
    wishes: List<Wish>,
    ideas: List<Wish>
  }
  
  render() {
    const {user, contact, wishes, ideas, error} = this.props

    if (error) {
      Alert.alert('Oops', 'Profil konnten nicht geladen werden')
    }

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />

        <View style={styles.navbar}>
          <TouchableOpacity 
            style={styles.button}
            onPress={Actions.pop}>
            <Text style={styles.buttonText}>Zurück</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Profil von {contact.name}</Text>

        {user.registered ? 
          <Text>Geburtstag am: {user.birthday.toString()}</Text> :
          <Text>{contact.name} ist noch nicht dabei. Lade ihn jetzt ein!</Text>
        }


        <Text style={styles.title}>Wünsche von {contact.name}</Text>
        {wishes.size === 0 ? 
          <Text>{contact.name} hat noch keine Wünsche</Text> :
          <MyWishList wishes={wishes.toArray()} />
        }

        <Text style={styles.title}>Meine Ideen für {contact.name}</Text>
        <NewWishButton style={{height: 50}} text="Neue Idee" toUser={user}/>
        <MyWishList wishes={ideas.toArray()} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navbar: {
    marginTop: 20,
    height: 50,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold'
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  const friendState = state.friend
  return {
    user: friendState.user,
    contact: friendState.contact,
    isFetching: friendState.isFetching,
    wishes: friendState.wishes,
    ideas: friendState.ideas
  }
}

export default connect(select)(Friend)