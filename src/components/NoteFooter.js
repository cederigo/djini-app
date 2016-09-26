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
      <DjiniText textStyle="dark" style={styles.djiniText}>
        Djini sagt: 
        <DjiniText textStyle="dark" style={styles.text}>{` Meine Wunderlampe verrät mir, dass ${note.contact.name} bald Geburtstag hat. Brauchst du noch ein passendes Geschenk?`}</DjiniText>
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
  const {note, saveNote} = props
  const {wish} = note
  const title = isIdea(wish) ? 'Idee' : 'Wunsh'

  return (
    <View style={styles.container}>
      <DjiniText textStyle="dark" style={styles.djiniText}>
        Djini fragt: 
        <DjiniText textStyle="dark" style={styles.text}>{` Willst du ${note.contact.name}s ${title} wirklich erfüllen?`}</DjiniText>
      </DjiniText>
      <DjiniButton
        type="primary" caption={`${title} erfüllen!`}
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
      <DjiniText textStyle="dark" style={styles.djiniText}>
        Djini sagt:
        {note.done ? 
          <DjiniText textStyle="dark" style={styles.text}> Yeah, well done! Du bist bereit für die Party!</DjiniText>
          : <DjiniText textStyle="dark" style={styles.text}> Gut, du weist, was du schenken möchtest. Organisiere nun das Geschenk! Hopp Hopp!</DjiniText>
        }
      </DjiniText>
      <DjiniButton
        type="primary" caption={note.done ? 'Ah, doch nicht?' : 'Geschenk gekauft?'}
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
