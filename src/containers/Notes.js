import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View} from 'react-native';

import NotesList from '../components/NotesList'
import {AppBar} from '../components/AppBar'

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  render() {
    return(
      <View style={ styles.container}>
        <AppBar title="Djini Notizen"/>
        <NotesList notes={this.props.notes}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    notes: state.notes.toArray()
  };
}
export default connect(select)(Notes)
