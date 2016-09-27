import { connect } from 'react-redux'
import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native'

import {parseDate} from '../lib/dateUtil'

import DjiniText from './DjiniText'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

const styles = StyleSheet.create({
  favoriteIcon: {
    color: 'rgb(244, 230, 56)'
  },
  emptyList: {
    marginTop: 50,
    paddingHorizontal: 10,
    textAlign: 'center'
  },
  incomplete: {
    color: 'red'
  }
})

// actions
import {showNote, deleteNote, saveNote} from '../actions/notes'

class NotesList extends Component {

  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  _innerRef: ?PureListView;

  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.swipeoutBtns = this.swipeoutBtns.bind(this)
    this.storeInnerRef = this.storeInnerRef.bind(this)
  }

  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={this.props.notes}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderEmptyList={this.renderEmptyList}
        {...this.props}
      />
    );
  }

  swipeoutBtns (note) {
    const {dispatch} = this.props
    const result = [
      { 
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="delete"/>,
        onPress: () => dispatch(deleteNote(note)),
      },
    ]
    if (note.type === 'task') {
      result.push({
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName={note.done ? "gift" : "gift_done"} iconType="image"/>,
        onPress: () => dispatch(saveNote({...note, done: !note.done}, false)),
      })
    }
    return result
  }

  getDescription(note) {
    let result = ''
    if (note.type === 'task') {
      result += `${note.contact.name}, `
    }
    if (note.dueDate) {
      result += parseDate(note.dueDate).format('Do MMMM')
    }
    return result
  }

  getTitle(note) {
    return note.type === 'reminder' ? note.contact.name : note.title
  }

  renderRow (note) {
    const {dispatch} = this.props
    let icon
    if (note.type === 'reminder') {
      icon = <ListRowIcon name="cake"/>
    }
    else if (note.type === 'task') {
      icon = <ListRowIcon name={note.done ? "giftwhite_done" : "giftwhite"}/>
    }
    return (
      <ListRow 
        title={this.getTitle(note)}
        description={this.getDescription(note)}
        swipeoutBtns={this.swipeoutBtns(note)}
        onPress={() => dispatch(showNote(note))}>
        {note.dueDate ? undefined : <ListRowIcon style={styles.incomplete} name="error-outline"/>}
        {icon}
      </ListRow>
    )
  }

  renderEmptyList() {
    return (
      <DjiniText style={styles.emptyList}>
        Favorisiere einer deiner Kontakte und Djini erstellt dir eine Geburtstagserinnerung. Erfülle einen Wunsch oder eine Idee und du wirst hier daran erinnert.
      </DjiniText>
    );
  }

  renderSeparator(sectionID, rowID) {
    return <ListRowSeperator key={"SEP_" + sectionID + "_" + rowID}/>
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }
}

export default connect()(NotesList)
