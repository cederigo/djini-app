import { connect } from 'react-redux';

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import FulfillWishButton from './FulfillWishButton'
import WMButton from '../WMButton'
import {NavBar, NavButton} from '../NavBar'

// Utils
import {allowEdit, fulfillable, fulfilledByUser, fulfilled, toUser, fromUser, type} from '../../lib/wishUtil'

// Actions
import {Actions} from 'react-native-router-flux'
import {editWish, deleteWish} from '../../actions/wishes'

export default class ShowWishForm extends Component {
  render() {
    const {dispatch, currentUser, wishState} = this.props
    const {wish, isFetching} = wishState

    let EditButton, DeleteButton, FulfillButton, FulfillmentStatus, PrivacyStatus

    if (allowEdit(wish, currentUser)) {
      EditButton = <NavButton onPress={() => dispatch(editWish(wish))} enabled={!isFetching} text={"Bearbeiten"} />
      DeleteButton = <WMButton onPress={() => { dispatch(deleteWish(wish)); Actions.pop()}} caption={type(wish) + " löschen"} />
    }

    //PrivacyStatus
    if (toUser(wish, currentUser) && fromUser(wish, currentUser)) {
      PrivacyStatus = <Text style={styles.privacy}>{wish.isPrivate ? 'Dieser Wunsch ist privat' : 'Dieser Wunsch ist öffentlich'}</Text>
    }
    
    //FulfillButton
    if (fulfillable(wish, currentUser) || fulfilledByUser(wish, currentUser)) {
      FulfillButton = <FulfillWishButton wish={wish}/>
    }
    //FulfillmentStatus
    if (!toUser(wish, currentUser)) {
      if (fulfilledByUser(wish, currentUser)) {
        FulfillmentStatus = <Text style={styles.text}>Dieser Wunsch wird von mir erfüllt</Text>
      } 
      else if (wish.fulfillerName) {
        FulfillmentStatus = <Text style={styles.text}>Dieser Wunsch wird von {wish.fulfillerName} erfüllt</Text>
      } 
      else if (fulfilled(wish)) {
        FulfillmentStatus = <Text style={styles.text}>Dieser Wunsch wird erfüllt</Text>
      } 
    }
   
    return ( 
      <View style={styles.container}>
        <NavBar>
          {EditButton}
        </NavBar>
        <View style={styles.content}>
          <Text style={styles.title}>{wish.title}</Text>
          {wish.description ? <Text style={styles.text}>{wish.description}</Text> : undefined}
          {wish.url ? <Text style={styles.text}>{wish.url}</Text> : undefined}
          {wish.seenAt ? <Text style={styles.text}>{wish.seenAt}</Text> : undefined}
          {PrivacyStatus}
          {DeleteButton}
          {FulfillmentStatus}
          {FulfillButton}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  privacy: {
    margin: 20
  },
  text: {}

})

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishState: state.wish,
    currentUser: state.global.currentUser
  };
}
export default connect(select)(ShowWishForm)