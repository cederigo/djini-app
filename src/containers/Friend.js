/* @flow */

import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import DjiniBackground from '../components/DjiniBackground'
import DjiniText from '../components/DjiniText'
import DjiniButton from '../components/DjiniButton'

import Tabs from '../components/Tabs'
import BirthdayText from '../components/BirthdayText'
import FriendWishesList from '../components/FriendWishesList'
import FriendIdeasList from '../components/FriendIdeasList'
import {AppBar} from '../components/AppBar'

import {toggleFavorite, invite} from '../actions/contacts'
import {newWish} from '../actions/wishes'

class Friend extends Component {

  static propTypes = {
    isFetching: PropTypes.bool,
    user: PropTypes.object, // me
    friend: PropTypes.object,
    contact: PropTypes.object,
    wishes: PropTypes.object,
    ideas: PropTypes.object
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

  renderContentView() {
    return (
      <View style={styles.container}>
        {this.renderProfileView()}
        {this.renderTabs()}
      </View>
    )
  }

  renderProfileView() {
    const {friend, contact, dispatch} = this.props

    return (
      <View style={styles.profile}>
        <DjiniText textStyle="dark" style={styles.profileName}>
          {contact.name}
        </DjiniText>
        <BirthdayText textStyle="dark" style={styles.profileBirthday} text="Geb. " date={friend.birthday}/>
        <DjiniButton
          style={styles.favoriteButton}
          iconStyle={styles.favoriteIcon}
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
          <DjiniText>
            {contact.name + ' hat noch kein eigenes Profil erstellt'}
          </DjiniText>
          <DjiniButton
            style={styles.inviteButton}
            caption={contact.name + ' einladen'}
            onPress={() => dispatch(invite(contact))} />
        </View>
      ) 
    }
    if (activeTab === 'wishes') {
      return <FriendWishesList style={styles.container} wishes={wishes.toArray()} user={user}/>
    } else {
      return <FriendIdeasList style={styles.container} wishes={ideas.toArray()}/>
    }
  }

  renderTabs() {
    const {user, friend, dispatch} = this.props
    return (
      <View style={styles.container}>
        <Tabs selected={this.state.activeTab} onSelect={(el) => this.setState({activeTab: el.props.name})}>
          <DjiniText style={styles.tabText} initial={true} name="wishes">Wünsche</DjiniText>
          <View style={styles.tabIdeas} name="ideas">
            <DjiniText style={styles.tabText}>Meine Ideen</DjiniText>
            <TouchableOpacity
              onPress={() => dispatch(newWish(user, friend, 'friend'))}>
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
        <DjiniText style={[styles.text, styles.textBig]}>Laden..</DjiniText>
      </View>
   )
  }

  render() {
    const {isFetching} = this.props
    return (
      <DjiniBackground>
        <View style={styles.appBar}>
          <StatusBar translucent={true} barStyle="default"/>
          <AppBar textStyle="dark" showBackButton={true} title="Freunde"/>
        </View>
        {isFetching ? 
          this.renderLoadingView()
          : this.renderContentView()
        }
      </DjiniBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    backgroundColor: 'rgb(240, 240, 240)'
  },
  profile: {
    paddingLeft: 25,
    backgroundColor: 'rgb(240, 240, 240)',
    flexDirection: 'column',
    height: 125
  },
  profileName: {
    fontSize: 27,
    marginBottom: 20 
  },
  profileBirthday: {
    fontSize: 14
  },
  favoriteButton: {
    position: 'absolute',
    right: 25,
    top: 0,
    backgroundColor: 'transparent',
    padding: 10 
  },
  favoriteIcon: {
    color: 'rgb(239,71,98)',
    fontSize: 40
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
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white'
  },
  tabIcon: {
    color: 'white',
    fontSize: 34,
    padding: 5 
  },
  tabIdeas: {
    flex: 1,
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
