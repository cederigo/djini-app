import { connect } from 'react-redux';

// Components
import React, {
  Component,
  StyleSheet,
  PropTypes,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import FullfillWishButton from './FullfillWishButton'
import WMButton from '../WMButton'

// Utils
import {allowEdit, allowDelete, fullfillable, fullfilledByUser, fullfilled, toUser, fromUser, type} from '../../lib/wishUtil'

// Actions
import {Actions} from 'react-native-router-flux'
import {editWish, deleteWish, fullfillWish, unfullfillWish} from '../../actions/wishes'

export default class ShowWishForm extends Component {
  render() {
    const {dispatch, currentUser, wishState} = this.props
    const {wish, isFetching} = wishState

    let EditButton, DeleteButton, FullfillButton, FullfillmentStatus, SaveStatus, PrivacyStatus
    
    // Save, edit & delete
    if (!isFetching) {
      if (allowEdit(wish, currentUser)) {
        EditButton = <WMButton 
          onPress={() => dispatch(editWish(wish))}
          caption={type(wish) + " bearbeiten"}
        />
      }
      if (allowDelete(wish, currentUser)) {
        DeleteButton = <WMButton 
          onPress={() => { 
            dispatch(deleteWish(wish))
            Actions.pop()}}
          caption={type(wish) + " löschen"}
        />
      }
      //PrivacyStatus
      if (toUser(wish, currentUser) && fromUser(wish, currentUser)) {
        PrivacyStatus = <Text style={styles.status}>{wish.isPrivate ? 'Dieser Wunsch ist privat' : 'Dieser Wunsch ist öffentlich'}</Text>
      }
      //FullfillButton
      if (fullfillable(wish, currentUser) || fullfilledByUser(wish, currentUser)) {
        FullfillButton = <FullfillWishButton wish={wish}/>
      }
      //FullfillmentStatus
      if (!toUser(wish, currentUser)) {
        if (fullfilledByUser(wish, currentUser)) {
        FullfillmentStatus = <Text style={styles.status}>Dieser Wunsch wird von mir erfüllt</Text>
      } else if (fullfilled(wish)) {
        FullfillmentStatus = <Text style={styles.status}>Dieser Wunsch wird erfüllt</Text>
      } 
      }
      
    }
        
    if (isFetching) {
      SaveStatus = <Text style={styles.status}>{type(wish) + " wird gespeichert."}</Text>
    }
   
    return ( 
      <View style={styles.container}>
        <Text style={styles.title}>{wish.title}</Text>
        <Text style={styles.text}>{wish.description}</Text>
        <Text style={styles.text}>{wish.url}</Text>
        <Text style={styles.text}>{wish.seenAt}</Text>
        {PrivacyStatus}
        {EditButton}
        {DeleteButton}
        {FullfillmentStatus}
        {FullfillButton}
        {SaveStatus}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  text: {
    paddingTop: 30
  },
  status: {
    letterSpacing: 1,
    fontSize: 12,
    padding: 15,
    alignSelf: 'center'
  }
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