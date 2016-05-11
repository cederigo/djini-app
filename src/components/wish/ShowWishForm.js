import { connect } from 'react-redux';

// Components
import React, {
  Component,
  PropTypes,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import FullfillWishButton from './FullfillWishButton'

// Utils
import {allowEdit, allowDelete, fullfillable, fullfilledByUser, fullfilled} from '../../lib/wishUtil'

// Actions
import {Actions} from 'react-native-router-flux'
import {editWish, deleteWish, fullfillWish, unfullfillWish} from '../../actions/wishes'

export default class ShowWishForm extends Component {
  render() {
    const {dispatch, currentUser, wishState, styles} = this.props
    const {wish, isFetching} = wishState

    let EditButton, DeleteButton, FullfillButton, FullfillmentStatus, SaveStatus
    
    // Save, edit & delete
    if (!isFetching) {
      if (allowEdit(wish, currentUser)) {
        EditButton = <TouchableOpacity
          style={styles.button}
          onPress={() => dispatch(editWish(wish))}>
          <Text style={styles.buttonText}>Wunsch bearbeiten</Text>
        </TouchableOpacity>
      }
      if (allowDelete(wish, currentUser)) {
        DeleteButton = <TouchableOpacity
         style={styles.button}
          onPress={() => { 
            dispatch(deleteWish(wish))
            Actions.pop()}}>
          <Text style={styles.buttonText}>Wunsch löschen</Text>
        </TouchableOpacity>
      }
      //FullfillButton
      //if (fullfillable(wish, currentUser) || fullfilledByUser(wish, currentUser)) {
      if (fullfillable(wish, currentUser) || fullfilledByUser(wish, currentUser)) {
        FullfillButton = <FullfillWishButton wish={wish}/>
      }
      //FullfillmentStatus
      if (fullfilledByUser(wish, currentUser)) {
        FullfillmentStatus = <Text style={styles.buttonText}>Dieser Wunsch wird von mir erfüllt</Text>
      } else if (fullfilled(wish)) {
        FullfillmentStatus = <Text style={styles.buttonText}>Dieser Wunsch wird erfüllt</Text>
      } 
    }
        
    if (isFetching) {
      SaveStatus = <Text>Wunsch wird gespeichert.</Text>
    }
   
    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>{wish.title}</Text>
        <Text style={styles.text}>{wish.description}</Text>
        <Text style={styles.text}>{wish.url}</Text>
        <Text style={styles.text}>{wish.seenAt}</Text>
        <Text>{wish.isPrivate ? 'Der Wunsch ist privat' : 'Der Wunsch ist öffentlich'}</Text>
        {EditButton}
        {DeleteButton}
        {FullfillmentStatus}
        {FullfillButton}
        {SaveStatus}
      </View>
    )
  }
}

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

ShowWishForm.propTypes = {
  styles: PropTypes.object.isRequired,
}