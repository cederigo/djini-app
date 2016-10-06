import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, } from 'react-native';

import DjiniButton from './DjiniButton'
import {DjiniDarkText as DjiniText} from './DjiniText'
import DjiniTextInput from './DjiniTextInput'

// Actions
import {saveWish, deleteWish} from '../actions/wishes'
import {Wish} from '../reducers/wish/wishInitialState'

// Utils
import {isIdea} from '../lib/wishUtil'

export default class WishEditForm extends Component {

  static propTypes = {
    wish: PropTypes.object.isRequired,
    onValidationChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
    this.state = {fields: {...props.wish.toJS()}, isValid: this._isValid(props.wish)}
  }
  
  componentDidMount() {
    this.props.onValidationChange(this.state.isValid)
  }
  
  save() {
    const {dispatch} = this.props
    dispatch(saveWish(new Wish(this.state.fields)))
  }
  
  _isValid(wish) {
    return !!wish.title
  }
  
  _onFieldChange(field, value) {
    const fields = {...this.state.fields, [field]: value}
    const isValid = this._isValid(fields)
    if (isValid !== this.state.isValid) {
      this.props.onValidationChange(isValid)
    }
    this.setState({fields, isValid})
  }

  render() {
    const {dispatch, wish} = this.props
    const {fields} = this.state
    const isWish = !isIdea(wish)
    return ( 
      <View style={styles.content}>
        <DjiniText style={styles.label}>Titel</DjiniText>
        <DjiniTextInput
          autoFocus={true}
          blurOnSubmit={false}
          onSubmitEditing={() => this.refs.details.focus()}
          placeholder="Gib einen aussagekräftigen Titel an…"
          onChangeText={(text) => this._onFieldChange('title', text)}
          value={fields.title}
        />

        <DjiniText style={styles.label}>Details</DjiniText>
        <DjiniTextInput
          ref="details"
          onSubmitEditing={() => this.refs.price.focus()}
          blurOnSubmit={false}
          placeholder="z.B. Grösse, Farbe, Modell, …"
          autoGrow={true}
          onChangeText={(text) => this._onFieldChange('description', text)}
          value={fields.description}
        />

        <DjiniText style={styles.label}>Preis</DjiniText>
        <DjiniTextInput
          ref="price"
          onSubmitEditing={() => this.refs.seenAt.focus()}
          blurOnSubmit={false}
          placeholder="Ungefährer Preis"
          keyboardType="numeric"   
          onChangeText={(text) => this._onFieldChange('price', text)}
          value={fields.price}
        />

        <DjiniText style={styles.label}>Wo gesehen</DjiniText>
        <DjiniTextInput
          ref="seenAt"
          onSubmitEditing={() => this.refs.url.focus()}
          blurOnSubmit={false}
          placeholder="Wo kann dein Wunsch gefunden werden…"
          onChangeText={(text) => this._onFieldChange('seenAt', text)}
          value={fields.seenAt}
        />

        <DjiniText style={styles.label}>Web-Link</DjiniText>
        <DjiniTextInput
          ref="url"
          placeholder="http://…"
          keyboardType="url"   
          onChangeText={(text) => this._onFieldChange('url', text)}
          value={fields.url}
        />

        <View style={styles.toggles}>
          {isWish ?
          <View style={styles.toggle}>
            <DjiniButton
              type="primary"
              style={styles.toggleButton}
              iconStyle={fields.isFavorite ? styles.starIcon : {}}
              active={fields.isFavorite}
              iconName={fields.isFavorite ? 'star' : 'star-border'}
              onPress={() => this._onFieldChange('isFavorite', !fields.isFavorite)}/>
            <DjiniText style={styles.toggleText}>Djini, das will ich unbedingt haben!</DjiniText>
          </View>
          : undefined
          }
          {isWish ?
          <View style={styles.toggle}>
            <DjiniButton 
              type="primary"
              style={styles.toggleButton}
              active={fields.isPrivate}
              iconName={fields.isPrivate ? 'lock' : 'lock-open'}
              onPress={() => this._onFieldChange('isPrivate', !fields.isPrivate)}/>
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
    )
  }
}

const styles = StyleSheet.create({
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
  icon: {
    backgroundColor: 'transparent',
    color: 'rgb(61,63,148)'
  },
})
