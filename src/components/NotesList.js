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
    color: 'rgb(239,71,98)'
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
        component: <SwipeoutButton 
          iconStyle={note.type === 'reminder' ? styles.favoriteIcon : {}}
          iconName={note.type === 'reminder' ? 'favorite' : 'delete'}/>,
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
    if (note.type === 'reminder') {
      return (note.dueDate ? `${parseDate(note.dueDate).format('Do MMMM')}`: '')
    }
    return note.contact.name + (note.dueDate ? `, ${parseDate(note.dueDate).format('Do MMMM')}`: '')
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
        {!note.dueDate || note.state === 'wish-deleted' ? <ListRowIcon style={styles.incomplete} name="error-outline"/> : undefined}
        {icon}
      </ListRow>
    )
  }

  renderEmptyList() {
    return (
      <DjiniText style={styles.emptyList}>
        Favorisiere Kontakte und erfülle Wünsche oder eigene Ideen. Djini erinnert dich an Geburtstage von favorisierten Kontakten und an Geschenke, die du machen willst. 
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
