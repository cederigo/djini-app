import { connect } from 'react-redux';

import React, {Component} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

import {AppBar, ActionButton} from '../AppBar'
import WMButton from '../WMButton'

// Actions
import {saveWish, onWishFieldChange} from '../../actions/wishes'

// Utils
import {isIdea} from '../../lib/wishUtil'
import WMColors from '../../lib/WMColors'
import {Wish} from '../../lib/types'

class WishEditView extends Component {

  props: {
    wish: Wish
  }

  render() {
    const {dispatch, wish} = this.props
    const title = isIdea(wish) ? 'Idee erfassen' : 'Wunsch erfassen'
  
    return ( 
      <View style={styles.container}>
        <AppBar showBackButton={true} title={title}>
          <ActionButton iconName="save" onPress={() => dispatch(saveWish(wish))}/>
        </AppBar>

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

          {!isIdea(wish) ? 
            <View style={styles.buttons}>
              <WMButton 
                style={styles.button}
                iconName={wish.isPrivate ? 'lock' : 'lock-open'}
                onPress={() => dispatch(onWishFieldChange('isPrivate', !wish.isPrivate)) }/>
              <WMButton
                style={styles.button}
                iconName={wish.isFavorite ? 'favorite' : 'favorite-border'}
                onPress={() => dispatch(onWishFieldChange('isFavorite', !wish.isFavorite))}/>
            </View> :
            undefined
          }

        </View>
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
    marginHorizontal: 20
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
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
  },
  button: {
    marginRight: 10
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

export default connect()(WishEditView)