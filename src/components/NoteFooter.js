import React, {PropTypes} from 'react'
import {StyleSheet, View, InteractionManager} from 'react-native'
import {Actions} from 'react-native-router-flux'

import DjiniText from './DjiniText'
import DjiniIcon from './DjiniIcon'
import DjiniButton from './DjiniButton'

import {loadFriendProfile} from '../actions/profile'
import {saveNote} from '../actions/notes'
import {isIdea} from '../lib/wishUtil'

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20
  },
  text: {
    fontWeight: 'normal'
  },
  djiniText: {
    fontWeight: 'bold',
  },
  taskState: {
    height: 60,
  },
  task: {
    position: 'absolute',
    left: 0
  },
  taskDone: {
    position: 'absolute',
    right: 0
  },
  hr: {
    position: 'absolute',
    top: 20, left: 50, right: 60,
    height: 2,
    backgroundColor: 'rgb(212,212,220)',
  },
  button: {
    marginTop: 20
  }
})

export default function NoteFooter (props) {
  const {note, isNew} = props
  if (isNew) {
    return <NewNoteFooter {...props}/>
  }
  else if (note.type === 'reminder') {
    return <ReminderNoteFooter {...props}/>
  } else {
    return <TaskNoteFooter {...props}/>
  }
}

const ReminderNoteFooter = (props) => {
  const {note, dispatch} = props
  return (
    <View style={styles.container}>
      <DjiniText textStyle="dark" style={styles.text}>
        Brauchst du noch ein passendes Geschenk?
      </DjiniText>
      <DjiniButton
        type="primary" caption="Geschenk suchen!"
        style={styles.button}
        onPress={() => {
          Actions.contactsTab()
          InteractionManager.runAfterInteractions(() => {
            dispatch(loadFriendProfile(note.contact));
          })
        }}/>
    </View>
  )
}

const NewNoteFooter = (props) => {
  const {note, saveNote, isValid} = props
  const {wish} = note
  const title = isIdea(wish) ? 
    `Geschenkidee für ${note.contact.name} wirklich erfüllen?` : 
    `Willst du ${note.contact.name}s Wunsch wirklich erfüllen?`
  return (
    <View style={styles.container}>
      <DjiniText textStyle="dark" style={styles.text}>{title}</DjiniText>
      <DjiniButton
        type="primary" caption={`${title} erfüllen!`}
        disabled={!isValid}
        style={styles.button}
        onPress={saveNote}/>
    </View>
  )
}

const TaskNoteFooter = (props) => {
  const {note, dispatch} = props
  return (
    <View style={styles.container}>
      <View style={styles.taskState}>
        <View style={styles.hr}/>
        <DjiniIcon style={styles.task} name={note.done ? 'gift' : 'giftlightblue'} size={40}/>
        <DjiniIcon style={styles.taskDone} name={note.done ? 'giftlightblue_done' : 'gift_done'} size={45}/>
      </View>
      {note.done ? 
        <DjiniText textStyle="dark" style={styles.text}>
          Yeah, well done! Du bist bereit für die Party!
        </DjiniText>
        : <DjiniText textStyle="dark" style={styles.text}>
            Gut, du weisst, was du schenken möchtest. Nun musst du das Geschenk nur noch organisieren.
          </DjiniText>
      }
      <DjiniButton
        type="primary" caption={note.done ? 'Ah, doch nicht?' : 'Geschenk organisiert?'}
        style={styles.button}
        onPress={() => {
          dispatch(saveNote({...note, done: !note.done}))
        }}/>
    </View>
  )
}

NoteFooter.propTypes = {
  note: PropTypes.object.isRequired
}
