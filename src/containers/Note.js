import React, {Component, PropTypes} from 'react'
import {ScrollView, View, StyleSheet, TouchableOpacity, InteractionManager, KeyboardAvoidingView} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import {Actions} from 'react-native-router-flux'

import {formatBirthday} from '../lib/dateUtil'
import {loadFriendProfile} from '../actions/profile'
import {saveNote} from '../actions/notes'

import {DjiniDarkIcon as DjiniIcon} from '../components/DjiniIcon'
import {DjiniDarkTextInput as DjiniTextInput} from '../components/DjiniTextInput'
import DateInput from '../components/DateInput'
import {DjiniDarkText as DjiniText} from '../components/DjiniText'
import {AppBar, ActionButton} from '../components/AppBar'
import NoteFooter from '../components/NoteFooter'

class Note extends Component {

  static propTypes = {
    edit: PropTypes.bool,
    isNew: PropTypes.bool.isRequired,
    note: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    saveText: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    const {note} = this.props
    this.onValueChange = this.onValueChange.bind(this)
    const fields = this.getFields(note)
    this.state = {...fields, edit: props.edit, editable: Object.values(fields).some((f) => f.editable)}
  }

  /**
   * "Business" Rules
   */
  getFields(note) {
    return {
      title: {value: note.title, editable: note.type === 'task'},
      dueDate: {value: note.dueDate, editable: note.type === 'task' || !note.contact.birthday},
      comment: {value: note.comment, editable: note.type === 'task'}
    }
  }
  getFormattedDate(note) {
    const contact = note.contact
    const hint = note.type === 'reminder' ?
      'Leider kennt Djini den Geburtstag nicht. Hilf und trage diesen manuell nach'
      : 'Leider kennt Djini das Datum nicht. Hilf und trage es manuell nach'
    if (note.type === 'reminder' && contact.birthday) {
        return formatBirthday(contact.birthday)
    }
    return note.dueDate ? moment(note.dueDate).format('DD.MM.YYYY') : hint
  }

  openWish(note) {
    const {dispatch} = this.props
    // TODO Find a better way to link ;-(
    Actions.contacts({type: 'reset', duration: 0})
    InteractionManager.runAfterInteractions(() => {
      dispatch(loadFriendProfile(note.contact, note.wish.id))
    })
  }

  edit() {
    const {note} = this.props
    this.setState({...this.getFields(note), edit: true})
  }

  cancelEdit() {
    this.setState({edit: false})
  }

  save() {
    const {dispatch, note, onSave} = this.props
    const {title, dueDate, comment} = this.state
    dispatch(saveNote({...note, title: title.value, dueDate: dueDate.value, comment: comment.value}))
    onSave(this)
  }

  onValueChange(field, value) {
    const existingField = this.state[field]
    this.setState({[field]: {...existingField, value}})
  }

  render() {
    const {note, isNew} = this.props
    const {type, title, comment, dueDate, contact, wish} = note
    const {editable, edit, ...fields} = this.state
    return (
      <View style={styles.container}>
        <AppBar 
          title="Notiz" textStyle="dark" 
          showBackButton={true} backButtonText={edit ? "Abbrechen" : undefined}
          onBack={edit ? () => this.cancelEdit() : undefined}>
          {edit ? 
            <ActionButton textStyle="dark" text={this.props.saveText} onPress={() => this.save()}/>  
            : editable ? <ActionButton textStyle="dark" text="Bearbeiten" onPress={() => this.edit()}/>
              : undefined
          }
        </AppBar>

        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoid}>

          <ScrollView keyboardShouldPersistTaps={true} style={styles.container}>

            <View style={[styles.row, styles.titleField]}>
              <DjiniIcon style={styles.titleIcon} size={60} name={type === 'reminder' ? 'cake' : 'giftdarkblue'}/>
              {fields.title.editable && edit ?
                <DjiniTextInput autoFocus={true} style={styles.value} inputStyle={styles.title} minHeight={45} value={fields.title.value} onChangeText={(val) => this.onValueChange('title', val)}/>
                : <DjiniText style={[styles.value, styles.title]} numberOfLines={2}>{title}</DjiniText>
              }
            </View>

            <View style={[styles.row, styles.field]}>
              <DjiniIcon style={styles.icon} size={20} name="person"/>
              <DjiniText style={styles.value}>{contact.name}</DjiniText>
            </View>

            <TouchableOpacity style={[styles.row, styles.field]} disabled={!!dueDate} onPress={() => this.edit()}>
              <DjiniIcon style={styles.icon} size={20} name="event"/>
              {fields.dueDate.editable && edit ?
                <DateInput autoFocus={!fields.title.editable} date={fields.dueDate.value} minHeight={20} autoYear={true} onDateChange={(val) => this.onValueChange('dueDate', val)}/>
                : <DjiniText style={styles.value} numberOfLines={3}>
                    {this.getFormattedDate(this.props.note)}
                    {dueDate ? undefined : <DjiniIcon style={styles.missingValue} name="error-outline"/>}
                  </DjiniText>
              }
            </TouchableOpacity>

            {dueDate ?
              <View style={[styles.row, styles.field]}>
                <DjiniIcon style={styles.icon} size={20} name="alarm"/>
                <DjiniText style={styles.value} numberOfLines={2}>
                  Djini wird dich 1 Woche vorher und am Tag selbst erinnern
                </DjiniText>
              </View>
              : undefined
            }

            {wish && !isNew ?
              <View style={[styles.row, styles.field]}>
                <DjiniIcon style={styles.icon} size={20} name="giftlightblue"/>
                <TouchableOpacity style={styles.value} onPress={() => this.openWish(this.props.note)}>
                  <DjiniText style={[styles.value, styles.wishText]} numberOfLines={1}>{wish.title}</DjiniText>
                </TouchableOpacity>
              </View>

              : undefined
            }

            {wish ?
              <View style={[styles.row, styles.field]}>
                <DjiniIcon style={styles.icon} size={20} name={'list'}/>
                {fields.comment.editable && edit ?
                  <DjiniTextInput style={styles.value} maxLength={100} autoGrow={true} placeholder="Kommentar..." value={fields.comment.value} onChangeText={(val) => this.onValueChange('comment', val)}/>
                  : <DjiniText style={styles.value} numberOfLines={3}>{comment}</DjiniText>
                }
              </View>
              : undefined
            }
            {!edit || isNew ? 
              <NoteFooter  {...this.props} saveNote={() => this.save()} />
              : undefined
            }
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

Note.defaultProps = {
  onSave: (component) => component.setState({edit: false}),
  saveText: 'Fertig',
  isNew: false
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  wishText: {
    color: 'rgb(101,104,244)',
    textDecorationLine: 'underline'
  },
  titleField: {
    marginLeft: 10,
    marginRight: 25,
    marginBottom: 10,
    height: 60
  },
  titleIcon: {
    marginRight: 10
  },
  field: {
    marginLeft: 15,
    marginTop: 10,
    marginRight: 25,
  },
  icon: {
    marginRight: 20,
    paddingTop: 2,
    alignSelf: 'flex-start'
  },
  value: {
    flex: 1
  },
  missingValue: {
    color: 'red',
  }
});

function select(state) {
  const note = state.note.toJS()
  return {note}
}

export default connect(select)(Note)

export {Note as NoteDialog}
