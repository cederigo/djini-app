import { connect } from 'react-redux';
import React, {Component} from 'react'

import WMButton from './WMButton'
import {Contact} from '../lib/types'
import {invite} from '../actions/contacts'

class InviteButton extends Component {
  props: {
    contact: Contact,
  }
  render() {
    const {contact, dispatch} = this.props
    
    return (
      <WMButton
        caption={'Jetzt Einladen'}
        onPress={() => dispatch(invite(contact))}
      />
    )
  }
}

export default connect()(InviteButton)