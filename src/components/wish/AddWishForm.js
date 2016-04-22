import Immutable from 'immutable';
import React, {
  Component,
  PropTypes,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default class AddWishForm extends Component {

  render() {
    const {wishState, actions, styles} = this.props
    const {title, description, url} = wishState.fields
    
    return ( 
      <View style={styles.container}>
        <Text style={styles.text}>Erfasse einen Wunsch</Text>
        <TextInput
          style={styles.input}
          editable={wishState.isEditable}
          placeholder="Titel"
          onChangeText={(text) => { actions.onWishFieldChange('title', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          value={title}
        />
        <TextInput
          style={styles.input}
          editable={wishState.isEditable}
          placeholder="Beschreibung"
          onChangeText={(text) => { actions.onWishFieldChange('description', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          value={description}
        />
        <TextInput
          style={styles.input}
          editable={wishState.isEditable}
          placeholder="URL"
          keyboardType="url"   
          onChangeText={(text) => { actions.onWishFieldChange('url', text)}}
          autoCapitalize="none"
          autoCorrect={false}
          value={url}
        />
        <TouchableOpacity
            style={styles.button}
            onPress={() => { actions.saveWish(title, description, url, user, owner)}}>
            <Text style={styles.buttonText}>Wunsch erfassen</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

AddWishForm.propTypes = {
    wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}