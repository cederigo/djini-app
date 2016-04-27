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
    const {wishState, onWishFieldChange, saveWish, setPrivate, styles} = this.props
    const {wish} = wishState
    const editable = wishState.isEditable && !wishState.isFetching
    let ActionButton
    if (editable) {
      ActionButton = <TouchableOpacity
            style={styles.button}
            onPress={() => { saveWish(wish)}}>
            <Text style={styles.buttonText}>Wunsch speichern</Text>
        </TouchableOpacity>
    } else {
      if (wishState.isFetching) {
        ActionButton = <Text>Wunsch wird gespeichert.</Text>
      } else {
        ActionButton = <TouchableOpacity
            style={styles.button}
            onPress={Actions.pop}>
            <Text style={styles.buttonText}>Zurück</Text>
        </TouchableOpacity>
      }
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
        <Switch
          disabled={!editable}
          onValueChange={(value) => setPrivate(value)}
          value={wish.private} />
        {ActionButton}
      </View>
    )
  }
}

AddWishForm.propTypes = {
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
  styles: PropTypes.object.isRequired,
  onWishFieldChange: PropTypes.func.isRequired,
  setPrivate: PropTypes.func.isRequired,
  saveWish: PropTypes.func.isRequired
}