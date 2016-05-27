import { connect } from 'react-redux';

import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity, Linking, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import FulfillWishButton from './FulfillWishButton'
import WMButton from '../WMButton'
import {AppBar, ActionButton} from '../AppBar'

import WMColors from '../../lib/WMColors'
import {User, Wish} from '../../lib/types'

// Utils
import {allowEdit, fulfilled, toUser, fulfillable} from '../../lib/wishUtil'

// Actions
import {editWish, deleteWish, copyWish} from '../../actions/wishes'

const IMAGE_HEIGHT = 200

class WishView extends Component {

  props: {
    currentUser: User,
    wish: Wish 
  }

  renderImage(wish) {
    if (wish.imageURL) {
      return <Image source={{uri: wish.imageURL}} style={styles.image}/>
    } else {
      return (
        <View style={styles.imagePlaceholder}>
          <Icon style={styles.imagePlaceholderIcon} name="photo-camera" size={40}/>
        </View>
      )
    }
  }

  openURL(url) {
    if (!url) {
      return
    }

    if (!/http:|https:/i.test(url)) {
      //try to prepend http://
      Linking.openURL('http://' + url)
    } else {
      Linking.openURL(url)
    }
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
          {allowEdit(wish, currentUser) ? <ActionButton iconName="edit" onPress={() => dispatch(editWish(wish))}/> : undefined }
        </AppBar>

        <ScrollView>

          {this.renderImage(wish)}

          <View style={styles.details}>
            <Text style={styles.label}>Titel</Text>
            <Text style={styles.text}>{wish.title || '-'}</Text>

            <Text style={styles.label}>Beschreibung</Text>
            <Text style={styles.text}>{wish.description || '-'}</Text>

            <Text style={styles.label}>Wo gesehen</Text>
            <Text style={styles.text}>{wish.seenAt || '-'}</Text>

            <Text style={styles.label}>URL</Text>
            <TouchableOpacity onPress={() => this.openURL(wish.url)}>
              <Text style={styles.text} numberOfLines={1}>{wish.url || '-'}</Text>
            </TouchableOpacity>

            <View style={styles.fulfillment}>
              {this.renderFulfillment(wish, currentUser)}
            </View>

            {allowEdit(wish, currentUser) ? 
              <WMButton style={styles.button}
                iconName="delete"
                caption="Löschen"
                onPress={() => dispatch(deleteWish(wish, 'details'))}
              />
              : undefined
            }

            {toUser(wish, currentUser) ? 
              undefined
              : <WMButton style={styles.button}
                  iconName="content-copy"
                  caption="Kopieren"
                  onPress={() => dispatch(copyWish(wish, currentUser))}/> 
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WMColors.background,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: IMAGE_HEIGHT,
    borderColor: WMColors.lightText,
    borderBottomWidth: 1
  },
  imagePlaceholderIcon: {
    color: WMColors.lightText
  },
  image: {
    height: IMAGE_HEIGHT,
    resizeMode: 'cover'
  },
  details: {
    marginHorizontal: 20,
    marginBottom: 20
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
  },
  button: {
    marginTop: 10
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