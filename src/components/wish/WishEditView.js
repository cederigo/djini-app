import { connect } from 'react-redux';

import React, {Component} from 'react';
import {View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image, NativeModules, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import {AppBar, ActionButton} from '../AppBar'
import WMButton from '../WMButton'

// Actions
import {saveWish, onWishFieldChange, uploadWishImage, deleteWish} from '../../actions/wishes'

// Utils
import {isIdea} from '../../lib/wishUtil'
import WMColors from '../../lib/WMColors'
import {Wish} from '../../lib/types'

const IMAGE_WIDTH = Dimensions.get('window').width
const IMAGE_HEIGHT = 200

class WishEditView extends Component {

  constructor(props) {
    super(props)
    this.renderImage = this.renderImage.bind(this)
    this.showImagePicker = this.showImagePicker.bind(this)
    this.state = {
      uploading: false,
      uploadFailure: false,
      imageSource: undefined
    }
  }

  props: {
    wish: Wish
  }

  uploadImage(base64Data) {
    if (this.state.uploading) {
      return;
    }
    const {dispatch} = this.props
    this.setState({ uploading: true, uploadFailure: false })
    dispatch(uploadWishImage(base64Data))
      .then(() => {
        this.setState({uploading: false, uploadFailure: false})
      })
      .catch(() => {
        this.setState({uploading: false, uploadFailure: true})
      })
  }

  showImagePicker() {
    const {dispatch} = this.props
    let options = {
      title: 'Bild auswählen',
      cancelButtonTitle: 'Abbrechen',
      takePhotoButtonTitle: 'Eine Aufnahme machen...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Aus Gallerie...', // specify null or empty string to remove this button
      customButtons: {
        'Bild löschen': 'remove-image', // [Button Text] : [String returned upon selection]
      },
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      maxWidth: 3 * IMAGE_WIDTH, // photos only
      maxHeight: 3 * IMAGE_HEIGHT, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    };

    NativeModules.ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel || response.error) {
        return;
      }

      //clear image
      dispatch(onWishFieldChange('imageURL', null)) 
      this.setState({
        imageSource: {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true}
      })

      if (response.data) {
        this.uploadImage(response.data)
      }
    })
  }

  renderImage() {
    const {uploading, uploadFailure} = this.state
    const {wish} = this.props
    const imageSource = wish.imageURL ? {uri: wish.imageURL} : this.state.imageSource
    let image
    if (imageSource) {
      image = <Image style={[styles.image, uploading ? styles.imageUploading : undefined]} source={imageSource}/>
    }
    return (
      <TouchableOpacity style={styles.imageWrapper} onPress={() => this.showImagePicker()}>
        {image}
        {uploadFailure ? 
          <Icon style={styles.icon} name="error" size={40}/> :
          <Icon style={styles.icon} name="add-a-photo" size={40}/>
        }
      </TouchableOpacity>
    )
  }

  render() {
    const {dispatch, wish} = this.props
      const title = isIdea(wish) ? 'Idee erfassen' : 'Wunsch erfassen'

      return ( 
        <View style={styles.container}>
          <AppBar showBackButton={true} title={title}>
            <ActionButton text="Fertig" disabled={this.state.uploading || !wish.title} onPress={() => dispatch(saveWish(wish))}/>
          </AppBar>

          <ScrollView>

            {this.renderImage()}

            <View style={styles.content}>

              <Text style={styles.label}>Titel</Text>
              <TextInput
                style={styles.input}
                editable={true}
                onChangeText={(text) => dispatch(onWishFieldChange('title', text))}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                autoCorrect={false}
                value={wish.title}
              />

              <Text style={styles.label}>Beschreibung</Text>
              <TextInput
                style={styles.input}
                editable={true}
                onChangeText={(text) => dispatch(onWishFieldChange('description', text))}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                autoCorrect={false}
                value={wish.description}
              />

              <Text style={styles.label}>Wo gesehen</Text>
              <TextInput
                style={styles.input}
                editable={true}
                onChangeText={(text) => dispatch(onWishFieldChange('seenAt', text))}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                autoCorrect={false}
                value={wish.seenAt}
              />

              <Text style={styles.label}>URL</Text>
              <TextInput
                style={styles.input}
                editable={true}
                keyboardType="url"   
                onChangeText={(text) => dispatch(onWishFieldChange('url', text))}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                autoCorrect={false}
                value={wish.url}
              />

              {isIdea(wish) ? 
                undefined :
                <View style={styles.toggles}>
                  <View style={styles.toggle}>
                    <WMButton
                      toggle={true}
                      active={wish.isFavorite}
                      iconName={wish.isFavorite ? 'star' : 'star-border'}
                      onPress={() => dispatch(onWishFieldChange('isFavorite', !wish.isFavorite))}/>
                    <Text style={styles.toggleText}>Djini, das will ich unbedingt haben!</Text>
                  </View>
                  <View style={styles.toggle}>
                    <WMButton 
                      toggle={true}
                      active={wish.isPrivate}
                      iconName={wish.isPrivate ? 'lock' : 'lock-open'}
                      onPress={() => dispatch(onWishFieldChange('isPrivate', !wish.isPrivate)) }/>
                    <Text style={styles.toggleText}>Uhh, das sollte besser niemand sehen</Text>
                  </View>
                </View>
              }

              <View style={styles.actions}>
                <WMButton style={styles.button}
                iconName="delete"
                caption="Löschen"
                onPress={() => dispatch(deleteWish(wish, 'details'))}
              />
              </View>
            </View>
          </ScrollView>
       </View>
     )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WMColors.background
  },
  content: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    color: WMColors.darkText
  },
  input: {
    fontSize: 16,
    height: 40,
    color: WMColors.lightText,
    backgroundColor: WMColors.white,
    paddingLeft: 10
  },
  toggles: {
    marginTop: 10
  },
  toggle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggleText: {
    marginLeft: 10,
    color: WMColors.lightText
  },
  privacy: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center'
  },
  privacyText: {
    marginLeft: 10,
  },
  actions: {
    marginTop: 20
  },
  imageWrapper: {
    height: IMAGE_HEIGHT,
    borderColor: WMColors.lightText,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    color: WMColors.darkText,
    backgroundColor: 'transparent'
  },
  image: {
    resizeMode: 'cover',
    position: 'absolute',
    left: 0, top: 0,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imageUploading: {
    opacity: 0.5
  }
})

export default connect()(WishEditView)