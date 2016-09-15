import { connect } from 'react-redux'
import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native'

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
  }
})

// actions
import {showNote, deleteNote} from '../actions/notes'

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
    return [
      { 
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="delete"/>,
        onPress: () => dispatch(deleteNote(note)),
      },
    ]
  }

  renderRow (note) {
    const {dispatch} = this.props
    let icon
    if (note.type === 'reminder') {
      icon = <ListRowIcon name="cake"/>
    }
    else if (note.type === 'task') {
      icon = <ListRowIcon type="image" name={note.done ? "gift_done" : "gift"}/>
    }
    return (
      <ListRow 
        title={note.title}
        description={note.description}
        swipeoutBtns={this.swipeoutBtns(note)}
        onPress={() => dispatch(showNote(note))}>
        {icon}
      </ListRow>
    )
  }

  renderEmptyList() {
    return (
      <DjiniText style={styles.emptyList}>Füge einen Freund als Favorit hinzu (Swipe) und erhalte gratis Geburtstagserinnerungen</DjiniText>
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
