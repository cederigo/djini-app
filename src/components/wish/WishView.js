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
import {allowEdit, fulfilled, toUser, fulfillable, isIdea} from '../../lib/wishUtil'

// Actions
import {editWish, copyWish} from '../../actions/wishes'

const WIDTH = Dimensions.get('window').width
const IMAGE_HEIGHT = 200 
const ICON_SIZE = 40

class WishView extends Component {

  props: {
    currentUser: User,
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
    const {wish, currentUser, dispatch} = this.props
    if (wish.imageURL) {
      return this.setState({imageExpanded: !this.state.imageExpanded})
    }
    if (allowEdit(wish, currentUser)) {
      dispatch(editWish(wish))
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
      //its a wish for me so I'm not interested
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

  renderPrivateAttributes(wish, currentUser) {
    if(!toUser(wish, currentUser)) {
      //NOT for me
      return
    }
    return (
      <View style={styles.privateAttributes}>
        {wish.isFavorite ?
          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="star" size={ICON_SIZE}/>
            <Text style={[styles.text, styles.attrText]}>Dieser Wunsch ist ein Favorit</Text>
          </View>
          : undefined
        }
        {wish.isPrivate ?
          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="lock" size={ICON_SIZE}/>
            <Text style={[styles.text, styles.attrText]}>Dieser Wunsch siehst nur du</Text>
          </View>
          : undefined
        }
      </View>
    )
  }


  render() {
    const {dispatch, currentUser, wish} = this.props

    return ( 
      <View style={styles.container}>
        <AppBar showBackButton={true} title={wish.title}>
          {allowEdit(wish, currentUser) ? <ActionButton text="Bearbeiten" onPress={() => dispatch(editWish(wish))}/> : undefined }
        </AppBar>

        <ScrollView>

          {this.renderImage(wish)}

          <View style={styles.attr}>
            <Text style={[styles.text, styles.titleText]}>{wish.title || '-'}</Text>
          </View>

          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="description" size={50}/>
            <Text style={[styles.text, styles.attrText]}>{wish.description || '-'}</Text>
          </View>

          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="remove-red-eye" size={ICON_SIZE}/>
            <Text style={[styles.text, styles.attrText]}>{wish.seenAt || '-'}</Text>
          </View>

          <View style={styles.attr}>
            <Icon style={[styles.text, styles.attrIcon]} name="link" size={ICON_SIZE}/>
            <TouchableOpacity onPress={() => this.openURL(wish.url)}>
              <Text style={[styles.text, styles.attrText]} numberOfLines={1}>{wish.url || '-'}</Text>
            </TouchableOpacity>
          </View>

          {this.renderPrivateAttributes(wish, currentUser)}

          <View style={styles.fulfillment}>
            {this.renderFulfillment(wish, currentUser)}
          </View>

          {toUser(wish, currentUser) ? 
            undefined
            : <WMButton style={styles.button}
                iconName="content-copy"
                caption="Kopieren"
                onPress={() => dispatch(copyWish(wish, currentUser))}/> 
          }
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
    top: 3
  },
  attrText: {
    marginLeft: 50
  },
  privateAttributes: {
    marginTop: 18
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