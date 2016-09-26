/* global setInterval, clearInterval */

import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View} from 'react-native';

import NotesList from '../components/NotesList'
import {AppBar} from '../components/AppBar'
import DjiniText from '../components/DjiniText'
import DjiniButton from '../components/DjiniButton'

import {deferPastNotes} from '../actions/notes'
import {checkPermissions, requestPermissions, updateLocalNotifications} from '../lib/pushNotification'


class Notes extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  constructor(props) {
    super(props)
    this.timer = undefined
    this.updatePermissions = this.updatePermissions.bind(this)
    this.state = {
      showPermissionInfo: false
    }
  }

  componentDidMount() {
    console.log('componentDidMount()')
    const {dispatch, notes} = this.props
    this.checkPermissions()
    dispatch(deferPastNotes(notes))
    this.timer = setInterval(() => {
      dispatch(deferPastNotes(notes))
    }, 60 * 60 * 1000)
  }

  componentWillReceiveProps() {
    this.checkPermissions()
  }

  updatePermissions(permissions) {
    updateLocalNotifications()
    this.setState({showPermissionInfo: !permissions.alert && this.props.notes.length})
  }

  checkPermissions() {
    checkPermissions().then(this.updatePermissions)
  }

  requestPermissions() {
    requestPermissions().then(this.updatePermissions)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount()')
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  
  render() {
    const {showPermissionInfo} = this.state
    return(
      <View style={ styles.container}>
        <AppBar title="Djini Notizen"/>
        <NotesList notes={this.props.notes}/>
        {showPermissionInfo ? 
          <PermissionInfo style={styles.permissionInfo} requestPermissions={() => this.requestPermissions()}/>
          : undefined
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionInfo: {
    margin: 25,
  },
  permissionText: {
    marginBottom: 25
  }
});

const PermissionInfo = (props) => {
  const {requestPermissions, ...other} = props
  return (
    <View {...other}>
      <DjiniText style={styles.permissionText}>Djini kann dich auch gerne mit Push-Nachrichten an deine Notizen erinnern.</DjiniText>
      <DjiniButton onPress={requestPermissions} caption="Ja klar, bitte!"/>
    </View>
  )
}

function select(state) {
  return { 
    notes: state.notes.toArray()
  };
}
export default connect(select)(Notes)
