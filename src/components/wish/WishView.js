import { connect } from 'react-redux';

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import FulfillWishButton from './FulfillWishButton'
import {AppBar, ActionButton} from '../AppBar'

import WMColors from '../../lib/WMColors'
import {User, Wish} from '../../lib/types'

// Utils
import {allowEdit, fulfilled, toUser, fulfillable} from '../../lib/wishUtil'

// Actions
import {editWish, deleteWish} from '../../actions/wishes'

class WishView extends Component {

  props: {
    currentUser: User,
    wish: Wish 
  }

  renderImage() {
    //its a placeholder
    //TODO real image
    return (
      <View style={styles.imageWrapper}>
        <Icon style={styles.image} name="photo-camera" size={40}/>
      </View>
    )
  }

  renderFulfillment(wish, currentUser) {
    if(toUser(wish, currentUser)) {
      //its for me, so I'm not interested
      return
    }

    if (fulfillable(wish, currentUser)) {
      return <FulfillWishButton wish={wish}/>
    }
    else if (wish.fulfillerName) {
      return <Text style={styles.text}>Dieser Wunsch wird von {wish.fulfillerName} erfüllt</Text>
    }
    else if (fulfilled(wish)) {
      return <Text style={styles.text}>Dieser Wunsch wird erfüllt</Text>
    }
  }


  render() {
    const {dispatch, currentUser, wish} = this.props

    return ( 
      <View style={styles.container}>
        <AppBar showBackButton={true} title={wish.title}>
          {allowEdit(wish, currentUser) ? <ActionButton iconName="delete" onPress={() => dispatch(deleteWish(wish, 'details'))}/> : undefined }
          {allowEdit(wish, currentUser) ? <ActionButton iconName="edit" onPress={() => dispatch(editWish(wish))}/> : undefined }
        </AppBar>

        {this.renderImage()}

        <View style={styles.details}>
          <Text style={styles.label}>Beschreibung</Text>
          <Text style={styles.text}>{wish.description || '-'}</Text>

          <Text style={styles.label}>Wo gesehen</Text>
          <Text style={styles.text}>{wish.seenAt || '-'}</Text>

          <Text style={styles.label}>URL</Text>
          <Text style={styles.text}>{wish.url || '-'}</Text>

          <View style={styles.fulfillment}>
            {this.renderFulfillment(wish, currentUser)}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WMColors.background,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderColor: WMColors.lightText,
    borderBottomWidth: 1
  },
  image: {
    color: WMColors.lightText
  },
  details: {
    marginHorizontal: 20
  },
  label: {
    marginTop: 20,
    fontWeight: 'bold',
    color: WMColors.darkText
  },
  text: {
    color: WMColors.lightText
  },
  fulfillment: {
    marginTop: 20
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
export default connect(select)(WishView)