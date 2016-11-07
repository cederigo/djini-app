import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Image,
  NativeModules, Dimensions, KeyboardAvoidingView, Alert, Platform} from 'react-native';
import { Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {AppBar, ActionButton} from './AppBar'
import WishEditForm from './WishEditForm'

// Actions
import {uploadWishImage} from '../actions/wishes'

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
      imageSource: undefined,
      isValid: false,
      imageURL: props.wish.imageURL
    }
  }
  
  componentWillMount() {
    Actions.refresh({hideTabBar: true, sceneStyle: null})
  }
  
  uploadImage(base64Data) {
    if (this.state.uploading) {
      return;
    }
    const {dispatch} = this.props
    this.setState({ uploading: true, uploadFailure: false })
    dispatch(uploadWishImage(base64Data))
      .then((imageURL) => {
        this.setState({uploading: false, uploadFailure: false, imageURL})
      })
      .catch(() => {
        this.setState({uploading: false, uploadFailure: true})
      })
  }

  showImagePicker() {
    let options = {
      title: 'Bild auswählen',
      cancelButtonTitle: 'Abbrechen',
      takePhotoButtonTitle: 'Eine Aufnahme machen...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Aus Galerie...', // specify null or empty string to remove this button
      customButtons: [
        {title: 'Bild löschen', name: 'remove-image'}, // [Button Text] : [String returned upon selection]
      ],
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      maxWidth: parseInt(3 * IMAGE_WIDTH), // photos only
      maxHeight: parseInt(3 * IMAGE_HEIGHT), // photos only
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

      if (response.data) {
        this.setState({ imageSource: {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true} })
        this.uploadImage(response.data)
      } else {
        //clear image
        this.setState({imageSource: null, imageURL: null})
      }
    })
  }

  renderImage() {
    const {uploading, uploadFailure, imageURL} = this.state
    const imageSource = imageURL ? {uri: imageURL} : this.state.imageSource
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
  
  onValidationChange(isValid) {
    this.setState({isValid})
  }

  render() {
    const {wish, title, isFetching, error, dispatch} = this.props
    const {isValid, imageURL} = this.state
    const disableSave = this.state.uploading || !isValid || isFetching;
    
    if (error) {
      Alert.alert('Djini Fehler', 'Oops, Wunsch konnte nicht gespeichert werden. Stelle sicher, dass du eine Internet Verbindung hast.')
    }
    
    const content = 
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps={true}>
        {this.renderImage()} 
        <WishEditForm dispatch={dispatch} wish={wish} ref={(form) => this._form = form} onValidationChange={(isValid) => this.onValidationChange(isValid)}/>
      </ScrollView>

    return ( 
      <View style={styles.container}>
        <AppBar showBackButton={true} backButtonText="Abbrechen" title={title} textStyle="dark">
          <ActionButton text="Fertig" textStyle="dark" disabled={disableSave} onPress={() => this._form.save(imageURL)}/>
        </AppBar>
        {Platform.OS === 'ios' ?
          <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoid}>
            {content}
          </KeyboardAvoidingView>
          : content
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  keyboardAvoid: {
    flex: 1,
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
