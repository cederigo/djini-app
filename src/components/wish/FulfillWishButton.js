import { connect } from 'react-redux';
import {Wish, User} from '../../lib/types'

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
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
    
    let _text, _onPress
    
    if (fulfillable(wish, currentUser)) {
      _text = 'Wunsch erfüllen'
      _onPress = () => {
        Alert.alert(
            'Willst Du diesen Wunsch wirklich erfüllen?',
            '',
            [
              {text: 'Abbrechen', onPress: () => console.log('Abbruch!')},
              {text: 'Ja', onPress: () => dispatch(fulfillWish(wish))},
            ]
          )
      }
    } else if (fulfilledByUser(wish, currentUser)) {
      // fulfilled by me => unFulfillButton
      _text = 'Wunsch unerfüllen'
      _onPress = () => {
        Alert.alert(
            'Willst Du diesen Wunsch wirklich nicht mehr erfüllen?',
            '',
            [
              {text: 'Abbrechen', onPress: () => console.log('Abbruch!')},
              {text: 'Ja', onPress: () => {
                  dispatch(saveWish(wish.set('fulfillerId', null)))
                }
              }
            ]
          )
      }
    } else {
      _text = 'Wunsch erfüllen'
      _onPress = null
    }
    
    return (
      <WMButton 
          onPress={_onPress}
          caption={_text}
        />
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