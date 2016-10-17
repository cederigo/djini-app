/* @flow */

import { connect } from 'react-redux';

import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Linking, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Actions} from 'react-native-router-flux'

import DjiniButton from './DjiniButton'
import DjiniBackground from './DjiniBackground'
import {AppBar, ActionButton} from './AppBar'
import {DjiniDarkText as DjiniText} from './DjiniText'

import type {User, Wish, Contact} from '../lib/types'

// Utils
import {allowEdit, fulfilled, toUser, fulfillable, fulfilledByUser, isIdea} from '../lib/wishUtil'

// Actions
import {editWish, copyWish, toggleFulfilled} from '../actions/wishes'

const WIDTH = Dimensions.get('window').width
const IMAGE_HEIGHT = 250 

class WishView extends Component {

  props: {
    dispatch: () => void,
    currentUser: User,
    source: string,
    wish: Wish,
    contact: Contact
  }

  state: {
    imageExpanded: bool,
    imageHeight: number
  }

  renderImage: (wish: Wish) => void
  imageClicked: () => void

  constructor(props) {
    super(props)
    this.renderImage = this.renderImage.bind(this)
    this.imageClicked = this.imageClicked.bind(this)
    this.state = {
      imageExpanded: false,
      imageHeight: IMAGE_HEIGHT
    }
  }
  
  componentWillMount() {
    Actions.refresh({hideTabBar: false})
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
      <TouchableOpacity style={wish.imageURL ? {} : styles.cloudsContainer} onPress={this.imageClicked}>
        {wish.imageURL ? 
          <Image source={{uri: wish.imageURL}} style={imageStyle}/>
          : <DjiniBackground offsetBottom={-100}/>
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
        <DjiniText style={styles.fulfillmentText}>{text}</DjiniText>
      </View>
    )
  }

  renderActionButtons(wish, currentUser) {
    if(toUser(wish, currentUser)) {
      //its a wish for me so I'm not interested
      return
    }
    const {dispatch, contact} = this.props
    return (
      <View style={styles.buttonGroup}>
        <DjiniButton style={styles.buttonGroupButton} iconName="playlist-add" caption="Will ich auch!" onPress={() => dispatch(copyWish(wish, currentUser))}/> 
        {fulfillable(wish, currentUser) ?
          <DjiniButton 
            style={styles.buttonGroupButton}
            iconName="check" caption={fulfilled(wish) ? "Doch nicht?" : "Erfüllen"}
            onPress={() => dispatch(toggleFulfilled(wish, contact))}/>
          : undefined
        }
      </View>
    )
  }

  render() {
    const {dispatch, currentUser, wish, source} = this.props
    const title = isIdea(wish) ? 'Idee' : 'Wunsch'

    return ( 
      <View style={styles.container}>
        <AppBar showBackButton={true} title={title} textStyle="dark">
          {allowEdit(wish, currentUser) ? <ActionButton text="Bearbeiten" textStyle="dark" onPress={() => dispatch(editWish(wish, source))}/> : undefined }
        </AppBar>

        <ScrollView style={styles.scroll}>
          <View style={styles.content}>
            {this.renderImage(wish)}
            {this.renderFulfillment(wish, currentUser)}

            <View style={styles.attr}>
              <DjiniText style={[styles.attrText, styles.titleText]}>{wish.title || '-'}</DjiniText>
            </View>

            <View style={styles.attr}>
              <Icon style={styles.attrIcon} name="list"/>
              <DjiniText collapsible={true} numberOfLines={3} style={styles.attrText}>{wish.description || '-'}</DjiniText>
            </View>

            <View style={styles.attr}>
              <Icon style={[styles.attrIcon,{top: 2}]} name="attach-money"/>
              <DjiniText style={styles.attrText}>{wish.price + '.-' || '-'}</DjiniText>
            </View>

            <View style={styles.attr}>
              <Icon style={styles.attrIcon} name="remove-red-eye"/>
              <DjiniText style={styles.attrText}>{wish.seenAt || '-'}</DjiniText>
            </View>

            <View style={styles.attr}>
              <Icon style={[styles.attrIcon, styles.action]} name="link"/>
              <TouchableOpacity onPress={() => this.openURL(wish.url)}>
                <DjiniText style={[styles.attrText, styles.action]} numberOfLines={1}>{wish.url || '-'}</DjiniText>
              </TouchableOpacity>
            </View>

            <View style={styles.privateAttributes}>
              {wish.isFavorite ? <Icon style={styles.favoriteIcon} name="star"/> : undefined }
              {wish.isPrivate ? <Icon style={styles.privateIcon} name="lock"/> : undefined }
            </View>

            {this.renderActionButtons(wish, currentUser)}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)'
  },
  scroll: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginBottom: 50
  },
  cloudsContainer: {
    backgroundColor: 'rgb(61, 63, 148)',
    height: 150,
    overflow: 'hidden'
  },
  clouds: {
    position: 'absolute',
    bottom: -50,
    left: -110,
    width: 500,
    height: 500/1.629
  },
  titleText: {
    marginHorizontal: 18,
    fontSize: 27,
    fontStyle: 'italic'
  },
  attr: {
    marginTop: 18
  },
  attrIcon: {
    backgroundColor: 'transparent',
    color: 'rgb(61, 63, 148)',
    position: 'absolute',
    left: 18,
    top: 3,
    fontSize: 20
  },
  favoriteIcon: {
    color: 'rgb(244, 230, 56)',
    fontSize: 30,
    margin: 5
  },
  privateIcon: {
    color: 'white',
    fontSize: 30,
    margin: 5,
  },
  action: {
    color: 'rgb(101,104,244)',
    textDecorationLine: 'underline'
  },
  attrText: {
    marginLeft: 60,
    marginRight: 15
  },
  privateAttributes: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'column',
    padding: 5
  },
  fulfillment: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 45,
    backgroundColor: 'rgba(101,104,244,0.7)',
  },
  fulfillmentText: {
    color: 'white'
  },
  fulfillmentIcon: {
    fontSize: 30,
    margin: 10
  },
  buttonGroup: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 20,
  },
  buttonGroupButton: {
    marginTop: 10,
    backgroundColor: 'rgb(101,104,244)'
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
