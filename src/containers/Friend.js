import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import {formatBirthday} from '../lib/dateUtil'

import DjiniBackground from '../components/DjiniBackground'
import DjiniText from '../components/DjiniText'
import DjiniButton from '../components/DjiniButton'
import DjiniError from '../components/DjiniError'

import Tabs from '../components/Tabs'
import FriendWishesList from '../components/FriendWishesList'
import FriendIdeasList from '../components/FriendIdeasList'
import {AppBar} from '../components/AppBar'

import {setFavorite, invite} from '../actions/contacts'
import {newWish} from '../actions/wishes'
import {loadFriendProfile} from '../actions/profile'

class Friend extends Component {

  static propTypes = {
    isFetching: PropTypes.bool,
    user: PropTypes.object, // me
    friend: PropTypes.object,
    contact: PropTypes.object,
    wishes: PropTypes.object,
    ideas: PropTypes.object,
    error: PropTypes.object
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

  renderProfileView() {
    const {friend, contact, dispatch, isFetching, error} = this.props
    let birthdayText = isFetching || error ? '' : 'Djini kennt den Geburtstag leider nicht'
    if (friend.birthday) {
      birthdayText = formatBirthday(friend.birthday)
    }
    return (
      <View style={styles.profile}>
        <DjiniText textStyle="dark" style={styles.profileName} numberOfLines={2}>
          {contact.name}
        </DjiniText>
        <DjiniText textStyle="dark" style={styles.profileBirthday}>
          {birthdayText}
        </DjiniText>
        <DjiniButton
          style={styles.favoriteButton}
          iconStyle={styles.favoriteIcon}
          iconName={contact.isFavorite ? 'favorite' : 'favorite-border'}
          onPress={() => dispatch(setFavorite(contact, !contact.isFavorite))}/>
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
            {`Unbegreiflich! „${contact.name}“ hat Djini noch nicht installiert. Jetzt einladen und lass Djini ihre/seine Wünsche erfüllen.`}
          </DjiniText>
          <DjiniButton
            style={styles.inviteButton}
            caption={contact.name + ' einladen'}
            onPress={() => dispatch(invite(contact))} />
        </View>
      ) 
    }
    if (activeTab === 'wishes') {
      return <FriendWishesList style={styles.list} wishes={wishes.toArray()} user={user} contact={contact}/>
    } else {
      return <FriendIdeasList style={styles.list} wishes={ideas.toArray()} user={user} friend={friend} contact={contact}/>
    }
  }

  renderTabs() {
    const {user, friend, dispatch} = this.props
    return (
      <View style={styles.container}>
        <Tabs selected={this.state.activeTab} onSelect={(el) => this.setState({activeTab: el.props.name})}>
          <DjiniText style={styles.tabText} initial={true} name="wishes">Wünsche</DjiniText>
          <View style={styles.tabIdeas} name="ideas">
            <DjiniText style={styles.tabText} numberOfLines={1}>Ideen</DjiniText>
            <TouchableOpacity style={styles.tabIconContainer}
              onPress={() => dispatch(newWish(user, friend, 'friend'))}>
              <Icon style={styles.tabIcon} name="add"/>
            </TouchableOpacity>
          </View>
        </Tabs>
        {this.renderTab()}
      </View>
    )
  }

  render() {
    const {dispatch, isFetching, error, contact} = this.props
    return (
      <DjiniBackground>
        <View style={styles.appBar}>
          <AppBar textStyle="dark" showBackButton={true} title="Freunde"/>
        </View>
        {this.renderProfileView()}
        {isFetching ? 
          <DjiniText style={styles.loadingText}>Laden..</DjiniText>
          : error ? 
            <DjiniError style={styles.error} errorText="Oops. Profil konnte nicht geladen werden"
              onReloadPress={() => dispatch(loadFriendProfile(contact))} 
              reloadButtonText="Nochmals versuchen"/>
          : this.renderTabs()
        }
      </DjiniBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    marginBottom: 50 // Tabbar
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
    marginBottom: 20,
    marginRight: 80 // Leave room for `favoriteButton`
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
  loadingText: {
    marginTop: 50,
    textAlign: 'center'
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
    color: 'white',
  },
  tabIconContainer: {
    position: 'absolute',
    top: 0, right: 0,
    width: 50, height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIcon: {
    color: 'white',
    fontSize: 34,
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
    ideas: friendState.ideas,
    error: friendState.error
  }
}

export default connect(select)(Friend)
