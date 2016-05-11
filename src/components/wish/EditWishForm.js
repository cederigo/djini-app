import { connect } from 'react-redux';

import React, {
  Component,
  PropTypes,
  View,
  Switch,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

// Actions
import {saveWish, onWishFieldChange} from '../../actions/wishes'

export default class EditWishForm extends Component {

  render() {
    const {dispatch, wishState, styles} = this.props
    const {wish} = wishState
    let SaveButton
   
    SaveButton = <WMButton 
          onPress={() => dispatch(saveWish(wish))}
          caption="Wunsch speichern"
          disabled={!wish.title}
        />
  
    return ( 
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          editable={true}
          placeholder="Titel"
          onChangeText={(text) => dispatch(onWishFieldChange('title', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.title}
        />
        <TextInput
          style={styles.input}
          editable={true}
          placeholder="Beschreibung"
          onChangeText={(text) => dispatch(onWishFieldChange('description', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.description}
        />
        <TextInput
          style={styles.input}
          editable={true}
          placeholder="URL"
          keyboardType="url"   
          onChangeText={(text) => dispatch(onWishFieldChange('url', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.url}
        />
        <TextInput
          style={styles.input}
          editable={true}
          placeholder="Gesehen bei"
          onChangeText={(text) => dispatch(onWishFieldChange('seenAt', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.seenAt}
        />
        <Text>{wish.isPrivate ? 'Der Wunsch ist privat' : 'Der Wunsch ist öffentlich'}</Text>
        <Switch
          disabled={false}
          onValueChange={(value) => dispatch(onWishFieldChange('isPrivate', value))}
          value={wish.isPrivate} />
        {SaveButton}
      </View>
    )
  }
}

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishState: state.wish
  };
}
export default connect(select)(EditWishForm)

EditWishForm.propTypes = {
  styles: PropTypes.object.isRequired
}