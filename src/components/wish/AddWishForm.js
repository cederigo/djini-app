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
    const {currentUser, wishState, onWishFieldChange, saveWish, deleteWish, fullfillWish, unfullfillWish, setEditable, styles} = this.props
    const {wish} = wishState
    const editable = wishState.isEditable && !wishState.isFetching
    const allowEdit = wish.ownerId === currentUser.id && !wishState.isFetching
    const fullfillable = !wish.fullfillerId && wish.userId !== currentUser.id && wish.ownerId !== currentUser.id && !wishState.isFetching
    let SaveButton, BackButton, EditButton, DeleteButton, FullfillButton, FullfillmentStatus
    
    // Save, edit & delete
    if (editable) {
      SaveButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { saveWish(wish)}}
            disabled={!wish.title}>
            <Text style={styles.buttonText}>Wunsch speichern</Text>
        </TouchableOpacity>
    } 
    if (allowEdit && !editable) {
      EditButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { setEditable()}}>
            <Text style={styles.buttonText}>Wunsch bearbeiten</Text>
        </TouchableOpacity>
      DeleteButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { deleteWish(wish)}}>
            <Text style={styles.buttonText}>Wunsch löschen</Text>
        </TouchableOpacity>
    }
    
    // Fullfillment
    if (fullfillable) {
      FullfillButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { fullfillWish(wish)}}>
            <Text style={styles.buttonText}>Wunsch erfüllen</Text>
        </TouchableOpacity>
    } else if (wish.fullfillerId === currentUser.id && !wishState.isFetching) {
      // fullfilled by me => unFullfillButton
      FullfillButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { unfullfillWish(wish)}}>
            <Text style={styles.buttonText}>Wunsch unerfüllen ^^</Text>
        </TouchableOpacity>
      FullfillmentStatus = <Text style={styles.buttonText}>Dieser Wunsch wird von mir erfüllt</Text>
    } else if (wish.fullfillerId && wish.userId !== currentUser.id) {
      // fullfilled by other (and not my wish!)
      FullfillmentStatus = <Text style={styles.buttonText}>Dieser Wunsch wird erfüllt</Text>
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
        <TextInput
          style={styles.input}
          editable={editable}
          placeholder="Gesehen bei"
          onChangeText={(text) => { onWishFieldChange('seenAt', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.seenAt}
        />
        <Text>{wish.private ? 'Der Wunsch ist privat' : 'Der Wunsch ist öffentlich'}</Text>
        <Switch
          disabled={!editable}
          onValueChange={(value) => onWishFieldChange('private', value)}
          value={wish.private} />
        {SaveButton}
        {EditButton}
        {DeleteButton}
        {FullfillmentStatus}
        {FullfillButton}
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
  saveWish: PropTypes.func.isRequired,
  deleteWish: PropTypes.func.isRequired,
  fullfillWish: PropTypes.func.isRequired,
  unfullfillWish: PropTypes.func.isRequired,
  setEditable: PropTypes.func.isRequired
}