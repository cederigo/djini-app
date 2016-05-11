import { connect } from 'react-redux';

// Components
import React, {
  Component,
  PropTypes,
  View,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import WMButton from '../WMButton'

// Actions
import {saveWish, onWishFieldChange} from '../../actions/wishes'

// Utils
import {type, isIdea} from '../../lib/wishUtil'

export default class EditWishForm extends Component {

  render() {
    const {dispatch, wishState} = this.props
    const {wish} = wishState
    let SaveButton, PrivacySwitch
   
    SaveButton = <WMButton 
          onPress={() => dispatch(saveWish(wish))}
          caption={type(wish) + " speichern"}
          disabled={!wish.title}
        />
  
    // Privacy switch only for my wishes (but not for ideas)
    if (!isIdea(wish)) {
      PrivacySwitch = <View>
        <Text style={styles.status}>{wish.isPrivate ? 'Der Wunsch ist privat' : 'Der Wunsch ist öffentlich'}</Text>
        <Switch
          style={styles.switch}
          disabled={false}
          onValueChange={(value) => dispatch(onWishFieldChange('isPrivate', value))}
          value={wish.isPrivate} />
       </View>
    }
  
    return ( 
      <View style={styles.container}>
        <TextInput
          style={styles.titleinput}
          editable={true}
          placeholder="Titel"
          onChangeText={(text) => dispatch(onWishFieldChange('title', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.title}
        />
        <TextInput
          style={styles.textinput}
          editable={true}
          placeholder="Beschreibung"
          onChangeText={(text) => dispatch(onWishFieldChange('description', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.description}
        />
        <TextInput
          style={styles.textinput}
          editable={true}
          placeholder="URL"
          keyboardType="url"   
          onChangeText={(text) => dispatch(onWishFieldChange('url', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.url}
        />
        <TextInput
          style={styles.textinput}
          editable={true}
          placeholder="Gesehen bei"
          onChangeText={(text) => dispatch(onWishFieldChange('seenAt', text))}
          autoCapitalize="none"
          autoCorrect={false}
          value={wish.seenAt}
        />
        {PrivacySwitch}
        {SaveButton}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  titleinput: {
    marginTop: 10,
    fontWeight: 'bold',
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
    marginTop: 10
  },
  textinput: {
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
    marginTop: 10
  },
  switch: {
    padding: 15,
    alignSelf: 'center'
  },
  status: {
    letterSpacing: 1,
    fontSize: 12,
    padding: 15,
    alignSelf: 'center'
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishState: state.wish
  };
}
export default connect(select)(EditWishForm)