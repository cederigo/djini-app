import { connect } from 'react-redux';

import React, {Component, PropTypes} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Image,
  NativeModules, Dimensions, KeyboardAvoidingView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import {AppBar, ActionButton} from './AppBar'
import DjiniButton from './DjiniButton'
import {DjiniDarkText as DjiniText} from './DjiniText'
import DjiniTextInput from './DjiniTextInput'

// Actions
import {saveWish, onWishFieldChange, uploadWishImage, deleteWish} from '../actions/wishes'

// Utils
import {isIdea} from '../lib/wishUtil'

const IMAGE_WIDTH = Dimensions.get('window').width
const IMAGE_HEIGHT = 200

class WishEditView extends Component {

  static propTypes = {
    wish: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

  static defaultProps = {
    title: 'Bearbeiten'
  }

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
      customButtons: [
        {title: 'Bild löschen', name: 'remove-image'}, // [Button Text] : [String returned upon selection]
      ],
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      maxWidth: 3 * IMAGE_WIDTH, // photos only
      maxHeight: 3 * IMAGE_HEIGHT, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.6, // 0 to 1, photos only
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
    const {dispatch, wish, title, isFetching, error} = this.props
    const isWish = !isIdea(wish)
    const disableSave = this.state.uploading || !wish.title || isFetching;
    
    if (error) {
      Alert.alert('Djini Fehler', 'Oops, Wunsch konnte nicht gespeichert werden. Stelle sicher, dass du eine Internet Verbindung hast.')
    }
    return ( 
      <View style={styles.container}>
        <AppBar showBackButton={true} backButtonText="Abbrechen" title={title} textStyle="dark">
          <ActionButton text="Fertig" textStyle="dark" disabled={disableSave} onPress={() => dispatch(saveWish(wish))}/>
        </AppBar>

        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoid}>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps={true}>

          {this.renderImage()}

          <View style={styles.content}>

            <DjiniText style={styles.label}>Titel</DjiniText>
            <DjiniTextInput
              blurOnSubmit={false}
              onSubmitEditing={() => this.refs.details.focus()}
              placeholder="Gib einen aussagekräftigen Titel an…"
              onChangeText={(text) => dispatch(onWishFieldChange('title', text))}
              value={wish.title}
            />

            <DjiniText style={styles.label}>Details</DjiniText>
            <DjiniTextInput
              ref="details"
              onSubmitEditing={() => this.refs.price.focus()}
              blurOnSubmit={false}
              placeholder="z.B. Grösse, Farbe, Modell, …"
              autoGrow={true}
              onChangeText={(text) => dispatch(onWishFieldChange('description', text))}
              value={wish.description}
            />

            <DjiniText style={styles.label}>Preis</DjiniText>
            <DjiniTextInput
              ref="price"
              onSubmitEditing={() => this.refs.seenAt.focus()}
              blurOnSubmit={false}
              placeholder="Ungefährer Preis"
              keyboardType="numeric"   
              onChangeText={(text) => dispatch(onWishFieldChange('price', text))}
              value={wish.price}
            />

            <DjiniText style={styles.label}>Wo gesehen</DjiniText>
            <DjiniTextInput
              ref="seenAt"
              onSubmitEditing={() => this.refs.url.focus()}
              blurOnSubmit={false}
              placeholder="Wo kann dein Wunsch gefunden werden…"
              onChangeText={(text) => dispatch(onWishFieldChange('seenAt', text))}
              value={wish.seenAt}
            />

            <DjiniText style={styles.label}>Web-Link</DjiniText>
            <DjiniTextInput
              ref="url"
              placeholder="http://…"
              keyboardType="url"   
              onChangeText={(text) => dispatch(onWishFieldChange('url', text))}
              value={wish.url}
            />

            <View style={styles.toggles}>
              {isWish ?
              <View style={styles.toggle}>
                <DjiniButton
                  type="primary"
                  style={styles.toggleButton}
                  iconStyle={wish.isFavorite ? styles.starIcon : {}}
                  active={wish.isFavorite}

                  iconName={wish.isFavorite ? 'star' : 'star-border'}
                  onPress={() => dispatch(onWishFieldChange('isFavorite', !wish.isFavorite))}/>
                <DjiniText style={styles.toggleText}>Djini, das will ich unbedingt haben!</DjiniText>
              </View>
              : undefined
              }
              {isWish ?
              <View style={styles.toggle}>
                <DjiniButton 
                  type="primary"
                  style={styles.toggleButton}
                  active={wish.isPrivate}
                  iconName={wish.isPrivate ? 'lock' : 'lock-open'}
                  onPress={() => dispatch(onWishFieldChange('isPrivate', !wish.isPrivate)) }/>
                <DjiniText style={styles.toggleText}>Uhh, das sollte besser niemand sehen</DjiniText>
              </View>
              : undefined
              }
              <View style={styles.toggle}>
                <DjiniButton 
                  type="danger"
                  style={styles.toggleButton}
                  iconName="delete"
                  onPress={() => dispatch(deleteWish(wish, 'details'))}
                />
                <DjiniText style={styles.toggleText}>Eintrag löschen</DjiniText>
              </View>
            </View>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)'
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    margin: 20
  },
  label: {
    marginTop: 30,
    fontSize: 14,
  },
  toggles: {
    marginVertical: 20
  },
  toggle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggleButton: {
    padding: 10
  },
  starIcon: {
    color: 'rgb(244, 230, 56)',
  },
  toggleText: {
    marginLeft: 10,
    fontSize: 14
  },
  imageWrapper: {
    height: IMAGE_HEIGHT,
    backgroundColor: 'rgb(218,219,241)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'rgb(61,63,148)'
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
