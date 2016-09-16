// @flow

import { connect } from 'react-redux';
import type {Wish, User, Contact} from '../../lib/types'

import React, {Component} from 'react';
import {Alert} from 'react-native';
import DjiniButton from '../DjiniButton'

// Actions
import {fulfillWish, saveWish} from '../../actions/wishes'

// Utils
import {fulfillable, fulfilledByUser, isIdea} from '../../lib/wishUtil'

class FulfillWishButton extends Component {

  props: {
    dispatch: () => void,
    currentUser: User,
    contact: Contact,
    wish: Wish,
    style: any
  }

  render() {
    const {dispatch, currentUser, wish, contact} = this.props
    
    let caption, msg, onConfirm

    if (!fulfillable(wish, currentUser)) {
      return; //nothing to render
    }

    if (fulfilledByUser(wish, currentUser)) {
      caption = isIdea(wish) ? 'Zurücksetzen' :  'Freigeben'
      msg = 'Willst Du diesen Wunsch wirklich nicht mehr erfüllen?'
      onConfirm = () => dispatch(saveWish({...wish, fulfillerId: null}))
    } else {
      caption = 'Erfüllen'
      msg = 'Willst Du diesen Wunsch wirklich erfüllen?'
      onConfirm = () => dispatch(fulfillWish(wish, contact))
    }

    function confirmDialog() {
      if (isIdea(wish)) {
        onConfirm()
      } else {
        Alert.alert(msg, '', [{text: 'Abbrechen'}, {text: 'Ja', onPress: onConfirm}])
      }
    }

    return (
      <DjiniButton style={this.props.style} iconName="check" onPress={confirmDialog} caption={caption} />
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
