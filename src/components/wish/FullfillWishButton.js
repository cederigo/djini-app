import { connect } from 'react-redux';
import {Wish, User} from '../../lib/types'

// Components
import React, { 
  StyleSheet,
  Component,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native';

// Actions
import {fullfillWish, saveWish} from '../../actions/wishes'

// Utils
import {fullfillable, fullfilledByUser} from '../../lib/wishUtil'

class FullfillWishButton extends Component {

  props: {
    currentUser: User,
    wish: Wish
  }

  render() {
    const {dispatch, currentUser, wish} = this.props
    
    let _text, _onPress
    
    if (fullfillable(wish, currentUser)) {
      _text = 'Wunsch erfüllen'
      _onPress = () => {
        Alert.alert(
            'Willst Du diesen Wunsch wirklich erfüllen?',
            '',
            [
              {text: 'Abbrechen', onPress: () => console.log('Abbruch!')},
              {text: 'Ja', onPress: () => dispatch(fullfillWish(wish))},
            ]
          )
      }
    } else if (fullfilledByUser(wish, currentUser)) {
      // fullfilled by me => unFullfillButton
      _text = 'Wunsch unerfüllen'
      _onPress = () => {
        Alert.alert(
            'Willst Du diesen Wunsch wirklich nicht mehr erfüllen?',
            '',
            [
              {text: 'Abbrechen', onPress: () => console.log('Abbruch!')},
              {text: 'Ja', onPress: () => {
                  dispatch(saveWish(wish.set('fullfillerId', null)))
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
      <TouchableOpacity
          style={styles.button}
          onPress={_onPress}>
          <Text style={styles.buttonText}>{_text}</Text>
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    currentUser: state.global.currentUser
  };
}
export default connect(select)(FullfillWishButton)