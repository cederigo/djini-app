import { connect } from 'react-redux';
import {Wish, User} from '../../lib/types'

import React, {Component} from 'react';
import {Alert} from 'react-native';
import WMButton from '../WMButton'

// Actions
import {fulfillWish, saveWish} from '../../actions/wishes'

// Utils
import {fulfillable, fulfilledByUser} from '../../lib/wishUtil'

class FulfillWishButton extends Component {

  props: {
    currentUser: User,
    wish: Wish
  }

  render() {
    const {dispatch, currentUser, wish} = this.props
    
    let caption, msg, onConfirm

    if (!fulfillable(wish, currentUser)) {
      return; //nothing to render
    }

    if (fulfilledByUser(wish, currentUser)) {
      caption = 'Wunsch unerfüllen'
      msg = 'Willst Du diesen Wunsch wirklich nicht mehr erfüllen?'
      onConfirm = () => dispatch(saveWish(wish.set('fulfillerId', null)))
    } else {
      caption = 'Wunsch erfüllen'
      msg = 'Willst Du diesen Wunsch wirklich erfüllen?'
      onConfirm = () => dispatch(fulfillWish(wish))
    }

    function confirmDialog() {
      Alert.alert(msg, '', [{text: 'Abbrechen'}, {text: 'Ja', onPress: onConfirm}])
    }

    return (
      <WMButton onPress={confirmDialog} caption={caption} />
    )
  }
}

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    currentUser: state.global.currentUser
  };
}
export default connect(select)(FulfillWishButton)