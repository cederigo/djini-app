/* @flow */

import { connect } from 'react-redux';
import {List} from 'immutable';
import React, {Component} from 'react'
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import {Wish, User, Contact} from '../lib/types'
import WMColors from '../lib/WMColors'
import WMButton from '../components/WMButton'

import Tabs from '../components/Tabs'
import FriendWishesList from '../components/FriendWishesList'
import FriendIdeasList from '../components/FriendIdeasList'
import {AppBar} from '../components/AppBar'

import {toggleFavorite, invite} from '../actions/contacts'
import {newWish} from '../actions/wishes'

class Friend extends Component {

  props: {
    isFetching: bool,
    user: User, //me
    friend: User,
    contact: Contact,
    wishes: List<Wish>,
    ideas: List<Wish>
  }

  constructor(props) {
    super(props)
    this.renderProfileView = this.renderProfileView.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderTab = this.renderTab.bind(this)
    this.state = {
      activeTab: 'wishes'
    }
  }

  renderBirthday(date) {
    if (!date) {
      return ''
    }
    return `Geb. ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  renderContentView() {
    return (
      <View>
        {this.renderProfileView()}
        {this.renderTabs()}
      </View>
    )
  }

  renderProfileView() {
    const {user, friend, wishes, ideas, contact, dispatch} = this.props

    return (
      <View style={styles.profile}>
        <Icon name="account-box" style={[styles.text, styles.profileIcon]}/>
        <View style={styles.profileDetails}>
          <Text style={[styles.text, styles.textBig]}>
            {contact.name}
          </Text>
          <Text style={[styles.text, styles.textSmall]}>
            {this.renderBirthday(friend.birthday)}
          </Text>
        </View>
        <WMButton
          style={styles.profileFavoriteButton}
          toggle={true}
          active={contact.isFavorite}
          iconName={contact.isFavorite ? 'favorite' : 'favorite-border'}
          onPress={() => dispatch(toggleFavorite(contact))}/>
      </View>
    )
  }

  renderTab() {
    const {user, friend, contact, wishes, ideas, dispatch} = this.props
    const {activeTab} = this.state
    if (activeTab === 'wishes' && !friend.registered) {
      return (
        <View style={styles.inviteView}>
          <Text style={styles.text}>
            {contact.name + ' hat noch kein eigenes Profil erstellt'}
          </Text>
          <WMButton
            style={styles.inviteButton}
            caption={contact.name + ' einladen'}
            onPress={() => dispatch(invite(contact))} />
        </View>
      ) 
    }
    if (activeTab === 'wishes') {
      return <FriendWishesList wishes={wishes.toArray()} user={user}/>
    } else {
      return <FriendIdeasList wishes={ideas.toArray()}/>
    }
  }

  renderTabs() {
    const {user, friend, dispatch} = this.props
    return (
      <View style={styles.tabbedView}>
        <Tabs selected={this.state.activeTab} onSelect={(el) => this.setState({activeTab: el.props.name})}>
          <Text style={styles.tabText} initial={true} name="wishes">Wünsche</Text>
          <View style={styles.tabIdeas} name="ideas">
            <Text style={styles.tabText}>Meine Ideen</Text>
            <TouchableOpacity
              onPress={() => dispatch(newWish(user, friend))}>
              <Icon style={styles.tabIcon} name="add"/>
            </TouchableOpacity>
          </View>
        </Tabs>
        {this.renderTab()}
      </View>
    )
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <Text style={[styles.text, styles.textBig]}>Laden..</Text>
      </View>
   )
  }

  render() {
    const {isFetching} = this.props
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <AppBar showBackButton={true} title="Freunde"/>
        {isFetching ? 
          this.renderLoadingView()
          : this.renderContentView()
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: WMColors.lightText,
    fontSize: 17
  },
  textSmall: {
    fontSize: 14
  },
  textBig: {
    fontSize: 20 
  },
  profile: {
    flexDirection: 'row'
  },
  profileDetails: {
    marginTop: 20 
  },
  profileIcon: {
    fontSize: 120,
    margin: 10 
  },
  profileFavoriteButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 25,
    bottom: 25 
  },
  loading: {
    marginTop: 100,
    alignItems: 'center'
  },
  inviteView: {
    padding: 25,
  },
  inviteButton: {
    marginVertical: 25
  },
  tabText: {
    fontSize: 20,
    color: 'white'
  },
  tabIcon: {
    color: 'white',
    fontSize: 34,
    marginLeft: 10
  },
  tabIdeas: {
    flexDirection: 'row',
    alignItems: 'center',
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