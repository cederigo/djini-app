import { connect } from 'react-redux';

import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity, Linking, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import FulfillWishButton from './FulfillWishButton'
import WMButton from '../WMButton'
import {AppBar, ActionButton} from '../AppBar'

import WMColors from '../../lib/WMColors'
import {User, Wish} from '../../lib/types'

// Utils
import {allowEdit, fulfilled, toUser, fulfillable, fulfilledByUser} from '../../lib/wishUtil'

// Actions
import {editWish, copyWish} from '../../actions/wishes'

const WIDTH = Dimensions.get('window').width
const IMAGE_HEIGHT = 200 

class WishView extends Component {

  props: {
    currentUser: User,
    source: string,
    wish: Wish
  }

  constructor(props) {
    super(props)
    this.renderImage = this.renderImage.bind(this)
    this.imageClicked = this.imageClicked.bind(this)
    this.state = {
      imageExpanded: false,
      imageHeight: 0
    }
  }

  componentDidMount() {
    const {wish} = this.props
    if (wish.imageURL) {
      Image.getSize(wish.imageURL, (width, height) => {
        this.setState({
          imageHeight: height * (WIDTH / width)
        })
      })
    }
  }

  renderImage(wish) {
    let imageStyle;
    if (this.state.imageExpanded) {
      imageStyle =  {resizeMode: 'contain', height: this.state.imageHeight}
    } else {
      imageStyle = {resizeMode: 'cover', height: IMAGE_HEIGHT}
    }
    return (
      <TouchableOpacity style={wish.imageURL ? undefined : styles.imagePlaceholder} onPress={this.imageClicked}>
        {wish.imageURL ? 
          <Image source={{uri: wish.imageURL}} style={imageStyle}/>
          : <Icon style={styles.imagePlaceholderIcon} name="photo-camera" size={40}/>
        }
      </TouchableOpacity>
    )
  }

  imageClicked() {
    const {wish, currentUser, dispatch, source} = this.props
    if (wish.imageURL) {
      return this.setState({imageExpanded: !this.state.imageExpanded})
    }
    if (allowEdit(wish, currentUser)) {
      dispatch(editWish(wish, source))
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
    if(toUser(wish, currentUser) || !fulfilled(wish)) {
      return //nothing to render
    }

    let text = 'Dieser Wunsch wird erfüllt'
    if (fulfilledByUser(wish, currentUser)) {
      text = 'Du erfüllst diesen Wunsch'
    }
    else if (wish.fulfillerName) {
      text = wish.fulfillerName + ' erfüllt diesen Wunsch'
    }

    return (
      <View style={styles.fulfillment}>
        <Icon style={[styles.fulfillmentText, styles.fulfillmentIcon]} name="check" size={20}/>
        <Text style={styles.fulfillmentText}>{text}</Text>
      </View>
    )
  }

  renderActionButtons(wish, currentUser) {
    if(toUser(wish, currentUser)) {
      //its a wish for me so I'm not interested
      return
    }
    const {dispatch} = this.props
    return (
      <View style={styles.buttonGroup}>
        <WMButton style={styles.buttonGroupButton} iconName="playlist-add" caption="Will ich auch" onPress={() => dispatch(copyWish(wish, currentUser))}/> 
        {fulfillable(wish, currentUser) ?
          <FulfillWishButton style={styles.buttonGroupButton} wish={wish}/>
          : undefined
        }
      </View>
    )
  }

  renderPrivateAttributes(wish, currentUser) {
    if(!toUser(wish, currentUser)) {
      //NOT for me
      return
    }
    return (
      <View style={styles.privateAttributes}>
        {wish.isFavorite ?
          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="star"/>
            <Text style={[styles.text, styles.attrText]}>Dieser Wunsch ist ein Favorit</Text>
          </View>
          : undefined
        }
        {wish.isPrivate ?
          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="lock"/>
            <Text style={[styles.text, styles.attrText]}>Dieser Wunsch siehst nur du</Text>
          </View>
          : undefined
        }
      </View>
    )
  }


  render() {
    const {dispatch, currentUser, wish, source} = this.props

    return ( 
      <View style={styles.container}>
        <AppBar showBackButton={true} title={wish.title}>
          {allowEdit(wish, currentUser) ? <ActionButton text="Bearbeiten" onPress={() => dispatch(editWish(wish, source))}/> : undefined }
        </AppBar>

        <ScrollView>
          {this.renderFulfillment(wish, currentUser)}

          {this.renderImage(wish)}

          <View style={styles.attr}>
            <Text style={[styles.text, styles.titleText]}>{wish.title || '-'}</Text>
          </View>

          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="description"/>
            <Text style={[styles.text, styles.attrText]}>{wish.description || '-'}</Text>
          </View>

          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="remove-red-eye"/>
            <Text style={[styles.text, styles.attrText]}>{wish.seenAt || '-'}</Text>
          </View>

          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="link"/>
            <TouchableOpacity onPress={() => this.openURL(wish.url)}>
              <Text style={[styles.text, styles.attrText]} numberOfLines={1}>{wish.url || '-'}</Text>
            </TouchableOpacity>
          </View>

          {this.renderPrivateAttributes(wish, currentUser)}

          {this.renderActionButtons(wish, currentUser)}
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
    height: IMAGE_HEIGHT,
    borderColor: WMColors.lightText,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagePlaceholderIcon: {
    color: WMColors.lightText,
  },
  text: {
    color: WMColors.lightText,
    fontSize: 17 
  },
  titleText: {
    paddingHorizontal: 18,
    fontSize: 22,
  },
  attr: {
    marginTop: 18
  },
  attrIcon: {
    position: 'absolute',
    left: 18,
    top: 3,
    fontSize: 20
  },
  attrText: {
    marginLeft: 50
  },
  privateAttributes: {
    marginTop: 18
  },
  fulfillment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: WMColors.lightText 
  },
  fulfillmentText: {
    color: 'white',
    fontSize: 17
  },
  fulfillmentIcon: {
    fontSize: 30,
    marginRight: 10
  },
  buttonGroup: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonGroupButton: {
    flex: 1,
    borderColor: 'white',
    borderRightWidth: 1
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    currentUser: state.global.currentUser,
  };
}
export default connect(select)(WishView)