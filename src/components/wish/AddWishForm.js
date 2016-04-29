import Immutable from 'immutable';
import React, {
  Component,
  PropTypes,
  View,
  Switch,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import {Actions} from 'react-native-router-flux'

export default class AddWishForm extends Component {

  render() {
    const {currentUser, wishState, onWishFieldChange, saveWish, editWish, setPrivate, styles} = this.props
    const {wish} = wishState
    const editable = wishState.isEditable && !wishState.isFetching
    const allowEdit = wish.ownerId === currentUser.id && !wishState.isFetching
    let SaveButton, BackButton, EditButton
    console.log('wish', wish)
    if (editable) {
      SaveButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { saveWish(wish)}}>
            <Text style={styles.buttonText}>Wunsch speichern</Text>
        </TouchableOpacity>
    } 
    if (allowEdit && !editable) {
      EditButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { editWish()}}>
            <Text style={styles.buttonText}>Wunsch bearbeiten</Text>
        </TouchableOpacity>
    }
    if (!wishState.isFetching) {
      BackButton = <TouchableOpacity
            style={styles.button}
            onPress={Actions.pop}>
            <Text style={styles.buttonText}>Zurück</Text>
        </TouchableOpacity>
    }
    if (wishState.isFetching) {
      SaveButton = <Text>Wunsch wird gespeichert.</Text>
    }
   
    return ( 
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          editable={editable}
          placeholder="Titel"
          onChangeText={(text) => {onWishFieldChange('title', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.title}
        />
        <TextInput
          style={styles.input}
          editable={editable}
          placeholder="Beschreibung"
          onChangeText={(text) => { onWishFieldChange('description', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.description}
        />
        <TextInput
          style={styles.input}
          editable={editable}
          placeholder="URL"
          keyboardType="url"   
          onChangeText={(text) => { onWishFieldChange('url', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.url}
        />
        <Text>{wish.private ? 'Privat' : 'Öffentlich'}</Text>
        <Switch
          disabled={!editable}
          onValueChange={(value) => setPrivate(value)}
          value={wish.private} />
        {SaveButton}
        {EditButton}
        {BackButton}
      </View>
    )
  }
}

AddWishForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
  styles: PropTypes.object.isRequired,
  onWishFieldChange: PropTypes.func.isRequired,
  setPrivate: PropTypes.func.isRequired,
  saveWish: PropTypes.func.isRequired,
  editWish: PropTypes.func.isRequired
}