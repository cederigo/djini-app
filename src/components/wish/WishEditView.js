import { connect } from 'react-redux';

import React, {Component} from 'react';
import {View, Switch, StyleSheet, Text, TextInput, Platform} from 'react-native';

import WMButton from '../WMButton'
import {NavBar, NavButton} from '../NavBar'

// Actions
import {saveWish, onWishFieldChange} from '../../actions/wishes'

// Utils
import {isIdea} from '../../lib/wishUtil'

export default class EditWishForm extends Component {

  constructor() {
    super()
    this.renderPrivacyView = this.renderPrivacyView.bind(this)
  }

  renderPrivacyView() {
    const {dispatch, wishState} = this.props
    const {wish} = wishState
    return (
     <View style={styles.privacy}>
      <Switch
        disabled={false}
        onValueChange={(value) => dispatch(onWishFieldChange('isPrivate', value))}
        value={wish.isPrivate} />
      <Text style={styles.privacyText}>{wish.isPrivate ? 'Der Wunsch ist privat' : 'Der Wunsch ist öffentlich'}</Text>
     </View>
   )
  }

  render() {
    const {dispatch, wishState} = this.props
    const {wish, isFetching} = wishState
  
    return ( 
      <View style={styles.container}>

        <NavBar>
         <NavButton
           onPress={() => dispatch(saveWish(wish))}
           text={"Speichern"}
           enabled={wish.title && !isFetching}
         />
        </NavBar>

        <View style={styles.content}>
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
          {isIdea(wish) ? undefined : this.renderPrivacyView()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'flex-start'
  },
  input: {
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
  },
  privacy: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center'
  },
  privacyText: {
    marginLeft: 10,
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