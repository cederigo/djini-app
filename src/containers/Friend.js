/* @flow */

import { connect } from 'react-redux';
import {List} from 'immutable';
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

import {Wish, User, Contact} from '../lib/types'
import NewWishButton from '../components/NewWishButton'

import FriendWishesList from '../components/FriendWishesList'
import FriendIdeasList from '../components/FriendIdeasList'
import InviteButton from '../components/InviteButton'
import {NavBar} from '../components/NavBar'

class Friend extends Component {

  props: {
    user: User, //me
    friend: User,
    contact: Contact,
    wishes: List<Wish>,
    ideas: List<Wish>
  }

  constructor() {
    super()
    this.renderProfileView = this.renderProfileView.bind(this)
    this.renderInviteView = this.renderInviteView.bind(this)
  }

  renderProfileView() {
    const {user, friend, wishes, contact} = this.props
    return (
      <View>
        {friend.birthday ? <Text>Geburtstag am: {friend.birthday.toString()}</Text> : undefined}
        <Text style={styles.title}>{contact.name}s Wünsche</Text>
        <FriendWishesList wishes={wishes.toArray()} user={user} />
      </View>
    )
  }

  renderInviteView() {
    const {contact} = this.props
    return (
      <View>
        <Text>{contact.name} ist noch nicht dabei.</Text>
        <InviteButton contact={contact} />
      </View>
    )
  }

  
  render() {
    const {friend, contact, ideas} = this.props
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <NavBar/>

        <View style={styles.content}>
          <Text style={styles.title}>Profil von {contact.name}</Text>
          {friend.registered ? this.renderProfileView() : this.renderInviteView() }

          <Text style={styles.title}>Meine Ideen für {contact.name}</Text>
          <NewWishButton style={{height: 50}} text="Neue Idee" toUser={friend}/>
          <FriendIdeasList wishes={ideas.toArray()} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1
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
    user: state.global.currentUser,
    friend: friendState.user,
    contact: friendState.contact,
    isFetching: friendState.isFetching,
    wishes: friendState.wishes,
    ideas: friendState.ideas
  }
}

export default connect(select)(Friend)