import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import NotesList from '../components/NotesList'
import { AppBar } from '../components/AppBar'
import DjiniText from '../components/DjiniText'
import DjiniButton from '../components/DjiniButton'

import { deferPastNotes, updateNotesNotifications } from '../actions/notes'
import { checkPermissions, requestPermissions } from '../lib/pushNotification'
import { trackScreenView } from '../lib/analytics'

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
    trackScreenView('notes')
    const { dispatch } = this.props
    this.checkPermissions()
    dispatch(deferPastNotes())
  }

  componentWillReceiveProps() {
    this.checkPermissions()
  }

  updatePermissions(permissions) {
    this.setState({ showPermissionInfo: !permissions.alert && this.props.notes.length })
  }

  checkPermissions() {
    checkPermissions().then(this.updatePermissions)
  }

  requestPermissions() {
    const { dispatch } = this.props
    requestPermissions()
      .then(this.updatePermissions)
      .then(() => dispatch(updateNotesNotifications()))
  }

  render() {
    const { showPermissionInfo } = this.state
    return (
      <View style={styles.container}>
        <AppBar title="Djinis Notizen" />
        <NotesList notes={this.props.notes} />
        {showPermissionInfo ? (
          <PermissionInfo
            style={styles.permissionInfo}
            requestPermissions={() => this.requestPermissions()}
          />
        ) : (
          undefined
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  permissionInfo: {
    margin: 25
  },
  permissionText: {
    marginBottom: 25
  }
})

const PermissionInfo = props => {
  const { requestPermissions, ...other } = props
  return (
    <View {...other}>
      <DjiniText style={styles.permissionText}>
        Soll Djini dich mit Push-Nachrichten an deine Notizen erinnern?
      </DjiniText>
      <DjiniButton onPress={requestPermissions} caption="Ja klar, bitte!" />
    </View>
  )
}

function select(state) {
  return {
    notes: state.notes.toArray()
  }
}
export default connect(select)(Notes)
